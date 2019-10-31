"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = __importDefault(require("../models/blog"));
const blogRouter = express_1.Router();
blogRouter.get('/', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_1.default.find({});
        response.json(blogs);
    }
    catch (error) {
        next(error);
    }
}));
blogRouter.post('/', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = new blog_1.default(request.body);
    if (blog.likes === undefined)
        blog.likes = 0;
    if (!blog.title && !blog.url)
        return response.status(400).end();
    try {
        const result = yield blog.save();
        response.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}));
blogRouter.delete('/:id', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield blog_1.default.findByIdAndDelete(request.params.id);
        return response.status(204).end();
    }
    catch (error) {
        next(error);
    }
}));
blogRouter.put('/:id', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.body.likes)
        return response.status(400).send();
    try {
        const result = yield blog_1.default.findByIdAndUpdate(request.params.id, { likes: request.body.likes });
        response.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = blogRouter;
//# sourceMappingURL=blogs.js.map