const { Training } = require('../../models/training');
const { Book } = require('../../models/book');
const { RequestError } = require('../../helpers');
const moment = require('moment');

const statistic = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { factDate, pages } = req.body;

  const momentDate = moment(factDate).format('yyyy.MM.DD');
  
  const time = moment().format('HH:mm:ss');
  const training = await Training.findOne({ _id: id });

  const finish = training.finishDate;
  const currentDate = moment().format('yyyy.MM.DD');
  
  const start = moment(currentDate.replace(/[.]/g, ''));

  const diff = start.diff(finish, 'days');

  let date;
  
  if (training.dateNow.length !== 0) {
    date = training.dateNow[training.dateNow.length - 1];
    if (momentDate === date.factDate) {
      date.factDate = momentDate;
      date.time = time;
      date.pages += pages;
    } else {
      training.dateNow.push({
        factDate: momentDate,
        time: time,
        pages: pages,
      });
    }
  };

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

  const thisBook = await Book.findById(book);
  thisBook.readPages += pages;
  const diffPages = Math.round(thisBook.totalPages - thisBook.readPages);
  if (pages > thisBook.totalPages || diffPages < 0) {
    throw RequestError(400, `Inserted pages can't be more than pages in book`);
  }
  if (thisBook.readPages >= thisBook.totalPages) {
    thisBook.status = 'done';
  }
  thisBook.save();

  const sumPages = Math.round(training.factPages + pages);
  const result = await Training.findOneAndUpdate(
    { _id: id, owner },

    {
      factPages: sumPages,
      dateNow: training.dateNow,
    },
    { new: true },
  );
  if (!result) {
    throw RequestError(404, `training with id=${id} not found`);
  }
  if (diff > 0) {
    await Training.findById({ _id: id });
    res.json(diffPages);
  }else  if (result.totalPages === result.factPages) {
    res.status(200).json({ message: 'Мои витаннячка' });
      await Training.deleteOne({ _id: id });
  } else {
    res.status(201).json(result);
  }
};

module.exports = statistic;
