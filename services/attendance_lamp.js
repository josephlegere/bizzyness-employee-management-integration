//Retrieve Data from External API

const axios = require('axios');
// const moment = require('moment');
const moment = require('moment-timezone');

const db = require('../config/db');
const format = require('../utils/json_formatter');

exports.getAttendance = async (server_api, timezone, params, tenant) => {

    let { st, dt, ur } = params;
    let specialDates = {};

    try {
        let query = await db
            .collection('tenant_special_dates')
            .doc(tenant)
            .collection('special_dates')
            .get();

        query.forEach(doc => {
            let _date = doc.data();
            specialDates[moment(_date.date.toDate()).tz(timezone).format('YYYYMMDD')] = { ..._date, id: doc.id };
        });
        
        // const get_service = await axios.post(process.env.EXTERNAL_API + process.env.API_ATTENDANCE_GET, {
        const get_service = await axios.post(server_api + process.env.API_ATTENDANCE_GET, {
            dskEntry: "1", st, dt, ur
        });

        let attendance_list = {};
        let service_list = get_service.data.attendance_list;

        // if (params.hasOwnProperty('ucode'))
        //     service_list = service_list.filter(timing => timing.attendempcode === params.ucode);

        let _list = format.convertAttendanceData(service_list, tenant);
        // console.log(_list);

        // convert attendance that would be better suited for the client
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

                if (specialDates[moment(elem.date).format('YYYYMMDD')]) attendance_list[generate_key].special_date = specialDates[moment(elem.date).format('YYYYMMDD')];

                delete attendance_list[generate_key].timeinput;
                delete attendance_list[generate_key].timeinputtype;
                delete attendance_list[generate_key].place;
            }
        });
        // console.log(attendance_list);

        // sort attendance list
        ordered_attendace_list = Object.keys(attendance_list).sort().reduce(
            (obj, key) => ({ [obj[key]]: attendance_list[key] }), {}
        );

        attendance_list = Object.values(attendance_list);
        // console.log(attendance_list)

        return attendance_list;
        
    }
    catch (err) {
        return err;
    }
}

exports.verifyAttendance = async (server_api, task, list) => {

    let _attendance_raw = list;
    let _task_list = {
        'confirm': { action: 'confirm', code: 'sta', list_title: 'atn' },
        'reject': { action: 'reject', code: 'rej', list_title: 'rej' }
    }

    let _attendance_formatted = _attendance_raw.map((elem) => {
        let { date } = elem;
        return { empid: elem.employeeid, date };
    });
    // console.log(_attendance_formatted)

    try {
        const update_service = await axios.post(server_api + process.env.API_ATTENDANCE_UPDATE, {
            dskEntry: "1", 
            [_task_list[task].list_title]: _attendance_formatted,
            cnf: "1001",
            cl: _task_list[task].code
        });
        return _task_list[task].action;
    }
    catch (err) {
        return err;
    }

}

exports.addAttendance = async (server_api, uniq, body) => {

    let { date, timings } = body;
    let _location = '';
    let count = timings.length;

    let _timings_formatted = timings.map((elem, key) => {
        let { out, location } = elem;
        if (location !== '') {
            if (_location === '') _location += location;
            else {
                _location += ', ' + location;
            }
        }
        return { in: elem.in, out };
    });
    // console.log(_timings_formatted)
    console.log(_location);

    try {
        const insert_service = await axios.post(server_api + process.env.API_ATTENDANCE_INSERT, {
            dskEntry: "1",
            uniq,
            ain: {
                date: moment(date).format('YYYY-MM-DD'),
                timecheck: _timings_formatted,
                place: _location
            }
        });
        return insert_service.data;
    }
    catch (err) {
        return err;
    }

}