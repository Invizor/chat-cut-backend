const express = require('express');
const router = express.Router();

const user = require('./users');
const thread = require('./threads');
const message = require('./messages');

router.get('/', (req, res, next) => res.send('I am alive!'));

router.use('/v1/user', user);
router.use('/v1/thread', thread);
router.use('/v1/message', message);

module.exports = router;
