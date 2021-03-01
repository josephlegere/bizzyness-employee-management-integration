const express = require('express');
const router = express.Router();
const { getAttendance, updateAttendance } = require('../services/designate_service');
const { attendanceList, verifyAttendance } = require('../controllers/attendance');

router
    .route('/:client/:task/:server/:tenant')
    .get(getAttendance, attendanceList);

router
    .route('/confirm')
    .post(updateAttendance, verifyAttendance);

router
    .route('/reject')
    .post(updateAttendance, verifyAttendance);

module.exports = router;