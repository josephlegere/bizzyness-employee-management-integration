const express = require('express');
const router = express.Router();
const { getAttendance, verifyAttendance } = require('../services/designate_service');
const { attendanceList, attendanceVerified } = require('../controllers/attendance');

router
    .route('/:client/:tenant/:user')
    .get(getAttendance, attendanceList);

router
    .route('/verify/:task')
    .post(verifyAttendance, attendanceVerified);

module.exports = router;