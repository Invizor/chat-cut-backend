'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = new mongoose.Schema({
  listIdUsers: {type: Array},
  createDate: {type: Date},
  messagesList: {type: Array}
});

module.exports = mongoose.model('Thread', Schema);
