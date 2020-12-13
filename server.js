const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const auth = require('./routes/auth');
const user = require('./routes/user');

dotenv.config({ path: './config/config.env' });

connectDB();

let app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold)
})