const mongoose = require('mongoose');
const config = require('../config');
const userModel = require('../models/user-model');
const messageModel = require('../models/message-model');
const threadModel = require('../models/thread-model');

const defaultUser = {
    username: "admin",
    password: "admin",
    email: "admin@mail.ru",
    name: "Иван",
    surname: "Иванов",
    listIdThreads: []
};

let user = new userModel();
let thread = new threadModel();
let message = new messageModel();

let initDB = function() {
    // user.save((error) => {
    //     if(error) {
    //         console.log("error init DB", error);
    //     }
    // });
    thread.save((error) => {
        if(error) {
            console.log("error init DB", error);
        }
    });
    message.save((error) => {
        if(error) {
            console.log("error init DB", error);
        }
    });
};

module.exports = initDB;