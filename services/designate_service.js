const { getAttendance: getAttendance_lamp, updateAttendance: updateAttendance_lamp } = require('./attendance_lamp');
const { getAttendance: getAttendance_fire, updateAttendance: updateAttendance_fire } = require('./attendance_fire');

let attendance_task = {
    checker: {
        st: "for confirmation",
        dt: "current"
    },
    monitor: {
        st: "confirmed",
        dt: "current"
    }
};

exports.getAttendance = (req, res, next) => {
    // console.log(dest_code[tenant.system_config.server_type.type].note);

    // let { task, tenant } = req.body;
    let { client, task, server, tenant } = req.params;

    console.log('Get Attendance');

    // console.log(tenant);
    
    if (server === 'pure_fire') {

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
    else if (server === 'hybrid_lamp_fire') {
        
        let { external_api } = req.headers;
        
        console.log('This is using LAMP and firebase');

        getAttendance_lamp(external_api, attendance_task[task])
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

exports.updateAttendance = (req, res, next) => {

    let { tenant, list } = req.body;
    let path = req.route.path.replace(/[^a-zA-Z ]/g, '');

    console.log('Update Attendance');

    console.log(tenant);

    if (tenant.system_config.server_type.type === 'pure_fire') {

        console.log('This is using firebase');

        next();
        
    }
    else if (tenant.system_config.server_type.type === 'hybrid_lamp_fire') {
        
        console.log('This is using LAMP and firebase');

        console.log(path, list);
        
        updateAttendance_lamp(tenant.system_config.server_host.api, path, list).then(res => {
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