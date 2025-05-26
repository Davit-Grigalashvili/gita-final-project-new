const express = require('express');
const router = express.Router();
const Newsletter = require("../models/newsletter");
const Blog = require("../models/Blog");


router.get('/', async function (req, res) {

    const email = req.session.user ? req.session.user.email : null;
    let blogs = await Blog.find({});
    blogs.reverse();
    blogs = blogs.slice(0, 3);

    res.render('newsletter', {email, blogs})
});

router.post('/', async function (req, res) {

    const {email} = req.body;

    try {
        const newNewsletter = new Newsletter({id: String(Date.now()), email})
        const res = await newNewsletter.save();
        console.log(res);
    } catch (err) {
        console.error(err);
    }

    res.redirect('/newsletter');

})

module.exports = router;
