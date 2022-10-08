const express = require('express');

const ctrl = require('../../controllers/users');

const { ctrlWrapper } = require('../../helpers');

const { validationBody, authenticate } = require('../../middlewares');

const { schemas } = require('../../models/user');

const passport = require('passport');

const router = express.Router();

// signup
router.post(
  '/signup',
  validationBody(schemas.registerSchema),
  ctrlWrapper(ctrl.register),
);

// signin
router.post(
  '/login',
  validationBody(schemas.loginSchema),
  ctrlWrapper(ctrl.login),
);

router.get('/logout', authenticate, ctrlWrapper(ctrl.logout));

router.get('/current', authenticate, ctrlWrapper(ctrl.current));

// GOOGLE

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect(
    `https://app-book-reader.netlify.app/login?token=${req.user.token}&name=${req.user.name}&${req.user.email}`,
  );
});

module.exports = router;
