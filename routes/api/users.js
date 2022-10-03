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
  '/google', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");},
   passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

router.get(
  '/google/callback',
 passport.authenticate('google', {
    successRedirect: '/success',
  }),
  passport.authenticate('google', {
    failureRedirect: '/api/users/failed',
  }));

router.get('/success', (req, res) => {
  res.send(`Welcome name - ${req.user.name},
  id - ${req.user.id},
  email - ${req.user.email},
   `);
 
});

router.get('/failed', (req, res) => {
  res.status(418).send(`Sorry something wrong`);
});

module.exports = router;
