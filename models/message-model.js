'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = new mongoose.Schema({
    idThread: {type: String},
    idUser: {type: String},
    text: {type: String},
    date: {type: Date},
    files: {type: Array}
});

module.exports = mongoose.model('Message', Schema);
