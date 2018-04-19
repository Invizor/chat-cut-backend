'use strict';

const authService = require('./../services/auth-service');
const express = require('express');
const router = express.Router();

const userCtrl = require('./../controllers/user-controller');

router.get('/', authService(), userCtrl.getUserByToken.bind(userCtrl));
router.post('/register', userCtrl.registerUser.bind(userCtrl));
router.post('/login', userCtrl.loginUser.bind(userCtrl));
router.post('/find', userCtrl.findUser.bind(userCtrl));
router.post('/get-users-info', userCtrl.getUserInfo.bind(userCtrl));


module.exports = router;