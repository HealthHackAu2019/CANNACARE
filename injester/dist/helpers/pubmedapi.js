"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const logger_1 = tslib_1.__importDefault(require("../helpers/logger"));
class PubMedApi {
    callApi(url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.retryCallUntilNotFailed(url, 60, 5000);
            if (result != null) {
                if (result.status === 200) {
                    logger_1.default.debug(`Successful response, returning result`);
                    return result.data;
                }
                throw new Error(`Unsuccessful response calling url "${url}" -
         Status - ${result.status} (${result.statusText})`);
            }
        });
    }
    retryCallUntilNotFailed(url, numAttemptsLeft, waitIntervalIsMs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield axios_1.default.get(url);
                return result;
            }
            catch (e) {
                if (numAttemptsLeft > 0) {
                    logger_1.default.warn(`Jira call failed, retrying ${numAttemptsLeft} more times...`);
                    yield this.delay(waitIntervalIsMs);
                    return this.retryCallUntilNotFailed(url, numAttemptsLeft - 1, waitIntervalIsMs);
                }
                throw e;
            }
        });
    }
    delay(ms) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
}
exports.default = PubMedApi;
//# sourceMappingURL=pubmedapi.js.map