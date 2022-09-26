const { Training } = require('../../models/training');
const { Book } = require('../../models/book');
const { ObjectId } = require('mongodb');
const moment = require('moment');

const create = async (req, res) => {
  const { _id: owner } = req.user;
  const { books: booksToTrain, startDate, finishDate } = req.body;


  const findBooks = await Book.find({owner});

  const books = findBooks.filter(book =>
    booksToTrain.includes(ObjectId(book._id).toString()),
  );

 
  books.forEach(book => (book.status = 'read'));


  const totalPages = books.reduce(
    (total, { totalPages }) => total + totalPages,
    0,
  );


  const finish = moment(finishDate.replace(/[.]/g, ''));
  const start = moment(startDate.replace(/[.]/g, ''));
  const days = finish.diff(start, 'days');

  const plannedPages = Math.round(totalPages / days);

   
  const training = await Training.create({
    startDate: startDate.replace(/[.]/g, ''),
    finishDate: finishDate.replace(/[.]/g, ''),
    books: books,
    owner: owner,
    date: String(days),
    plannedPages: plannedPages,
    
  });
  res.json(training);
};

module.exports = create;
