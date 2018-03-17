'use strict';

const authService = require('./../services/auth-service');
const express = require('express');
const router = express.Router();

const MessageCtrl = require('./../controllers/message-controller');

router.get('/', authService(), MessageCtrl.getMessages.bind(MessageCtrl));
router.post('/create', authService(), MessageCtrl.createMessage.bind(MessageCtrl));
router.post('/remove', authService(), MessageCtrl.removeMessage.bind(MessageCtrl));
router.post('/clear', authService(), MessageCtrl.clearMessagesAtThread.bind(MessageCtrl));

module.exports = router;