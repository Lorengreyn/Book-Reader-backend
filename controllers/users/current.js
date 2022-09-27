const { User } = require('../../models/user');
const {Book} = require("../../models/book");
const { Training } = require("../../models/training");

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
  const {_id: owner} = req.user;
 const book = await Book.find({owner},"-createdAt -updatedAt").populate();
 const training = await Training.find({owner},"-createdAt -updatedAt").populate();

  res.json({
    name: user.name,
    email: user.email,
    books: book,
    training: training,
  });
};

module.exports = current;
