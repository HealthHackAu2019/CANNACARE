import logger from './helpers/logger';
import Textractor from './helpers/textractor';

export class Main {
  public static async Run(): Promise<void> {
    logger.info(`Starting application...`);
    try {
      const theHardCodedFileNamePleaseDeleteMeOneDay = 'C:\\Temp\\_healthhack\\ExampleResearchEthicsApp.pdf';
      const textr = new Textractor();
      await textr.runTheThingAndWriteRawText(theHardCodedFileNamePleaseDeleteMeOneDay);
      logger.info(`Finishing application...`);
    } catch (ex) {
      logger.error(`Unexpected Error`, ex);
    }
  }
}
Main.Run();
