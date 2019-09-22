import logger from './logger';

export default class Waiter{
  public static async retryCallUntilNotFailed<T>(
    func: (() => T),
    numAttemptsLeft: number,
    waitIntervalIsMs: number
  ): Promise<T> {
    let result: T;
    try {
      result = func();
      return result;
    } catch (e) {
      if (numAttemptsLeft > 0) {
        logger.warn(
          `Func call failed, retrying ${numAttemptsLeft} more times...`
        );
        await this.delay(waitIntervalIsMs);
        return this.retryCallUntilNotFailed(
          func,
          numAttemptsLeft - 1,
          waitIntervalIsMs
        );
      }
      throw e;
    }
  }

  private static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}