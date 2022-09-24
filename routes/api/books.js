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
//нужно изменить на patch
router.put(
  '/:id',
  isValidId,
  validationBody(schemas.addSchema),
  ctrlWrapper(ctrl.updateById),
);

module.exports = router;
