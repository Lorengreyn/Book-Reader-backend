const { Training } = require('../../models/training');
const { RequestError } = require('../../helpers');
const moment = require('moment');

const statistic = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { dateNow, pages } = req.body;

  const time = moment().format('HH:mm:ss');
  const traning = await Training.findOne({ _id: id });

  const sumPages = Math.round(traning.factPages + pages);
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