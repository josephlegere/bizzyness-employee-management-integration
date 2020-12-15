const express = require('express');
const router = express.Router();
const requestAttendance = require('../services/attendance');
const { attendanceList } = require('../controllers/attendance');

router
    .route('/')
    .get(requestAttendance, attendanceList);

module.exports = router;