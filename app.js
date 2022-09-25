const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/api/users');
const booksRouter = require('./routes/api/books');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users', authRouter);
app.use('/api/books', booksRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use((_, res) => {
//   res.status(404).json({ message: 'Not found' });
// });

app.use((err, _, res, __) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

// GOOGLE
const passport = require('passport');
const cookieSession = require('cookie-session');

require('./middlewares/passport');
const isLoggedIn = require('./helpers');

app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ message: 'You are not logged in' });
});

app.get('/failed', (req, res) => {
  res.send('Failed');
});

app.get('/success', (req, res) => {
  console.log(req.user.emails[0].value);
  res.send(`Welcome name - ${req.user.displayName},
  id - ${req.user.id},
  email - ${req.user.emails[0].value},
   `);
});

app.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failed',
  }),
  function (req, res) {
    res.redirect('/success');
  },
);

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

module.exports = app;
