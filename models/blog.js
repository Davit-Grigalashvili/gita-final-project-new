const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: String,
    author: String,
    date: String,
    replies: [{
        author: String,
        date: String,
        reply: String,
    }]

})
const blogSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    content: String,
    author: String,
    date: String,
    formatedDate: String,
    comments: [commentSchema]
});


const Blog = mongoose.model('Blog', blogSchema, "blogs");
module.exports = Blog;
