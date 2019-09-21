import axios, { AxiosResponse } from "axios";
import logger from "../helpers/logger";

export default class PubMedApi {

  public async callApi(url: string): Promise<string> {
    const result = await this.retryCallUntilNotFailed<string>(url, 60, 5000);
    if (result != null) {
      if (result.status === 200) {
        logger.debug(`Successful response, returning result`);
        return result.data as string;
      }

      throw new Error(
        `Unsuccessful response calling url "${url}" -
         Status - ${result.status} (${result.statusText})`
      );
    }
  }

  private async retryCallUntilNotFailed<T>(
    url: string,
    numAttemptsLeft: number,
    waitIntervalIsMs: number
  ): Promise<AxiosResponse<T>> {
    let result: AxiosResponse<T>;
    try {
      result = await axios.get<T>(url);
      return result;
    } catch (e) {
      if (numAttemptsLeft > 0) {
        logger.warn(
          `Jira call failed, retrying ${numAttemptsLeft} more times...`
        );
        await this.delay(waitIntervalIsMs);
        return this.retryCallUntilNotFailed(
          url,
          numAttemptsLeft - 1,
          waitIntervalIsMs
        );
      }
      throw e;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}