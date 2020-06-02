var express = require('express');
var router = express.Router();
var gamesCtrl = require('../controllers/games');

router.get('/:group/games', isLoggedIn, gamesCtrl.index);
router.post('/:group/games', isLoggedIn, gamesCtrl.createGame);
router.put('/:group/games', isLoggedIn, gamesCtrl.updateName);


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

module.exports = router;