const express = require('express');

const router = express.Router();

const signInController = require('../controllers/signinController.js');

router.route('/').get(signInController.get).post(signInController.post);

module.exports = router;