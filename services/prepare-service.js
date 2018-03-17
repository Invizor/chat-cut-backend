'use strict';
const appConfig = require('../config');
const errorService = require('../services/error-service');

class prepareService {
    constructor() {}

    getUniqueElementList(list) {
        let listUnique = [];
        let objElemList = {};
        list.forEach(item => {
            let strValue = JSON.stringify(item);
            if(!objElemList[strValue]) {
                objElemList[strValue] = true;
                listUnique.push(item);
            }
        });
        return listUnique;
    }
}

module.exports = new prepareService();