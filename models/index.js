'use strict';

const path = require("path");
const db = require('./../services/db-service');
const normalizedPath = path.join(__dirname, './../models');

// Require and register all models
require("fs")
    .readdirSync(normalizedPath)
    .forEach((file) => {
        if (file == 'index.js') { // skip self
            return;
        }
        require(path.join(__dirname, './../models', file));
    });

module.exports = new Promise((resolve, reject) => {
    db.on('error', (err) => {
        reject(err);
    });
    db.once('open', () => {
        resolve(db);
    });
});

