//Retrieve Data from External API

const axios = require('axios');

module.exports = async (req, res, next) => {

    try {
        const res_service = await axios.post(process.env.EXTERNAL_API + process.env.API_ATTENDANCE, {
            dskEntry: "1",
            st: "confirmed",
            dt: "current"
        });

        let attendance_list = res_service.data.attendance_list;
        let attendance_list_formatted = [];

        attendance_list.forEach(elem => {
            _format = {
                date: '',
                employee: {
                    account: '',
                    id: '',
                    name: ''
                },
                place: '',
                status: 1, //0 -> rejected/cancelled, 1 -> for confirmation, 2 -> confirmed
                tenant: ''
            }
        });

        attendance_list = attendance_list_formatted;

        req.pass_var = attendance_list;
        next();
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            error: 'Denied Access!'
        });
    }
}