'use strict';
const appConfig = require('../config');
const BaseController = require('./base');
const userModel = require('../models/user-model');
const errorService = require('../services/error-service');
const tokenService = require('../services/token-service');

class userController extends BaseController {
  constructor() {
    super();
  }

  getUserByToken(req, res, next) {
    let decode = tokenService.decodeToken(req.headers.authorization);
    userModel.findOne({"_id": decode.id})
      .then(user => {
        if (!user) {
          return next(errorService.user.not_found);
        }
        res.send({
          success: true,
          user: user
        });
      })
      .catch(error => {
        return next(errorService.user.not_found);
      });
  }

  registerUser(req, res, next) {
    if (!this.checkBody(req, ['username', 'password', 'email'])) {
      return next(errorService.api.bad_params);
    }

    let user = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      listIdThreads: []
    });

    user.save()
      .then(user => {
        res.send({
          success: true,
          user: user
        });
      })
      .catch(error => {
        return next(errorService.user.register_user_error);
      })
  }

  loginUser(req, res, next) {
    if (!this.checkBody(req, ['email', 'password'])) {
      return next(errorService.api.bad_params);
    }
    userModel.findOne({"email": req.body.email})
      .then(user => {
        if (!user) {
          return next(errorService.user.auth_error);
        }
        if (user.email === req.body.email && user.password === req.body.password && user._id) {
          let token = tokenService.createToken(user._id);
          res.send({
            success: true,
            token: token,
            user: user
          });
        } else {
          return next(errorService.user.auth_error);
        }
      })
      .catch(error => {
        next(errorService.user.not_found);
      });
  }

  findUser(req, res, next) {
    if (!this.checkBody(req, ['username'])) {
      return next(errorService.api.bad_params);
    }
    userModel.findOne({"username": req.body.username})
      .then(user => {
        if (!user) {
          return next(errorService.user.not_found);
        }
        res.send({
          success: true,
          id: user.id
        });
      })
      .catch(error => {
        next(errorService.user.not_found);
      });
  }

  addThread(listIdUsers, idThread) {
    if (Array.isArray(listIdUsers) && idThread) {
      return userModel.find({
        _id: {$in: listIdUsers}
      })
        .then(listUsersFilter => {
          listUsersFilter.forEach(user => {
            if (user.listIdThreads.indexOf(idThread) === -1) {
              let listIdThreadsNew = user.listIdThreads;
              listIdThreadsNew.push(idThread);
              userModel.update({
                _id: user._id
              }, {
                $set: {listIdThreads: listIdThreadsNew}
              }, () => {
              });
            }
          })
        })
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  removeThread(listIdUsers, idThread) {
    if (Array.isArray(listIdUsers) && idThread) {
      let prAll = [];
      listIdUsers.forEach(idUser => {
        prAll.push(userModel.findOneAndUpdate({
          _id: idUser
        }, {
          $pull: {listIdThreads: {$in: [idThread]}}
        }))
      });
      return Promise.all(prAll);
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  // logoutUser(req, res, next) {
  //
  // }

}

module.exports = new userController();