const { Training } = require('../../models/training');
const { Book } = require('../../models/book');
const { RequestError } = require('../../helpers');
const moment = require('moment');

const statistic = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { factDate, pagesNow } = req.body;

  const timestamp = moment().format('HH:mm:ss');
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
  
  const thisBook = await Book.findById(book);
  thisBook.readPages += pagesNow;
  const diffPages = Math.round(thisBook.totalPages - thisBook.readPages);
  
   
  if(pagesNow > thisBook.totalPages || diffPages < 0){
    throw RequestError(400, `Inserted pages can't be more than pages in book`);
  };
  if (thisBook.readPages >= thisBook.totalPages) {
    thisBook.status = 'done';
  }; 
  thisBook.save();

console.log(pagesNow);
  const sumPages = Math.round(training.factPages + pagesNow);
  const result = await Training.findOneAndUpdate(
    { _id: id, owner },

    {factPages: sumPages,
      $push:{dateNow:{factDate},      
      time:{timestamp},
      pages:{pagesNow}},
    },
    { new: true },
  );
  if (!result) {
    throw RequestError(404, `training with id=${id} not found`);
  };
  
  res.status(201).json(result);
};

module.exports = statistic;