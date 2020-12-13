const User = require('../models/User');

//  @desc   View all users with details
//  @route  GET /api/v1/user
//  @access Admin User
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Update user
// @route   PUT /api/v1/user
// @access  Admin
exports.updateUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const { name } = req.body;

        let user_updated = await User.updateOne({ _id }, { name: name });

        return res.status(200).json({
            success: true,
            //count: parts.length,
            data: { name }
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            error: err
        });
    }
}

// @desc    Delete user
// @route   DELETE /api/v1/user/:id
// @access  Admin User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No user found'
            });
        }

        let _user = user;
        await user.remove();

        return res.status(200).json({
            success: true,
            data: _user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}