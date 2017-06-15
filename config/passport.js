const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const dbConfig = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  // Local Strategy
  passport.use(new localStrategy((username, password, done) => {
    // Match Username
    let query = { username: username };

    User.findOne(query, (err, user) => {

      if (err) throw err;

      // No Username Found
      if (!user) {
        return done(null, false, { message: "No User Found." });
      }

      // Match Password
      bcrypt.compare(password, user.password, (err, isMatch) => {

        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong Password." });
        }
      });
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}