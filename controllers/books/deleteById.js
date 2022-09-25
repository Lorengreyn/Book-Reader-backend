const { Book } = require('../../models/book');

const { RequestError } = require('../../helpers');

const deleteById = async (req, res) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);

  res.json({ message: 'Book deleted successfully' });
};

module.exports = deleteById;
