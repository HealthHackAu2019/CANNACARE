"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("./helpers/logger"));
class Main {
    static Run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Starting application...`);
            try {
                logger_1.default.info(`Finishing application...`);
            }
            catch (ex) {
                logger_1.default.error(`Unexpected Error`, ex);
            }
        });
    }
}
exports.Main = Main;
Main.Run();
//# sourceMappingURL=program.js.map