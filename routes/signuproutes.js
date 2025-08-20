const express = require('express');

const router = express.Router();

const signUpController = require('../controllers/signupController.js');

router.route('/').get(signUpController.get).post(signUpController.post);

module.exports = router;