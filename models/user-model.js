'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../config');

const Schema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String},
    email: {type: String, unique: true, required: true},
    name: {type: String},
    surname: {type: String},
    listIdThreads: {type: Array}
});

/**
 * Generate token
 * @param userId
 * @param {Object} device
 * @return {String}
 */
Schema.statics.makeHash = function(userId) {
    let str = userId + config.keys.tokenKey;
    return crypto.createHash('md5').update(str).digest('hex');
};

module.exports = mongoose.model('User', Schema);

