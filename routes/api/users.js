const express = require('express');


const ctrl = require('../../controllers/users');

const { ctrlWrapper, isLoggedIn } = require('../../helpers');

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
router.get('/', (req, res)=>{
  res.send('<a href="/google"></a>')
})
router.get(
  '/google', 
   passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

router.get(
  '/google/callback',
 passport.authenticate('google', {
    successRedirect: '/api/users/success',
    
  }),
  passport.authenticate('google', {
    failureRedirect: '/api/users/failed',
  }));

router.get('/success', isLoggedIn, (req, res) => {
 res.redirect('http://localhost:3000/book-reader-frontend/library'),
 
});

router.get('/failed', (req, res) => {
  res.status(418).send(`Sorry something wrong`);
});

module.exports = router;
