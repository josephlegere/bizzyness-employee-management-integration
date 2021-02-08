const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');

const attendance = require('./routes/attendance');

dotenv.config({ path: './config/config.env' });

let app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1/attendance', attendance);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold)
})