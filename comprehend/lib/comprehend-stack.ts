import cdk = require('@aws-cdk/core');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import sqs = require('@aws-cdk/aws-sqs');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import {
  S3EventSource,
  SqsEventSource,
  SnsEventSource,
  DynamoEventSource
} from '@aws-cdk/aws-lambda-event-sources';
import { Duration } from '@aws-cdk/core';

export class ComprehendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //**********SNS Topics******************************
    const jobCompletionTopic = new sns.Topic(this, 'JobCompletion');

    //**********IAM Roles******************************
    const textractServiceRole = new iam.Role(this, 'TextractServiceRole', {
      assumedBy: new iam.ServicePrincipal('textract.amazonaws.com')
    });
    const policyStatement = new iam.PolicyStatement();
    policyStatement.addResources(jobCompletionTopic.topicArn);
    policyStatement.addActions('sns:Publish');

    textractServiceRole.addToPolicy(policyStatement);

    //**********S3 Batch Operations Role******************************
    const s3BatchOperationsRole = new iam.Role(this, 'S3BatchOperationsRole', {
      assumedBy: new iam.ServicePrincipal('batchoperations.s3.amazonaws.com')
    });

    //**********S3 Bucket******************************
    //S3 bucket for input documents and output
    const contentBucket = new s3.Bucket(this, 'DocumentsBucket', {
      versioned: false
    });

    const existingContentBucket = new s3.Bucket(
      this,
      'ExistingDocumentsBucket',
      { versioned: false }
    );
    existingContentBucket.grantReadWrite(s3BatchOperationsRole);

    const inventoryAndLogsBucket = new s3.Bucket(
      this,
      'InventoryAndLogsBucket',
      { versioned: false }
    );
    inventoryAndLogsBucket.grantReadWrite(s3BatchOperationsRole);

    //**********DynamoDB Table*************************
    //DynamoDB table with links to output in S3
    const outputTable = new dynamodb.Table(this, 'OutputTable', {
      partitionKey: { name: 'documentId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'outputType', type: dynamodb.AttributeType.STRING }
    });

    //DynamoDB table with links to output in S3
    const documentsTable = new dynamodb.Table(this, 'DocumentsTable', {
      partitionKey: { name: 'documentId', type: dynamodb.AttributeType.STRING },
      stream: dynamodb.StreamViewType.NEW_IMAGE
    });

    //**********SQS Queues*****************************

    //DLQ
    const dlq = new sqs.Queue(this, 'DLQ', {});

    //Input Queue for sync jobs
    const syncJobsQueue = new sqs.Queue(this, 'SyncJobs', {
      deadLetterQueue: { queue: dlq, maxReceiveCount: 50 }
    });

    //Input Queue for async jobs
    const asyncJobsQueue = new sqs.Queue(this, 'AsyncJobs', {
      deadLetterQueue: { queue: dlq, maxReceiveCount: 50 }
    });

    //Queue
    const jobResultsQueue = new sqs.Queue(this, 'JobResults', {
      deadLetterQueue: { queue: dlq, maxReceiveCount: 50 }
    });
    //Trigger
    //jobCompletionTopic.subscribeQueue(jobResultsQueue);
    jobCompletionTopic.addSubscription(
      new subs.SqsSubscription(jobResultsQueue)
    );

    //**********Lambda Functions******************************

    // Helper Layer with helper functions
    const helperLayer = new lambda.LayerVersion(this, 'HelperLayer', {
      code: lambda.Code.asset('lambda/helper'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
      license: 'Apache-2.0',
      description: 'Helper layer.'
    });

    // Textractor helper layer
    const textractorLayer = new lambda.LayerVersion(this, 'Textractor', {
      code: lambda.Code.asset('lambda/textractor'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
      license: 'Apache-2.0',
      description: 'Textractor layer.'
    });

    //------------------------------------------------------------

    // S3 Event processor
    const s3Processor = new lambda.Function(this, 'S3Processor', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.asset('lambda/s3processor'),
      handler: 'lambda_function.lambda_handler',
      environment: {
        SYNC_QUEUE_URL: syncJobsQueue.queueUrl,
        ASYNC_QUEUE_URL: asyncJobsQueue.queueUrl,
        DOCUMENTS_TABLE: documentsTable.tableName,
        OUTPUT_TABLE: outputTable.tableName
      }
    });
    //Layer
    s3Processor.addLayers(helperLayer);
    //Trigger

    s3Processor.addEventSource(
      new S3EventSource(contentBucket, {
        events: [s3.EventType.OBJECT_CREATED]
      })
    );
    //Permissions
    documentsTable.grantReadWriteData(s3Processor);
    syncJobsQueue.grantSendMessages(s3Processor);
    asyncJobsQueue.grantSendMessages(s3Processor);

    //------------------------------------------------------------

    // S3 Batch Operations Event processor
    const s3BatchProcessor = new lambda.Function(this, 'S3BatchProcessor', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.asset('lambda/s3batchprocessor'),
      handler: 'lambda_function.lambda_handler',
      environment: {
        DOCUMENTS_TABLE: documentsTable.tableName,
        OUTPUT_TABLE: outputTable.tableName
      },
      reservedConcurrentExecutions: 1
    });
    //Layer
    s3BatchProcessor.addLayers(helperLayer);
    //Permissions
    documentsTable.grantReadWriteData(s3BatchProcessor);
    s3BatchProcessor.grantInvoke(s3BatchOperationsRole);
    const s3BatchOperationsRolePolicy = new iam.PolicyStatement();
    s3BatchOperationsRolePolicy.addAllResources();
    s3BatchOperationsRolePolicy.addActions('lambda:*');
    s3BatchOperationsRole.addToPolicy(s3BatchOperationsRolePolicy);

    //------------------------------------------------------------

    // Document processor (Router to Sync/Async Pipeline)
    const documentProcessor = new lambda.Function(this, 'TaskProcessor', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.asset('lambda/documentprocessor'),
      handler: 'lambda_function.lambda_handler',
      environment: {
        SYNC_QUEUE_URL: syncJobsQueue.queueUrl,
        ASYNC_QUEUE_URL: asyncJobsQueue.queueUrl
      }
    });
    //Layer
    documentProcessor.addLayers(helperLayer);
    //Trigger
    documentProcessor.addEventSource(
      new DynamoEventSource(documentsTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON
      })
    );

    //Permissions
    documentsTable.grantReadWriteData(documentProcessor);
    syncJobsQueue.grantSendMessages(documentProcessor);
    asyncJobsQueue.grantSendMessages(documentProcessor);

    //------------------------------------------------------------

    // Sync Jobs Processor (Process jobs using sync APIs)
    const syncProcessor = new lambda.Function(this, 'SyncProcessor', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.asset('lambda/syncprocessor'),
      handler: 'lambda_function.lambda_handler',
      reservedConcurrentExecutions: 1,
      timeout: Duration.seconds(10),
      environment: {
        OUTPUT_TABLE: outputTable.tableName,
        DOCUMENTS_TABLE: documentsTable.tableName,
        AWS_DATA_PATH: 'models'
      }
    });
    //Layer
    syncProcessor.addLayers(helperLayer);
    syncProcessor.addLayers(textractorLayer);
    //Trigger
    syncProcessor.addEventSource(
      new SqsEventSource(syncJobsQueue, {
        batchSize: 1
      })
    );
    //Permissions
    contentBucket.grantReadWrite(syncProcessor);
    existingContentBucket.grantReadWrite(syncProcessor);
    outputTable.grantReadWriteData(syncProcessor);
    documentsTable.grantReadWriteData(syncProcessor);
    const textractPolicy = new iam.PolicyStatement();
    textractPolicy.addAllResources();
    textractPolicy.addActions('textract:*');
    syncProcessor.addToRolePolicy(textractPolicy);

    //------------------------------------------------------------

    // Async Job Processor (Start jobs using Async APIs)
    const asyncProcessor = new lambda.Function(this, 'ASyncProcessor', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.asset('lambda/asyncprocessor'),
      handler: 'lambda_function.lambda_handler',
      reservedConcurrentExecutions: 1,
      timeout: Duration.seconds(60),
      environment: {
        ASYNC_QUEUE_URL: asyncJobsQueue.queueUrl,
        SNS_TOPIC_ARN: jobCompletionTopic.topicArn,
        SNS_ROLE_ARN: textractServiceRole.roleArn,
        AWS_DATA_PATH: 'models'
      }
    });

    //Layer
    asyncProcessor.addLayers(helperLayer);
    //Triggers
    // TODO: Run async job processor every so often
    // const rule = new events.Rule(this, 'Rule', {
    //   schedule: Schedule.expression('rate(5 minutes)')
    // });
    // rule.addTarget(asyncProcessor);
    //Run when a job is successfully complete
    asyncProcessor.addEventSource(new SnsEventSource(jobCompletionTopic));
    //Permissions
    contentBucket.grantRead(asyncProcessor);
    existingContentBucket.grantReadWrite(asyncProcessor);
    asyncJobsQueue.grantConsumeMessages(asyncProcessor);
    const asyncPolicyRole = new iam.PolicyStatement();
    asyncPolicyRole.addResources(textractServiceRole.roleArn);
    asyncPolicyRole.addActions('iam:PassRole');

    asyncProcessor.addToRolePolicy(asyncPolicyRole);
    const asyncPolicyTextract = new iam.PolicyStatement();
    asyncPolicyTextract.addResources(textractServiceRole.roleArn);
    asyncPolicyTextract.addActions('textract:*');

    asyncProcessor.addToRolePolicy(asyncPolicyTextract);

    //------------------------------------------------------------

    // Async Jobs Results Processor
    const jobResultProcessor = new lambda.Function(this, 'JobResultProcessor', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.asset('lambda/jobresultprocessor'),
      handler: 'lambda_function.lambda_handler',
      memorySize: 2000,
      reservedConcurrentExecutions: 50,
      timeout: Duration.seconds(900),
      environment: {
        OUTPUT_TABLE: outputTable.tableName,
        DOCUMENTS_TABLE: documentsTable.tableName,
        AWS_DATA_PATH: 'models'
      }
    });
    //Layer
    jobResultProcessor.addLayers(helperLayer);
    jobResultProcessor.addLayers(textractorLayer);
    //Triggers
    jobResultProcessor.addEventSource(
      new SqsEventSource(jobResultsQueue, {
        batchSize: 1
      })
    );
    //Permissions
    outputTable.grantReadWriteData(jobResultProcessor);
    documentsTable.grantReadWriteData(jobResultProcessor);
    contentBucket.grantReadWrite(jobResultProcessor);
    existingContentBucket.grantReadWrite(jobResultProcessor);
    const jobResultPolicy = new iam.PolicyStatement();
    jobResultPolicy.addAllResources();
    jobResultPolicy.addActions('textract:*');
    jobResultProcessor.addToRolePolicy(jobResultPolicy);
  }
}
