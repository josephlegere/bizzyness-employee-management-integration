//Retrieve Data from External API

const axios = require('axios');
const format = require('../utils/json_formatter');

module.exports = async (req, res, next) => {

    let { st, dt } = req.body;

    try {
        const res_service = await axios.post(process.env.EXTERNAL_API + process.env.API_ATTENDANCE, {
            dskEntry: "1", st, dt
        });

        let attendance_list = {};
        let _list = format.convertAttendanceData(res_service.data.attendance_list);
        _list.forEach(elem => {
            let generate_key = `${elem.date.substr(0, 10)}_${elem.employee.id}`;

            if (attendance_list.hasOwnProperty(generate_key)) {
                attendance_list[generate_key].timings.push({input: elem.timeinput, type: elem.timeinputtype, place: elem.place});
            }
            else {
                // console.log(generate_key)
                attendance_list[generate_key] = {};
                attendance_list[generate_key] = elem;

                attendance_list[generate_key].timings = [];
                attendance_list[generate_key].timings.push({
                    input: elem.timeinput,
                    type: elem.timeinputtype,
                    place: elem.place
                });

                delete attendance_list[generate_key].timeinput;
                delete attendance_list[generate_key].timeinputtype;
                delete attendance_list[generate_key].place;
            }
        });

        // sort attendance list
        ordered_attendace_list = Object.keys(attendance_list).sort().reduce(
            (obj, key) => ({ [obj[key]]: attendance_list[key] }), {}
        );

        attendance_list = Object.values(attendance_list);
        // console.log(attendance_list)

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