const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const config = require('../config');
const dbInit = require('./db-init-service');

mongoose.connect(config.server.mongodb);
let db = mongoose.connection;
autoIncrement.initialize(db);
db.autoIncrementPlugin = autoIncrement.plugin;
//dbInit();

module.exports = db;