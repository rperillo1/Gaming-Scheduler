var express = require('express');
var router = express.Router();
var groupsCtrl = require('../controllers/groups');

router.get('/', isLoggedIn, groupsCtrl.index);
router.post('/', isLoggedIn, groupsCtrl.createGroup);
router.post('/addMember', isLoggedIn, groupsCtrl.addMember);
router.delete('/', isLoggedIn, groupsCtrl.delete);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

module.exports = router;