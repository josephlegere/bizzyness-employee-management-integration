//Retrieve Data from Firebase

const db = require('../config/db');
const moment = require('moment');

exports.getAttendance = (client, tenant, user, query) => {

    let query_db;

    if (client === 'manage') {
        let { task } = query;

        if (task === 'checker') {
            query_db = db.collection('attendance')
                .where('tenant', '==', `tenants/${tenant}`)
                .where('status', '==', `pending`)
                .get();
        }
        else if (task === 'monitor') {
            query_db = db.collection('attendance')
                .where('tenant', '==', `tenants/${tenant}`)
                .where('status', '==', `confirmed`)
                .get();
        }
    }
    else if (client === 'employee') {
        query_db = db
            .collection('attendance')
            .where('tenant', '==', `tenants/${tenant}`)
            .where('employee.id', '==', `users/${user}`)
            .where('status', 'in', ['pending', 'confirmed'])
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
                    id: doc.id,
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

exports.verifyAttendance = async (tenant, list, task) => {
    // console.log(list);

    let { id, name } = tenant;
    let AttendanceRef = db.collection('attendance');
    let AttendanceDocs = [];
    let task_list = { 'confirm': 'confirmed', 'reject': 'rejected' }

    try {
        await db.runTransaction(async (transaction) => {
            list.forEach((elem) => {
                AttendanceDocs.push(AttendanceRef.doc(elem.attendid));
            });

            const transactionSnapshots = await transaction.getAll(...AttendanceDocs);

            transactionSnapshots.forEach(transactionSnap => {
                transaction.update(transactionSnap.ref, { verifiedBy: { id, name, date: moment() }, status: task_list[task] });
            });
        });

        console.log(`Verification Successful! (${task_list[task]})`);
        return `Verification Successful! (${task_list[task]})`;
    }
    catch (e) {
        console.error('Transaction failure:', e);
    }
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