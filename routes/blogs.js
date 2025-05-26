const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');


const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res, next) {
    const blogs = await Blog.find({});
    blogs.reverse();
    const email = req.session.user.email;

    res.render('blogs', {blogs, email});
});

router.get('/new', requireAuth, function (req, res, next) {
    const email = req.session.user.email;
    res.render('new_blog', {error: null, email});
});

router.post('/new', requireAuth, async function (req, res, next) {
    const {title, description, content} = req.body;
    const email = req.session.user.email;

    if (!title || !content) {
        res.render("new_blog", {error: "Missing title or content", email});
        return;
    }

    if (title.length > 20) {
        res.render("new_blog", {error: "Title length must be less than 20 characters", email});
        return;
    }


    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const currentMonthString = months[currentMonth];
    const formatedDate = `${currentDay} ${currentMonthString} ${currentYear}`;

    const newBlogData = {
        id: String(Date.now()),
        title,
        description,
        content,
        author: req.session.user.email,
        date: new Date().toLocaleString(),
        formatedDate
    }

    try {
        const newBlog = new Blog(newBlogData)
        await newBlog.save();

        res.redirect('/blogs');

    } catch (err) {
        console.log(err);
    }

});

router.get('/:blogId', requireAuth, async function (req, res, next) {
    const {blogId} = req.params;
    const {email} = req.session.user;

    try {
        const blogs = await Blog.find({})
        blogs.reverse();
        const blog = await Blog.findOne({id: blogId})

        res.render("blog", {email, blog, blogs});
    } catch (err) {
        console.log(err);
    }


})

router.post('/:blogId/comment', requireAuth, async function (req, res, next) {
    const {blogId} = req.params;
    const {comment} = req.body;
    const author = req.session.user.email;

    if (!comment || comment.trim() === '') {
        return res.redirect(`/blogs/${blogId}`);
    }

    try {
        const blog = await Blog.findOne({id: blogId});
        if (!blog) {
            return res.redirect('/blogs');
        }

        // Create new comment object matching your schema
        const newComment = {
            comment: comment.trim(),
            author: author,
            date: new Date().toLocaleString(),
            replies: []
        };

        // Add comment to blog
        blog.comments.push(newComment);
        await blog.save();

        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/blogs/${blogId}`);
    }
});

// ADD REPLY ROUTE
router.post('/:blogId/comment/:commentIndex/reply', requireAuth, async function (req, res, next) {
    const {blogId, commentIndex} = req.params;
    const {reply} = req.body;
    const author = req.session.user.email;

    if (!reply || reply.trim() === '') {
        return res.redirect(`/blogs/${blogId}`);
    }

    try {
        const blog = await Blog.findOne({id: blogId});
        if (!blog || !blog.comments[commentIndex]) {
            return res.redirect(`/blogs/${blogId}`);
        }

        // Create new reply object matching your schema
        const newReply = {
            author: author,
            date: new Date().toLocaleString(),
            reply: reply.trim()
        };

        // Add reply to specific comment
        blog.comments[commentIndex].replies.push(newReply);
        await blog.save();

        res.redirect(`/blogs/${blogId}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/blogs/${blogId}`);
    }
});

module.exports = router;
