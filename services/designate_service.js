const { getAttendance: getAttendance_lamp, verifyAttendance: verifyAttendance_lamp } = require('./attendance_lamp');
const { getAttendance: getAttendance_fire, verifyAttendance: verifyAttendance_fire } = require('./attendance_fire');

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
            ucode: service_uid
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
    let { server_type } = req.headers;
    console.log(req.body);

    // console.log(task);

    console.log('Get Attendance');

    // console.log(tenant);
    
    if (server_type === 'pure_fire') {

        console.log('This is using firebase');

        getAttendance_fire(tenant)
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
        
        let { external_api } = req.headers;
        // console.log(req.params, req.headers);
        console.log('This is using LAMP and firebase');

        getAttendance_lamp(external_api, attendance_task(client, query))
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

    console.log('Update Attendance');

    console.log(tenant);

    if (tenant.system_config.server_type.type === 'pure_fire') {

        console.log('This is using firebase');

        next();
        
    }
    else if (tenant.system_config.server_type.type === 'hybrid_lamp_fire') {
        
        console.log('This is using LAMP and firebase');

        console.log(task, list);
        
        verifyAttendance_lamp(tenant.system_config.server_host.api, task, list).then(res => {
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