const { Training } = require('../../models/training');
const { Book } = require('../../models/book');
const { ObjectId } = require('mongodb');
const { RequestError } = require('../../helpers');
const moment = require('moment');

const create = async (req, res) => {
  const { _id: owner } = req.user;
  const { books: booksToTrain, startDate, finishDate } = req.body;

  

  const findBooks = await Book.find({ owner });

  const books = findBooks.filter(book =>
    booksToTrain.includes(ObjectId(book._id).toString()),
  );

  books.forEach(book => [(book.status = 'read'), book.save()]);

  const totalPages = books.reduce(
    (total, { totalPages }) => total + totalPages,
    0,
  );

  const finish = moment(finishDate).format('dd:mm:yyyy');
  console.log(finish);
  const start = moment(startDate).format('dd:mm:yyyy');
  const days = finish.diff(start, 'days');

  const plannedPages = Math.round(totalPages / days);
  const noTraining = await Training.find({owner});
  console.log(noTraining);
  if(noTraining.length !== 0){
    throw RequestError(409,`Training already exist!`);
  } else{
  const training = await Training.create({
    startDate: startDate.replace(/[.]/g, ''),
    finishDate: finishDate.replace(/[.]/g, ''),
    books: books,
    owner: owner,
    date: String(days),
    plannedPages: plannedPages,
    totalPages: totalPages,
  });
  res.status(201).json(training);}
};

module.exports = create;
