"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function info(...params) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
}
exports.info = info;
function error(...params) {
    console.error(...params);
}
exports.error = error;
//# sourceMappingURL=logger.js.map