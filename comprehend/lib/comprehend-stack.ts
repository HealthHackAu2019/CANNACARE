import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigateway = require('@aws-cdk/aws-apigateway');
import s3 = require('@aws-cdk/aws-s3');

export class ComprehendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'comprehend');
    
    const uploadFileFunction = new lambda.Function(this, 'UploadFile', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.asset('lambda'),
      handler: 'uploadfile.main',
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    bucket.grantReadWrite(uploadFileFunction);

    const mainApi = new apigateway.RestApi(this, "comprehension", {
      restApiName: "fileupload",
      description: "This coordinates uploading the file, comprehending it and returning the results"
    });

    const apiUploadFileLambda = new apigateway.LambdaIntegration(uploadFileFunction, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    mainApi.root.addMethod("POST", apiUploadFileLambda); 
  }
}
