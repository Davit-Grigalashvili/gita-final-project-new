const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    id: String,
    email: String,
    date: {type: Date, default: Date.now},
});

const Newsletter = mongoose.model('newsletter', newsletterSchema, "newsletters");
module.exports = Newsletter;
