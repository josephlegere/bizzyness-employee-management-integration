const express = require('express');
const router = express.Router();
const { getAttendance, updateAttendance } = require('../services/attendance');
const { attendanceList, verifyAttendance } = require('../controllers/attendance');

router
    .route('/')
    .post(getAttendance, attendanceList);

router
    .route('/confirm')
    .post(updateAttendance, verifyAttendance);

router
    .route('/reject')
    .post(updateAttendance, verifyAttendance);

module.exports = router;