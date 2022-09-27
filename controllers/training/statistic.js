const { Training } = require('../../models/training');
const { Book } = require('../../models/book');
const { RequestError } = require('../../helpers');
const moment = require('moment');

const statistic = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { dateNow, pages } = req.body;

  const time = moment().format('HH:mm:ss');
  const training = await Training.findOne({ _id: id });

  let book;

  for (let i = 0; i < training.books.length; ) {
    const el = await Book.findById(training.books[i]);
    if (el.status === 'done') {
      i++;
      continue;
    } else {
      book = el;
      break;
    }
  }
  const result1 = await Book.findById(book);
  result1.readPages += pages;
  if (result1.readPages >= result1.totalPages) {
    result1.status = 'done';
    result1.readPages = result1.totalPages;
  }
  result1.save();

  const sumPages = Math.round(training.factPages + pages);
  const result = await Training.findOneAndUpdate(
    { _id: id, owner },
    {
      dateNow: dateNow,
      time: time,
      factPages: sumPages,
      pages: pages,
    },
    { new: true },
  );
  if (!result) {
    throw RequestError(404, `training with id=${id} not found`);
  }
  res.status(201).json(result);
};

module.exports = statistic;

//сделать проверку что бы пользователь не смог внести брольше страниц чем осталось в книге
// + это автоматически пофиксит проблему привышения тотала страниц тренинга
