'use strict';

const authService = require('./../services/auth-service');
const express = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const imageService = require('../services/image-service');

router.post('/avatar', authService(), upload.single('avatar'), imageService.uploadAvatar.bind(imageService));
router.post('/file', authService(), upload.single('file'), imageService.uploadFile.bind(imageService));

module.exports = router;