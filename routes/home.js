var express = require('express');
var router = express.Router();
var homeCtrl = require('../controllers/home');

router.get('/', homeCtrl.index);


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

module.exports = router;