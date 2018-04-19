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

class threadController extends BaseController {
  constructor() {
    super();
  }

  getThread(req, res, next) {
    if (!this.checkQuery(req, ['id'])) {
      return next(errorService.api.bad_params);
    }

    let decode = tokenService.decodeToken(req.headers.authorization);

    threadModel.findOne({"_id": req.query.id})
      .then(thread => {
        if (!thread) {
          return next(errorService.user.thread_not_found);
        }
        if (thread.listIdUsers.indexOf(decode.id) === -1) {
          return next(errorService.user.thread_access);
        }
        res.send({
          success: true,
          thread: thread
        });
      })
      .catch(error => {
        return next(errorService.user.thread_not_found);
      });
  }

  createThread(req, res, next) {
    if (!this.checkBody(req, ['listIdUsers'])) {
      return next(errorService.api.bad_params);
    }

    if (!Array.isArray(req.body.listIdUsers)) {
      return next(errorService.api.bad_params);
    }

    let listIdUsersUnique = prepareService.getUniqueElementList(req.body.listIdUsers);

    let decode = tokenService.decodeToken(req.headers.authorization);

    if (listIdUsersUnique.indexOf(decode.id) === -1) {
      return next(errorService.user.thread_access);
    }

    let thread = new threadModel({
      listIdUsers: listIdUsersUnique,
      createDate: Date.now()
    });

    thread.save()
      .then(thread => {
        if (!thread) {
          return next(errorService.user.create_thread_error);
        }
        userCtrl.addThread(thread.listIdUsers, thread._id)
          .then(() => {
            res.send({
              success: true,
              thread: thread
            });
          })
          .catch(() => {
            return next(errorService.user.create_thread_error);
          })
      })
      .catch(error => {
        return next(errorService.user.create_thread_error);
      })
  }

  removeThread(req, res, next) {
    if (!this.checkBody(req, ['id'])) {
      return next(errorService.api.bad_params);
    }

    let decode = tokenService.decodeToken(req.headers.authorization);

    threadModel.findOne({"_id": req.body.id})
      .then((thread) => {
        if (!thread) {
          return next(errorService.user.thread_not_found);
        }
        if (thread.listIdUsers.indexOf(decode.id) === -1) {
          return next(errorService.user.thread_access);
        }
        return threadModel.remove({"_id": thread.id})
          .then(() => {
            return thread;
          })
          .catch(() => {
            return next(errorService.user.thread_not_found);
          });
      })
      .then(thread => {
        userCtrl.removeThread(thread.listIdUsers, thread._id)
          .then(() => {
            return true;
          })
          .catch(() => {
            return next(errorService.user.not_found);
          })
      })
      .then(() => {
        messageModel.remove({idThread: req.body.id})
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
      });
  }

  removeUserFromThread(req, res, next) {
    if (!this.checkBody(req, ['id'])) {
      return next(errorService.api.bad_params);
    }

    let decode = tokenService.decodeToken(req.headers.authorization);

    threadModel.findOne({"_id": req.body.id})
      .then((thread) => {
        if (!thread) {
          return next(errorService.user.thread_not_found);
        }
        if (thread.listIdUsers.indexOf(decode.id) === -1) {
          return next(errorService.user.thread_access);
        }
        if(thread.listIdUsers.length === 1) {
          return threadModel.remove({"_id": thread.id})
            .then(() => {
              return thread;
            })
            .catch(() => {
              return next(errorService.user.thread_not_found);
            });
        } else {
          let changeThread = Object.assign(thread);
          changeThread.listIdUsers = changeThread.listIdUsers.filter((itemListIdUser) => {
            return !(itemListIdUser === decode.id);
          });
          return threadModel.update({"_id": req.body.id}, changeThread)
            .then(result => {
              return thread;
            })
            .catch((error) => {
              return next(errorService.user.remove_user_from_thread_error);
            })
        }
      })
      .then(thread => {
        userCtrl.removeThread([decode.id], thread._id)
          .then(() => {
            return true;
          })
          .catch(() => {
            return next(errorService.user.not_found);
          })
      })
      .then(() => {
        messageModel.remove({idThread: req.body.id})
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
      });
  }

  getThreads(req, res, next) {
    let decode = tokenService.decodeToken(req.headers.authorization);
    userModel.findOne({"_id": decode.id})
      .then(user => {
        if (!user) {
          return next(errorService.user.not_found);
        }
        if (user.listIdThreads.length === 0) {
          res.send({
            success: true,
            listThreads: []
          });
        } else {
          threadModel.find({"_id": {"$in": user.listIdThreads}}).sort({createDate: 1})
            .then(threadsList => {
              if (!threadsList || !Array.isArray(threadsList)) {
                return next(errorService.user.thread_not_found);
              }

              let promAll = Promise.all(threadsList.map(thread => {
                return new Promise((resolve, reject) => {
                  messageModel.find({idThread: thread._id}).sort({date: 1})
                    .then(messageList => {
                      let resultThread = thread;
                      if(!messageList) {
                        reject(errorService.user.find_messages_error);
                      }
                      resultThread.messageList = messageList;
                      resolve(resultThread);
                    })
                    .catch(error => {
                      reject(error);
                    })
                });
              }));
              promAll.then((threadsAll) => {
                  res.send({
                    success: true,
                    listThreads: threadsAll
                  });
                })
                .catch((error) => {
                  return next(errorService.user.find_messages_error);
                })
            })
            .catch(error => {
              return next(errorService.user.thread_not_found);
            });
        }
      })
      .catch(error => {
        return next(errorService.user.not_found);
      });

  }
}

module.exports = new threadController();