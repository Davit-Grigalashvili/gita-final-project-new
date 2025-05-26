const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.error('Error destroying session', err);
        }

        res.redirect('/login')
    })
});

module.exports = router;
