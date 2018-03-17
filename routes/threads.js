'use strict';

const authService = require('./../services/auth-service');
const express = require('express');
const router = express.Router();

const threadCtrl = require('./../controllers/thread-controller');

router.get('/', authService(), threadCtrl.getThread.bind(threadCtrl));
router.get('/:id', authService(), threadCtrl.getThread.bind(threadCtrl));
router.post('/create', authService(), threadCtrl.createThread.bind(threadCtrl));
router.post('/remove', authService(), threadCtrl.removeThread.bind(threadCtrl));
router.post('/get', authService(), threadCtrl.getThreads.bind(threadCtrl));

module.exports = router;