'use strict';

const _ = require('lodash');

class BaseController {

    /**
     * Check request for user object
     * @param req
     * @return {boolean}
     */
    hasUser(req) {
        return (req.user && req.user._id);
    }

    /**
     * Check input body for parameters
     * @param req
     * @param [fields]
     * @return {boolean}
     */
    checkBody(req, fields) {
        let isValid = true;
        fields.forEach(field => {
          if (!req.checkBody(field)) {
            isValid = false;
          }
        });
        return isValid;
    }

    /**
     * Check input query for parameters
     * @param req
     * @param [fields]
     * @return {boolean}
     */
    checkQuery(req, fields) {
      let isValid = true;
      fields.forEach(field => {
        if (!req.checkQuery(field)) {
          isValid = false;
        }
      });
      return isValid;
    }

    /**
     * Parse and return pagination parameters with keyword
     * @param req
     * @param [fields] Array Fields for additional check and return
     * @param [offset]
     * @param [limit]
     * @return {{offset: number, limit: number, keyword: null}}
     */
    usePagination(req, fields = null, offset = 0, limit = 20) {
        if (!this.checkQuery(req, ['offset', 'limit', 'keyword'], true)) {
            return {offset, limit, keyword: null};
        }
        if (req.query.keyword && req.query.keyword.length <= 0) {
            req.query.keyword = null;
        }
        let result = {
            offset: req.query.offset || offset,
            limit : req.query.limit || limit,
            keyword: req.query.keyword || null
        };
        if (result.offset === 1) {
            result.offset = 0;
        }
        if (fields) {
            _.each(_.pick(req.query, fields), (field, key) => {
                if (field.length && field.length > 0) {
                    result[key] = field;
                }
            })
        }
        return result;
    }
}

module.exports = BaseController;