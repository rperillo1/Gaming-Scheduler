var express = require('express');
var router = express.Router();
var pollsCtrl = require('../controllers/polls');

router.get('/:group/:gameName', isLoggedIn, pollsCtrl.index);
router.post('/:group/:gameName', isLoggedIn, pollsCtrl.addPoll);
router.delete('/:group/:gameName', isLoggedIn, pollsCtrl.deletePoll);
router.post('/:group/:gameName/vote', isLoggedIn, pollsCtrl.vote);


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

module.exports = router;