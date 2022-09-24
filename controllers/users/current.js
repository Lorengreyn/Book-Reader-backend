const { User } = require('../../models/user');

const jwt = require('jsonwebtoken');

const { RequestError } = require('../../helpers');

const { SECRET_KEY } = process.env;

const current = async (req, res) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  const { id } = jwt.verify(token, SECRET_KEY);
  const user = await User.findById(id);
  if (!user || !user.token) {
    RequestError(401, 'Unauthorized');
  }
  res.json({
    name: user.name,
    email: user.email,
    books: user.books,
    training: user.training,
  });
};

module.exports = current;
