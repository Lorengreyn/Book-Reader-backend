const { Training } = require('../../models/training');
const { Book } = require('../../models/book');
const { ObjectId } = require('mongodb');
const moment = require('moment');

const create = async (req, res) => {
  const { _id: owner } = req.user;
  const { books: booksToTrain, startDate, finishDate } = req.body;

  //находим все книги
  const findBooks = await Book.find();
  //Фильтруем и находим нужные
  const books = findBooks.filter(book =>
    booksToTrain.includes(ObjectId(book._id).toString()),
  );

  //переводим в статус "читаем"
  books.forEach(book => (book.status = 'read'));

  //общее количество страниц
  const totalPages = books.reduce(
    (total, { totalPages }) => total + totalPages,
    0,
  );

  //высчитываем количество дней
  const finish = moment(finishDate.replace(/[.]/g, ''));
  const start = moment(startDate.replace(/[.]/g, ''));
  const days = finish.diff(start, 'days');

  //страниц в день
  const plannedPages = Math.round(totalPages / days);

  //создаем тренинг
  const training = await Training.create({
    startDate: startDate.replace(/[.]/g, ''),
    finishDate: finishDate.replace(/[.]/g, ''),
    books: books,
    owner: owner,
    result: {
      type: [
        {
          date: String(days),
          factPages: totalPages,
          plannedPages: plannedPages,
        },
      ],
    },
  });
  res.json(training);
};

module.exports = create;
