"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const uuid_1 = tslib_1.__importDefault(require("./uuid"));
const logger_1 = tslib_1.__importDefault(require("./logger"));
const waiter_1 = tslib_1.__importDefault(require("./waiter"));
class Textractor {
    constructor() {
        aws_sdk_1.default.config.region = 'us-east-2';
    }
    runTheThingAndWriteRawText(localFilePath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const s3Bucket = 'healthhack2019cannacare';
            const file = fs_1.default.readFileSync(localFilePath);
            const fileName = uuid_1.default();
            const s3 = new aws_sdk_1.default.S3();
            let jobId = '';
            const textout = () => {
                const converter = new aws_sdk_1.default.Textract();
                const params = {
                    DocumentLocation: {
                        S3Object: { Bucket: s3Bucket, Name: fileName },
                    },
                    FeatureTypes: ['TABLES', 'FORMS'],
                };
                converter.startDocumentAnalysis(params, (err, data // AWS.Textract.Types.StartDocumentAnalysisResponse,
                ) => {
                    logger_1.default.debug(`Textract job started.  Err: ${JSON.stringify(err)} | Data: ${JSON.stringify(data)}`);
                    jobId = data.JobId ? data.JobId : '';
                });
            };
            const upload = () => {
                logger_1.default.debug(`Smashing file to S3: ${fileName}`);
                s3.putObject({
                    Bucket: s3Bucket,
                    Key: fileName,
                    Body: file,
                    ContentType: 'application/pdf',
                }, (err, data) => {
                    logger_1.default.debug(`S3 Upload Done.  Err: ${JSON.stringify(err)} | Data: ${JSON.stringify(data)}`);
                    textout();
                });
            };
            upload();
            yield waiter_1.default.retryCallUntilNotFailed(() => {
                if (jobId !== '') {
                    throw new Error('Job still not retrieved...');
                }
            }, 60, 1000);
            logger_1.default.debug(`Textract job ${jobId} has started!`);
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
        });
    }
}
exports.default = Textractor;
//# sourceMappingURL=textractor.js.map