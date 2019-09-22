import AWS from 'aws-sdk';
import fs from 'fs';
import generateUUID from './uuid';
import logger from './logger';
import waiter from './waiter';

// This code is horrendous and only written for demo purposes, please don't write code like this :)
// (Or use AWS services in this way)
export default class Textractor {
  constructor() {
    AWS.config.region = 'us-east-2';
  }
  public async runTheThingAndWriteRawText(
    localFilePath: string,
  ): Promise<void> {
    const s3Bucket = 'healthhack2019cannacare';
    const file = fs.readFileSync(localFilePath);
    const fileName = generateUUID() + '.pdf';

    const localRawFileName =
      localFilePath.substring(0, localFilePath.length - 4) + '.txt';
    const s3 = new AWS.S3();

    let jobId = '';

    const textout = () : void => {
      const converter = new AWS.Textract();

      //TODO: Getting error 'Request has invalid parameters' from Textract ??
      const params: AWS.Textract.StartDocumentAnalysisRequest = {
        DocumentLocation: {
          S3Object: { Bucket: s3Bucket, Name: fileName },
        },
        FeatureTypes: ['TABLES', 'FORMS']
      };
      converter.startDocumentAnalysis(params, (
        err: AWS.AWSError,
        data: any, // AWS.Textract.Types.StartDocumentAnalysisResponse,
      ) => {
        logger.debug(
          `Textract job started.  Err: ${JSON.stringify(
            err,
          )} | Data: ${JSON.stringify(data)} | Params: ${JSON.stringify(params)}`,
        );
        jobId = data && data.JobId ? data.JobId : '';
        if (jobId && jobId.length > 0){
          this.waitForJobAndWriteResults(localRawFileName, jobId);
        }
      });
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

    waiter.retryCallUntilNotFailed<void>(
      () => {
        if (jobId !== '') {
          throw new Error('Job still not retrieved...');
        }
      },
      60,
      1000,
    );

    

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

  private async waitForJobAndWriteResults(localRawFileName: string, jobId: string): Promise<boolean> {
    let resultFileSaved = false;

    const getresult = (nextToken: string = '') => {
      const converter = new AWS.Textract();

      const params: AWS.Textract.GetDocumentAnalysisRequest = {
        JobId: jobId,
        MaxResults: 1000,
        NextToken: nextToken,
      };
      converter.getDocumentAnalysis(params, (
        err: AWS.AWSError,
        data: any, // AWS.Textract.Types.StartDocumentAnalysisResponse,
      ) => {
        logger.debug(
          `Textract job retrieved.  Err: ${JSON.stringify(
            err,
          )} | Data: ${JSON.stringify(data)}`,
        );
        if (!err && data) {
          // TODO: paging with the next token
          fs.writeFileSync(localRawFileName, JSON.stringify(data));
          resultFileSaved = true;
        }
      });
    };

    return await waiter.retryCallUntilNotFailed<boolean>(
      () => {
        getresult('');
        if (resultFileSaved !== true) {
          throw new Error('Job result still not retrieved...');
        }
        return true;
      },
      60,
      1000,
    );
  }
}
