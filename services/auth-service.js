'use strict';
const errorService = require('./error-service');
const tokenService  = require('./token-service');
const userModel = require('../models/user-model');

let auth = function() {
    // Return middleware function
    return (req, res, next) => {
        //Find token in request
        let token = null;
        if(req.headers.authorization) {
            token = req.headers.authorization;
        }
        if(!token) {
            return next(errorService.user.not_authorized);
        }
        let decode = tokenService.decodeToken(req.headers.authorization);
        if (!decode || !decode.id || !decode.date) {
            return next(errorService.user.not_authorized);
        }
        userModel
            .findOne({_id: decode.id})
            .then(user => {
                if (!user) {
                    next(errorService.user.not_authorized);
                }
                next();
            })
            .catch(err => {
                next(errorService.user.not_authorized);
            })
    }
};

module.exports = auth;
