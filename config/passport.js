var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOne({ 'googleId': profile.id }, function (err, user) {
      if (err) return cb(err);
      if (user) {
//        if(!user.avatar) {
//           user.avatar = profile.photos[0].value;
//           user.save(function(err) {
        return cb(null, user);
      } else {
        // we have a new student via OAuth!
        var newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        //   avatar: user.avatar
        });
        newUser.save(function (err) {
          if (err) return cb(err);
          return cb(null, newUser);
        });
      }
    });
  }
));


// if (err) return cb(err);
//         if (student) {
//             if(!student.avatar) {
//                 student.avatar = profile.photos[0].value;
//                 student.save(function(err) {
//                     return cb(null, student);
//                 })
//             } else {
//                 return cb(null, student);
//             }


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});