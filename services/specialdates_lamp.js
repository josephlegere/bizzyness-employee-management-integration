//Retrieve Data from External API

const axios = require('axios');
// const moment = require('moment');
const moment = require('moment-timezone');

const db = require('../config/db');
const format = require('../utils/json_formatter');

exports.addSpecialdates = async (server_api, employee_code, dates) => {

    let holiday_dates = [];
    let special_dates = [];

    dates.forEach(elem => {
        let { date, name, type, specialdatevalue } = elem;
        special_dates.push({ date, name, type: type === 'holiday' ? 2 : 1, specialdatevalue });
        if (type === 'holiday') holiday_dates.push({ date, name });
    });

    console.log(holiday_dates.length);
    console.log(special_dates.length);

    try {
        const insert_service = await axios.post(server_api + process.env.API_SPECIALDATES_INSERT, {
            employee_code,
            holiday_dates,
            special_dates
        });
        return insert_service.data;
    }
    catch (err) {
        return err;
    }

}