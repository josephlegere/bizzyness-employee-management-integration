const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const admin = require('./admin');
const { getUsers, updateUser, deleteUser } = require('../controllers/user');

router
    .route('/')
    .get(verify, admin, getUsers);

router
    .route('/:id')
    .put(verify, admin, updateUser)
    .delete(verify, admin, deleteUser);

module.exports = router;