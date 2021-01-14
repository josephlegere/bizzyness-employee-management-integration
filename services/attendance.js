//Retrieve Data from External API

const axios = require('axios');
const moment = require('moment');
const format = require('../utils/json_formatter');

exports.getAttendance = async (req, res, next) => {

    let { st, dt } = req.body;

    try {
        const get_service = await axios.post(process.env.EXTERNAL_API + process.env.API_ATTENDANCE_GET, {
            dskEntry: "1", st, dt
        });

        let attendance_list = {};
        let _list = format.convertAttendanceData(get_service.data.attendance_list);
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
            error: 'Error in Request!'
        });
    }
}

exports.updateAttendance = async (req, res, next) => {

    let _attendance_raw = req.body.list;
    let _path = req.route.path.replace(/[^a-zA-Z ]/g, '');
    let _path_list = {
        'confirm': { action: 'confirm', code: 'sta', list_title: 'atn' },
        'reject': { action: 'reject', code: 'rej', list_title: 'rej' }
    }

    let _attendance_formatted = _attendance_raw.map((elem) => {
        let { date } = elem;
        return { empid: elem.uniqueid, date };
    });
    // console.log(_attendance_formatted)

    try {
        req.type = _path_list[_path].action;
        const update_service = await axios.post(process.env.EXTERNAL_API + process.env.API_ATTENDANCE_UPDATE, {
            dskEntry: "1", 
            [_path_list[_path].list_title]: _attendance_formatted,
            cnf: "1001",
            cl: _path_list[_path].code
        });
        next();
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            error: 'Error in Request!'
        });
    }

}