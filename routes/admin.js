//ACTS AS A MIDDLEWARE
//Admin Access
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access Denied!'
        });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (verified.role == 'admin') {
            req.user = verified;
            next();
        }
        else {
            return res.status(400).json({
                success: false,
                error: 'Unauthorized Access!'
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: 'Invalid Token!'
        });
    }
}