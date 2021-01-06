const express = require('express');
const router = express.Router();
const requestAttendance = require('../services/attendance');
const { attendanceList } = require('../controllers/attendance');

router
    .route('/')
    .post(requestAttendance, attendanceList);

// router
//     .route('verify')

module.exports = router;