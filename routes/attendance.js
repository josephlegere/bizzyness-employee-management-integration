const express = require('express');
const router = express.Router();
const { attendanceList } = require('../controllers/attendance');

router
    .route('/')
    .get(attendanceList);

module.exports = router;