"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unknownEndpoint(request, response) {
    response.status(404).send({ error: 'unknown endpoint' });
}
exports.unknownEndpoint = unknownEndpoint;
function errorHandler(error, request, response, next) {
    console.error(error.message);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message.split('\n')[0] });
    }
    next(error);
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=middleware.js.map