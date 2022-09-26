const { Training } = require("../../models/training");
const { RequestError } = require("../../helpers");
const moment = require ('moment');

const statistic = async (req, res) => {
  const { _id: owner } = req.user;
  const {id} = req.params;
  const { dateNow, pages } = req.body;
  // const factPages = req.training;
  const time = moment().format( 'HH:mm:ss');
  // console.log(factPages);
const previosPages = await Training.findOne({factPages:Training.factPages})
console.log(previosPages);
  const sumPages = Math.round(previosPages + pages);
  const result = await Training.findOneAndUpdate({ owner }, 
    {
      dateNow: dateNow,
      time: time,
      factPages: sumPages,
      pages: pages,
    },
    { new: true }
  );
   if (!result) {
    throw RequestError(404, `training with id=${id} not found`);
  }
  res.status(201).json( result );
};

module.exports = statistic;