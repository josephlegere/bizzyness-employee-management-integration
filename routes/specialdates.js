const express = require('express');
const router = express.Router();
const { addSpecialdates } = require('../services/designate_service');
const { specialdateInsert } = require('../controllers/specialdates');

router
    .route('/:client/:tenant/:user')
    .post(addSpecialdates, specialdateInsert);

module.exports = router;