'use strict';
const appConfig = require('../config');
const errorService = require('../services/error-service');
const tokenService = require('../services/token-service');
const cloudinary = require('cloudinary');
const userModel = require('../models/user-model');

cloudinary.config({
  cloud_name: 'invizor',
  api_key: '829414469496793',
  api_secret: 'DSo-09TQyDfs7QcZ1VeQa8rTOcI'
});

class imageService {
  constructor() {}

  uploadAvatar(req, res, next) {
    if(!req.file) {
      next(errorService.file_load.empty_load_file);
    }
    if(req.file.size > 5*1024*1024) {
      next(errorService.file_load.big_size_file);
    }

    cloudinary.uploader.upload(req.file.path, {"crop":"limit","tags":"samples","width":200,"height":200})
      .then((result) => {
        if(!result || !result.url) {
          next(errorService.file_load.not_load_file);
        }
        userModel.update({
          _id: req.userObj.id
        }, {
          $set: {avatar: result.url}
        })
          .then(() => {
            res.send({
              success: true,
              data: result.url
            });
          })
          .catch(() => {
            return next(errorService.file_load.not_add_url_for_user);
          })
      })
      .catch(error => {
        next(error);
      })
  }

  uploadFile(req, res, next) {
    if(!req.file) {
      next(errorService.file_load.empty_load_file);
    }
    if(req.file.size > 100*1024*1024) {
      next(errorService.file_load.big_size_file);
    }

    cloudinary.uploader.upload(req.file.path, {"crop":"limit","tags":"samples"})
      .then((result) => {
        if(!result || !result.url) {
          next(errorService.file_load.not_load_file);
        }
        res.send({
          success: true,
          data: result.url
        });
      })
      .catch(error => {
        next(error);
      })
  }
}

module.exports = new imageService();