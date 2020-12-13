const jwt = require('jsonwebtoken');
const axios = require('axios');

//  @desc   Add user
//  @route  POST /api/v1/auth/register
//  @access Public
exports.attendanceList = async (req, res) => {
    try {
        //const attendance = await User.find();
        const res_service = await axios.post('http://gemserve.com.qa/gemserve/gemrest/attendance-archives_get-process.php', {
            dskEntry: "1",
            st: "confirmed",
            dt: "current"
        });

        // console.log(res_service.data)

        return res.status(200).json({
            success: true,
            data: res_service.data
            // count: attendance.length,
            // data: attendance
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}