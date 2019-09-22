import AWS from 'aws-sdk';
import fs from 'fs';
import generateUUID from './uuid';
import logger from './logger';
import waiter from './waiter';

export default class Textractor {
  constructor() {
    AWS.config.region = 'us-east-2';
  }
  public async runTheThingAndWriteRawText(localFilePath: string): Promise<void> {
    const s3Bucket = 'healthhack2019cannacare';
    const file = fs.readFileSync(localFilePath);
    const fileName = generateUUID();

    const s3 = new AWS.S3();

    let jobId = '';

    const textout = () => {
      const converter = new AWS.Textract();

      const params: AWS.Textract.StartDocumentAnalysisRequest = {
        DocumentLocation: {
          S3Object: { Bucket: s3Bucket, Name: fileName },
        },
        FeatureTypes: ['TABLES', 'FORMS'],
      };
      converter.startDocumentAnalysis(
        params,
        (
          err: AWS.AWSError,
          data: any // AWS.Textract.Types.StartDocumentAnalysisResponse,
        ) => {
          logger.debug(
            `Textract job started.  Err: ${JSON.stringify(
              err,
            )} | Data: ${JSON.stringify(data)}`,
          );
          jobId = data.JobId ? data.JobId : '';
        },
      );
    };

    const upload = () => {
      logger.debug(`Smashing file to S3: ${fileName}`);
      s3.putObject(
        {
          Bucket: s3Bucket,
          Key: fileName,
          Body: file,
          ContentType: 'application/pdf',
        },
        (err: AWS.AWSError, data: AWS.S3.Types.PutObjectOutput) => {
          logger.debug(
            `S3 Upload Done.  Err: ${JSON.stringify(
              err,
            )} | Data: ${JSON.stringify(data)}`,
          );
          textout();
        },
      );
    };

    upload();

    await waiter.retryCallUntilNotFailed<void>(
      () => {
        if (jobId !== '') {
          throw new Error('Job still not retrieved...');
        }
      },
      60,
      1000,
    );

    logger.debug(`Textract job ${jobId} has started!`);



    // const getFile = (): Buffer => {
    //   logger.debug(`Geting file from S3: ${fileName}`);
    //   s3.getObject(
    //     {
    //       Bucket: 'healthhack2019cannacare',
    //       Key: fileName,
    //     },
    //     (err: AWS.AWSError, data: AWS.S3.Types.PutObjectOutput) => {
    //       logger.debug(
    //         `S3 Get Done.  Err: ${JSON.stringify(err)} | Data: ${JSON.stringify(
    //           data,
    //         )}`,
    //       );
    //     },
    //   );
    // };
  }
}
