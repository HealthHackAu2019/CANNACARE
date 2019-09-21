export default class PubMedApi {
    callApi(url: string): Promise<string>;
    private retryCallUntilNotFailed;
    private delay;
}
