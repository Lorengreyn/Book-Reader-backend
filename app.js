const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const passport = require('passport');
const cookieSession = require('cookie-session');

require('./middlewares/passport');

const authRouter = require('./routes/api/users');
const booksRouter = require('./routes/api/books');
const trainingRouter = require('./routes/api/training');

const app = express();

app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/training', trainingRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _, res, __) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
