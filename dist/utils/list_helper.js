"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const countBy_1 = __importDefault(require("lodash/countBy"));
const groupBy_1 = __importDefault(require("lodash/groupBy"));
function dummy(blogs) {
    return 1;
}
exports.dummy = dummy;
function totalLikes(blogs) {
    return blogs.reduce((sum, { likes }) => sum + likes, 0);
}
exports.totalLikes = totalLikes;
function favoriteBlog(blogs) {
    let copyBlogs = [...blogs];
    copyBlogs.sort((a, b) => b.likes - a.likes);
    return copyBlogs[0];
}
exports.favoriteBlog = favoriteBlog;
function mostBlogs(blogsList) {
    const bloggers = countBy_1.default(blogsList, 'author');
    const result = Object.entries(bloggers).reduce((result, [author, blogs]) => {
        if (blogs > result.blogs)
            return { author, blogs };
        else
            return result;
    }, { author: '', blogs: 0 });
    return result.author !== '' ? result : undefined;
}
exports.mostBlogs = mostBlogs;
function mostLikes(blogsList) {
    const bloggers = groupBy_1.default(blogsList, 'author');
    const result = Object.entries(bloggers).reduce((result, [author, blogs]) => {
        const likes = totalLikes(blogs);
        return likes > result.likes ? { author, likes } : result;
    }, { author: '', likes: 0 });
    return result.author !== '' ? result : undefined;
}
exports.mostLikes = mostLikes;
//# sourceMappingURL=list_helper.js.map