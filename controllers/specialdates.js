const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.specialdateInsert = async (req, res) => {
    try {
        return res.status(200).json({
            success: true
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}