'use strict';
const appConfig = require('../config');
const BaseController = require('./base');
const userCtrl = require('./../controllers/user-controller');
const userModel = require('../models/user-model');
const threadModel = require('../models/thread-model');
const messageModel = require('../models/message-model');
const errorService = require('../services/error-service');
const prepareService = require('../services/prepare-service');
const tokenService = require('../services/token-service');

class MessageController extends BaseController {
    constructor() {
        super();
    }

    createMessage(req, res, next) {
        if (!this.checkBody(req, ['idThread', 'text'])) {
            return next(errorService.api.bad_params);
        }

        let decode = tokenService.decodeToken(req.headers.authorization);

        let message = new messageModel({
            idThread: req.body.idThread,
            idUser: decode.id,
            text: req.body.text,
            date: Date.now()
        });

        threadModel.findOne({"_id": req.body.idThread})
            .then(thread => {
                if(!thread) {
                    return next(errorService.user.thread_not_found);
                }
                if(thread.listIdUsers.indexOf(decode.id) === -1) {
                    return next(errorService.user.access_user);
                }
                return message.save()
                    .then(message => {
                        if(!message) {
                            return next(errorService.user.create_message_error);
                        }
                        res.send({
                            success: true,
                            message: message
                        });
                        return message;
                    })
                    .catch(error => {
                        return next(errorService.user.create_message_error);
                    })
            })
            .catch(error => {
                return next(errorService.user.thread_not_found);
            });
    }

    removeMessage(req, res, next) {
        if (!this.checkBody(req, ['id'])) {
            return next(errorService.api.bad_params);
        }

        let decode = tokenService.decodeToken(req.headers.authorization);

        messageModel.findOne({"_id": req.body.id})
            .then(message => {
                if(!message) {
                    return next(errorService.user.message_not_found);
                }
                if(decode.id !== message.idUser) {
                    return next(errorService.user.access_user);
                }
                messageModel.remove({"_id": req.body.id})
                    .then(() => {
                        res.send({
                            success: true,
                            message: message
                        });
                    })
                    .catch(error => {
                        return next(errorService.user.message_remove_error);
                    })
            })
            .catch(error => {
                return next(errorService.user.message_not_found);
            });
    }

    getMessages(req, res, next) {
        if (!this.checkQuery(req, ['idThread'])) {
            return next(errorService.api.bad_params);
        }

        let decode = tokenService.decodeToken(req.headers.authorization);

        threadModel.findOne({"_id": req.query.idThread})
            .then(thread => {
                if(!thread) {
                    return next(errorService.user.thread_not_found);
                }
                if(thread.listIdUsers.indexOf(decode.id) === -1) {
                    return next(errorService.user.thread_access);
                }
                messageModel.find({idThread: req.query.idThread}).sort({date: 1})
                    .then(messagesList => {
                        if(!messagesList) {
                            return next(errorService.user.find_messages_error);
                        }
                        res.send({
                            success: true,
                            messages: messagesList
                        });
                    })
                    .catch(error => {
                        return next(errorService.user.find_messages_error);
                    })
            })
            .catch(error => {
                return next(errorService.user.thread_not_found);
            })
    }

    clearMessagesAtThread(req, res, next) {
        if (!this.checkBody(req, ['idThread'])) {
            return next(errorService.api.bad_params);
        }

        let decode = tokenService.decodeToken(req.headers.authorization);

        threadModel.findOne({"_id": req.body.idThread})
            .then(thread => {
                if (!thread) {
                    return next(errorService.user.thread_not_found);
                }
                if (thread.listIdUsers.indexOf(decode.id) === -1) {
                    return next(errorService.user.thread_access);
                }
                messageModel.remove({idThread: req.body.idThread})
                    .then(() => {
                        res.send({
                            success: true
                        });
                    })
                    .catch(error => {
                        return next(errorService.user.message_remove_error);
                    })
            })
            .catch(error => {
                return next(errorService.user.thread_not_found);
            })
    }
}

module.exports = new MessageController();