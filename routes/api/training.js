const express = require('express');

const ctrl = require('../../controllers/training');

const { ctrlWrapper } = require('../../helpers');

const {
  authenticate,
  validationBody,
  isValidId,
} = require('../../middlewares');

const { schemas } = require('../../models/book');

const { schemasTraining } = require('../../models/training');

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(ctrl.getAll));

router.post('/', authenticate, ctrlWrapper(ctrl.create));

router.patch(
  "/:idTraining",
  authenticate,
  validationBody(schemasTraining.statisticTrainingSchema),
  ctrlWrapper(ctrl.statistic)
);

module.exports = router;
