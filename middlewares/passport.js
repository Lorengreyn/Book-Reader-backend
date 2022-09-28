const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { userService: services } = require('../services');

const googleSettings = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://book-reader-backend.herokuapp.com/api/users/google/callback',
  // 'http://localhost:3000/api/users/google/callback',
};

passport.use(
  'google',
  new GoogleStrategy(
    googleSettings,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        };

        User.findOne({ googleId: profile.id }).then(async currentUser => {
          if (currentUser) {
            const id = currentUser._id;
            const payload = { id };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: '1d',
            });

            await services.updateToken(id, token);

            currentUser.token = token;
            done(null, currentUser);
          } else {
            const result = await new User({
              ...newUser,
            }).save();

            const id = result._id;
            const payload = { id };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: '1d',
            });

            await services.updateToken(id, token);

            result.token = token;
            done(null, result);
          }
        });
      } catch (error) {
        done(new Error(error.message));
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

module.exports = passport;
