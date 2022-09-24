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

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _, res, __) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
