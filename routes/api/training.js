const express = require('express');

const ctrl = require('../../controllers/training');

const { ctrlWrapper } = require('../../helpers');

const {
    authenticate,
    validationBody,
    isValidId,
  } = require('../../middlewares');
  
  const { schemas } = require('../../models/book');
  
  const router = express.Router();
  
  router.get('/', authenticate, ctrlWrapper(ctrl.getAll));

  module.exports = router;