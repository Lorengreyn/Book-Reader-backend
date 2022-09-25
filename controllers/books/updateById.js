const { Book } = require('../../models/book');

const { RequestError } = require('../../helpers');

const updateById = async (req, res) => {
  const { id } = req.params;
  const { readPages: pages } = req.body;

  const result = await Book.findById(id);

  if (!result) {
    throw RequestError(404, 'Not found');
  }

  result.readPages += pages;
  if (result.readPages >= result.totalPages) {
    result.status = 'done';
  }

  await result.save();
  res.json(result);
};

module.exports = updateById;
