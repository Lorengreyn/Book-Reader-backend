const { Book } = require('../../models/book');

const { RequestError } = require('../../helpers');

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Book.findById(id).select({
    _id: 0,
    owner: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  //   const result = await Book.findOne({ id: id });
  if (!result) {
    throw RequestError(404, 'Not found');
  }
  res.json(result);
};

module.exports = getById;
