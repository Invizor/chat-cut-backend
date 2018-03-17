'use strict';
const appConfig = require('../config');
const errorService = require('./error-service');
const jwt = require('jsonwebtoken');

class tokenController {
    constructor() {
    }

    /**
     * Generate token
     * @param userId
     * @return {String}
     */
    createToken(userId) {
        return jwt.sign({id: userId, date: Date.now()}, appConfig.keys.tokenKey);
    };

    /**
     * decode token
     * @return {String}
     */
    decodeToken(token) {
        return jwt.verify(token, appConfig.keys.tokenKey);
    };
}

module.exports = new tokenController();