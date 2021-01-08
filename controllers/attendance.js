const jwt = require('jsonwebtoken');
const axios = require('axios');

//  @desc   Add user
//  @route  POST /api/v1/auth/register
//  @access Public
exports.attendanceList = async (req, res) => {
    try {
        let list = req.pass_var;

        return res.status(200).json({
            success: true,
            count: list.length,
            data: list
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

exports.verifyAttendance = async (req, res) => {
    try {
        let { type } = req;

        return res.status(200).json({
            success: true,
            type
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}