const { getAttendance, updateAttendance } = require('../services/attendance');

let dest_code = {
    'pure_fire': {
        note: 'This is using firebase',
        path: {
            '/': {
                note: 'Retrieve Data',
                destinations: [ getAttendance ]
            },
            '/confirm': {
                note: 'Confirm Attendance',
                destinations: [ updateAttendance ]
            },
            '/reject': {
                note: 'Reject Attendance',
                destinations: [ updateAttendance ]
            }
        }
    },
    'hybrid_lamp_fire': {
        note: 'This is using LAMP and firebase',
        path: {
            '/': {
                note: 'Retrieve Data',
                // destinations: [ getAttendance_firebase ]
            },
            '/confirm': {
                note: 'Confirm Attendance',
                destinations: [ updateAttendance ]
            },
            '/reject': {
                note: 'Reject Attendance',
                destinations: [ updateAttendance ]
            }
        }
    }
};

exports.getAttendance = tenant => {
    console.log('Hello');
    console.log(tenant);
    console.log(dest_code[tenant.system_config.server_type.type].note)
    // if (tenant.system_config.server_type.type === 'pure_fire') {
    //     console.log('This is using firebase');
    // }
    // else if (tenant.system_config.server_type.type === 'hybrid_lamp_fire') {
        
    // }
}