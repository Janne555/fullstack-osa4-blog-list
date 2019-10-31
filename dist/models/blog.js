"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
});
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
const Blog = mongoose_1.model('Blog', blogSchema);
exports.default = Blog;
//# sourceMappingURL=blog.js.map