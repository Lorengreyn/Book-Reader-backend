const { Book } = require('../../models/book');

const { RequestError } = require('../../helpers');

const updateById = async (req, res) => {
  const { id } = req.params;
  const { resume: review, readPages: pages } = req.body;

  const result = await Book.findById(id);

  if (!result) {
    throw RequestError(404, 'Not found');
  }

  if (result.status === 'done') {
    result.resume = review;
    await result.save();
    res.json(result);
  } else {
    res.json({ message: 'Эта книга еще не прочитана' });
  }
};

module.exports = updateById;

//добавить проверку на владельца
