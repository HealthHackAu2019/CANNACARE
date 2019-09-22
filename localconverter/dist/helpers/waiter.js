"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("./logger"));
class Waiter {
    static retryCallUntilNotFailed(func, numAttemptsLeft, waitIntervalIsMs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = func();
                return result;
            }
            catch (e) {
                if (numAttemptsLeft > 0) {
                    logger_1.default.warn(`Jira call failed, retrying ${numAttemptsLeft} more times...`);
                    yield this.delay(waitIntervalIsMs);
                    return this.retryCallUntilNotFailed(func, numAttemptsLeft - 1, waitIntervalIsMs);
                }
                throw e;
            }
        });
    }
    static delay(ms) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
}
exports.default = Waiter;
//# sourceMappingURL=waiter.js.map