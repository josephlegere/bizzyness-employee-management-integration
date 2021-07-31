const moment = require('moment');

const { getAttendance: getAttendance_lamp, verifyAttendance: verifyAttendance_lamp, addAttendance: addAttendance_lamp } = require('./attendance_lamp');
const { getAttendance: getAttendance_fire, verifyAttendance: verifyAttendance_fire, addAttendance: addAttendance_fire } = require('./attendance_fire');

const { addSpecialdates: addSpecialdates_fire } = require('./specialdates_fire');

function attendance_task (client, query) {

    let { task, service_uid } = query;

    if (client === 'manage' && task === 'checker') {
        return {
            st: "for confirmation",
            dt: "current"
        };
    }
    else if (client === 'manage' && task === 'monitor') {
        return {
            st: "confirmed",
            dt: "current"
        };
    }
    else if (client === 'employee') {
        return {
            st: "logged in",
            dt: "today",
            ur: service_uid
        };
    }
    else {
        return {
            st: "for confirmation",
            dt: "current"
        };
    }
}

exports.getAttendance = (req, res, next) => {
    // console.log(dest_code[tenant.system_config.server_type.type].note);

    // let { task, tenant } = req.body;
    let { client, tenant, user } = req.params;
    // let { task } = req.query;
    let query = req.query;
    let server_type = req.headers['server-type'];
    console.log(req.body);
    console.log(req.headers);

    // console.log(task);

    console.log('Get Attendance');

    // console.log(tenant);
    
    if (server_type === 'pure_fire') {

        console.log('This is using firebase');

        getAttendance_fire(client, tenant, user, { task: query.task })
        .then(res_fire => {
            console.log(res_fire);

            req.pass_var = res_fire;
            next();
        })
        .catch(err => {
            console.error(err);

            return res.status(400).json({
                success: false,
                error: 'Error in Request!'
            });
        });
    }
    else if (server_type === 'hybrid_lamp_fire') {
        
        let external_api = req.headers['external-api'];
        let server_timezone = req.headers['server-timezone'];
        // console.log(req.params, req.headers);
        console.log('This is using LAMP and firebase');

        getAttendance_lamp(external_api, server_timezone, attendance_task(client, query), tenant)
        .then(res => {
            // console.log(res);

            req.pass_var = res;
            next();
        })
        .catch(err => {
            console.error(err);

            return res.status(400).json({
                success: false,
                error: 'Error in Request!'
            });
        });
    }
}

exports.verifyAttendance = (req, res, next) => {

    let { tenant, list } = req.body;
    // let path = req.route.path.replace(/[^a-zA-Z ]/g, '');
    let { task } = req.params;
    let server_type = req.headers['server-type'];

    console.log('Update Attendance');

    console.log(tenant);

    if (server_type === 'pure_fire') {

        console.log('This is using firebase');

        verifyAttendance_fire(tenant, list, task);

        next();
        
    }
    else if (server_type === 'hybrid_lamp_fire') {
        
        let external_api = req.headers['external-api'];
        
        console.log('This is using LAMP and firebase');

        console.log(task, list);
        
        verifyAttendance_lamp(external_api, task, list).then(res => {
            console.log(res);

            req.type = res;
            next();
        })
        .catch(err => {
            console.error(err);

            return res.status(400).json({
                success: false,
                error: 'Error in Request!'
            });
        });

    }

}

exports.addAttendance = (req, res, next) => {

    let server_type = req.headers['server-type'];
    let { date, employee, timings, special_date } = req.body;
    let { client, tenant } = req.params;

    let _timings_formatted = [];

    console.log('Add Attendance');

    // console.log(employee, timings, client, tenant);

    timings.forEach(elem => {
        let { out, location } = elem;

        _timings_formatted.push({
            input: moment(`${moment(date).format('YYYY-MM-DD')} ${elem.in}`),
            place: '',
            type: 0
        });

        _timings_formatted.push({
            input: moment(`${moment(date).format('YYYY-MM-DD')} ${out}`),
            place: location,
            type: 1
        });
    });

    let query_add = {
        created: moment(),
        date: moment(date),
        employee,
        status: 'pending',
        tenant: `tenants/${tenant}`,
        timings: _timings_formatted,
        verifiedBy: {}
    }

    if (special_date) query_add.special_date = special_date;

    addAttendance_fire(query_add)
    .then(res => {
    
        if (server_type === 'pure_fire') {

            console.log('This is using firebase');

            next();

        }
        else if (server_type === 'hybrid_lamp_fire') {
            
            console.log('This is using LAMP and firebase');
            
            let external_api = req.headers['external-api'];
            let { service_unique } = req.body;

            console.log(external_api, service_unique);

            addAttendance_lamp(external_api, service_unique, { date, timings }).then(res => {
                
                console.log('Successfully Added a Time In, in LAMP DB');

                next();
            })
            .catch(err => {
                console.error(err);

                return res.status(400).json({
                    success: false,
                    error: 'Error in Request!'
                });
            });

        }

    })
    .catch(err => {
        console.error(err);

        return res.status(400).json({
            success: false,
            error: 'Error in Request!'
        });
    });

}

exports.addSpecialdates = (req, res, next) => {

    let server_type = req.headers['server-type'];
    let { dates } = req.body;
    let { client, tenant } = req.params;

    console.log('Add Special Dates');

    // console.log(client, tenant);

    addSpecialdates_fire(dates, tenant)
    .then(() => {

        if (server_type === 'pure_fire') {

            console.log('This is using firebase');

            next();

        }
        else if (server_type === 'hybrid_lamp_fire') {

            console.log('This is using LAMP and firebase');

            next();

        }
            
    })
    .catch(err => {
        console.error(err);

        return res.status(400).json({
            success: false,
            error: 'Error in Request!'
        });
    });

}