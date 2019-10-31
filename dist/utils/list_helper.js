"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dummy(blogs) {
    return 1;
}
exports.dummy = dummy;
function totalLikes(blogs) {
    return blogs.reduce((sum, { likes }) => sum + likes, 0);
}
exports.totalLikes = totalLikes;
//# sourceMappingURL=list_helper.js.map