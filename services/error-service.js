const _ = require('lodash');

const errList = {
    api: {
        default: {
            code: 1000,
            description: 'Unknown api error'
        },
        bad_params: {
            code: 1001,
            description: 'Wrong input parameters'
        },
        not_found: {
            code: 1002,
            description: 'Route not found'
        },
        access_denied: {
            code: 1005,
            description: 'Access denied for this action'
        },
        object_not_found: {
            code: 1006,
            description: 'Object not found'
        }
    },
    user: {
        default: {
            code: 2000,
            description: 'Unknown user error'
        },
        wrong_credentials: {
            code: 2001,
            description: 'User with provided credentials not found'
        },
        not_authorized: {
            code: 2002,
            description: 'User not authorized'
        },
        already_exists: {
            code: 2003,
            description: 'User with this username already exists'
        },
        not_found: {
            code: 2004,
            description: 'User not found'
        },
        wait_for_message: {
            code: 2005,
            description: 'Please wait few minutes for new code'
        },
        user_already_logged: {
            code: 2006,
            description: 'User already authorised'
        },
        cant_send_sms: {
            code: 2007,
            description: 'Cant send sms'
        },
        session_not_set: {
            code: 2008,
            description: 'Device session not set. Required relogin'
        },
        register_not_fields: {
            code: 2009,
            description: 'Fields Username, email and password is required'
        },
        register_user_error: {
            code: 2010,
            description: 'User is not register, error BD'
        },
        update_fields_error: {
            code: 2011,
            description: 'update fields user error BD'
        },
        auth_error: {
            code: 2012,
            description: 'email or password are wrong'
        },
        token_error: {
            code: 2013,
            description: 'token is wrong'
        },
        create_thread_error: {
            code: 2014,
            description: 'error create thread'
        },
        thread_not_found: {
            code: 2015,
            description: 'error thread not found'
        },
        thread_access: {
            code: 2016,
            description: 'error thread access'
        },
        access_user: {
            code: 2017,
            description: 'error access user'
        },
        create_message_error: {
            code: 2018,
            description: 'error create new message'
        },
        message_not_found: {
            code: 2019,
            description: 'message not found'
        },
        message_remove_error: {
            code: 2020,
            description: 'error remove message'
        },
        find_messages_error: {
            code: 2021,
            description: 'error find messages'
        }
    },
    dbo: {
        default: {
            code: 3000,
            description: 'Unknown dbo error',
            translated: 'Внутрення ошибка сервера'
        },
        already_exists: {
            code: 3001,
            description: 'Record already exists'
        }
    },
    parking: {
        default: {
            code: 4000,
            description: 'Parking system internal error',
            translated: 'Ошибка парковочного сервера. Попробуйте еще раз'
        },
        enough_money: {
            code: 4001,
            description: 'User not enough money',
            translated: 'На счете не достаточно средств'
        },
        zone_not_found: {
            code: 4002,
            description: 'Zone not found',
            translated: 'Парковочная зона не найдена'
        },
        transport_not_found: {
            code: 4003,
            description: 'Transport not found',
            translated: 'Транспорт не найден'
        }
    },
    payment: {
        default: {
            code: 5000,
            description: 'Payment system internal error'
        },
        not_found: {
            code: 5001,
            description: 'Payment record not found'
        },
        external_error: {
            code: 5002,
            description: 'Payment external error'
        },
        already_success: {
            code: 5003,
            description: 'Payment already accepted'
        },
        bad_params: {
            code: 5004,
            description: 'Invalid params'
        }
    },
    sms: {
        default: {
            code: 6001,
            description: 'SMS Gateway error'
        },
        bad_response: {
            code: 6002,
            description: 'SMS Gateway return bad response'
        }
    },
    props: {
        default: {
            code: 7000,
            description: 'Props internal error'
        },
        not_found: {
            code: 7001,
            description: 'Props not found'
        }
    }
};

/**
 * Check if error is a mongo error
 * @param err
 * @return {*|boolean}
 */
errList.dbo.isMongo = function(err) {
    return (err && err['name'] && err['name'] === 'MongoError');
};

/**
 * Check is error is duplicate error
 * @param err
 * @return {*}
 */
errList.dbo.isDuplicate = function(err) {
    if (!errList.dbo.isMongo(err)) {
        return false;
    }
    return (err['code'] && err['code'] == 11000);
};

/**
 * Add to error object additional information
 * NOTE: If additional error is apiError, will be returned only additional object!
 * @param ob
 * @param originalError
 * @return {*}
 */
const extendError = function(ob, originalError) {
    if (originalError && originalError['apiError']) {
        return originalError;
    }
    return _.extend(ob, {originalError: originalError});
};

function assignEx(errObj) {
    errObj['ex'] = function(originalError) {
        return extendError(errObj, originalError);
    };
    errObj['explain'] = function(fullDescription) {
        errObj.fullDescription = fullDescription;
        return errObj;
    };
    errObj['apiError'] = true;
}

function deepAssign(object) {
    let hasObject = false;
    _.each(object, (val) => {
        if (_.isObject(val) || _.isArray(val)) {
            deepAssign(val);
            hasObject = true;
        }
    });
    assignEx(object);
}

deepAssign(errList);

module.exports = errList;
