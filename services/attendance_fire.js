//Retrieve Data from Firebase

const db = require('../config/db');

exports.getAttendance = (client, tenant, user) => {

    let query_db;

    if (client === 'manage') {
        query_db = db
            .collection('attendance')
            .where('tenant', '==', `tenants/${tenant}`)
            .get();
    }
    else if (client === 'employee') {
        query_db = db
            .collection('attendance')
            .where('tenant', '==', `tenants/${tenant}`)
            .where('employee.id', '==', `users/${user}`)
            .get();
    }
    
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

exports.verifyAttendance = async () => {

}

exports.addAttendance = async (timings) => {
    return new Promise(function (resolve, reject) {
        db.collection('attendance').add(timings)
            .then(ref => {
                console.log('Successfully Added a Time In, in Firebase DB');

                resolve(ref);
            })
            .catch(err => {
                reject(err);
            });
    });
}