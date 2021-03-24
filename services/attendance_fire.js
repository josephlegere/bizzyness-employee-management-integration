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
                let { date, employee, status, tenant, timings, special_date } = doc.data();
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

                let _item = {
                    date: date.toDate(),
                    employee,
                    status,
                    tenant,
                    timings: _timings
                };
                if (special_date) _item.special_date = special_date;

                list.push(_item);
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

exports.addAttendance = async (attend) => {
    return new Promise(function (resolve, reject) {
        db.collection('attendance').add(attend)
            .then(ref => {
                console.log('Successfully Added a Time In, in Firebase DB');

                resolve(ref);
            })
            .catch(err => {
                reject(err);
            });
    });
}