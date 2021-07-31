//Retrieve Data from Firebase

const db = require('../config/db');
const moment = require('moment');

exports.addSpecialdates = async (dates, tenant) => {
    try {
        let _dates = dates.map(elem => {
            let { date, name, set_by, specialdatevalue, type } = elem;
            return { created: moment(), date: moment(date), name, [type === 'holiday' ? 'rate' : 'specialtiming' ? 'hours' : 'specialvalue']: specialdatevalue , set_by, type };
        });
        console.log(_dates);

        let batch = db.batch();

        _dates.forEach(_date => {
            let ref = db.collection('tenant_special_dates').doc(tenant).collection('special_dates').doc();
            batch.set(ref, _date);
        });

        batch.commit();

    }
    catch (err) {
        console.error('Insert failure:', err);
        throw err;
    }
}