export default class Waiter {
    static retryCallUntilNotFailed<T>(func: (() => T), numAttemptsLeft: number, waitIntervalIsMs: number): Promise<T>;
    private static delay;
}
