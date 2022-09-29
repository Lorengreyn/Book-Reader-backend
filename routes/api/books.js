const express = require('express');

const ctrl = require('../../controllers/books');

const { ctrlWrapper } = require('../../helpers');

const {
  authenticate,
  validationBody,
  isValidId,
} = require('../../middlewares');

const { schemas } = require('../../models/book');

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(ctrl.getAll));

router.get('/:id', isValidId, ctrlWrapper(ctrl.getById));

router.post(
  '/',
  authenticate,
  validationBody(schemas.addSchema),
  ctrlWrapper(ctrl.add),
);

router.patch(
  '/:id',
  isValidId,
  authenticate,
  validationBody(schemas.updateStatusSchema),
  ctrlWrapper(ctrl.updateById),
);

router.delete('/:id', isValidId, ctrlWrapper(ctrl.deleteById));

module.exports = router;
