var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/oauth2callback',
  passport.authenticate('google', {
    successRedirect: '/friendGroups',
    failureRedirect: '/home'
  })
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/home');
});

module.exports = router;
