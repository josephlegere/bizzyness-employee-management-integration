const jwt = require('jsonwebtoken');
const axios = require('axios');

const { getAttendance } = require('../services/designate_service');

//  @desc   Add user
//  @route  POST /api/v1/auth/register
//  @access Public
exports.attendanceList = async (req, res) => {
    try {
        let list = req.pass_var;
        console.log(req.body);
        getAttendance(req.body.tenant);

        // begins with 0 => Sunday
        // array because it could include multiple weekend days
        let dayoffs = [
            {
                txt: 'Friday',
                num: 5,
                format: 'MomentJS'
            }
        ];

        return res.status(200).json({
            success: true,
            data: {
                attendance: {
                    count: list.length,
                    list
                },
                dayoffs: {
                    count: dayoffs.length,
                    list: dayoffs
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