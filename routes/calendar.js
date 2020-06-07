var express = require('express');
var router = express.Router();
var calendarCtrl = require('../controllers/calendar');

router.post('/:group/:gameName/calendar', isLoggedIn, calendarCtrl.push);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

module.exports = router;