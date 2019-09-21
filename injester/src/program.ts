import logger from './helpers/logger';

export class Main {
  public static async Run(): Promise<void> {
    logger.info(`Starting application...`);
    try {
      logger.info(`Finishing application...`);
    } catch (ex) {
      logger.error(`Unexpected Error`, ex);
    }
  }
}
Main.Run();
