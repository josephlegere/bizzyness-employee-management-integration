const express = require('express');
const router = express.Router();
const { getAttendance, verifyAttendance, addAttendance } = require('../services/designate_service');
const { attendanceList, attendanceVerified, attendanceInsert } = require('../controllers/attendance');

router
    .route('/:client/:tenant/:user')
    .get(getAttendance, attendanceList)
    .post(addAttendance, attendanceInsert);

router
    .route('/verify/:task')
    .post(verifyAttendance, attendanceVerified);

module.exports = router;