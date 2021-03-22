const jwt = require('jsonwebtoken');
const axios = require('axios');

//  @desc   Add user
//  @route  POST /api/v1/auth/register
//  @access Public
exports.attendanceList = async (req, res) => {
    try {
        let list = req.pass_var;

        // begins with 0 => Sunday
        // array because it could include multiple weekend days

        return res.status(200).json({
            success: true,
            data: {
                attendance: {
                    count: list.length,
                    list
                }
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

exports.attendanceVerified = async (req, res) => {
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

exports.attendanceInsert = async (req, res) => {
    try {
        return res.status(200).json({
            success: true
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}