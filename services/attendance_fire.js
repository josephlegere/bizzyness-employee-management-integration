//Retrieve Data from Firebase

const db = require('../config/db');

exports.getAttendance = (tenant) => {

    let query_db = db
        .collection('attendance')
        .where('tenant', '==', tenant.tenantid)
        .get();
    
    return new Promise(function (resolve, reject) {
        query_db.then(snapshot => {
            let list = [];

            snapshot.forEach(doc => {
                // console.log(doc.id, "=>", doc.data());
                let { date, employee, status, tenant, timings } = doc.data();
                let _timings = [];
                console.log(employee);

                timings.forEach(timing => {
                    let { input, place, type } = timing;
                    _timings.push({
                        input: input.toDate(),
                        place,
                        type
                    });
                });

                list.push({
                    date: date.toDate(),
                    employee,
                    status,
                    tenant,
                    timings: _timings
                });
            });

            // console.log(list);
                
            resolve(list);
        })
        .catch(err => {
            reject(err);
        });
    });

}

exports.updateAttendance = async () => {

}