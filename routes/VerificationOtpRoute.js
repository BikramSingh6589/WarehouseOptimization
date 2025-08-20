const express = require('express');
const router = express.Router();

const verifyOtp = require('../controllers/otpController.js')

router.route('/').get(verifyOtp.get).post(verifyOtp.post);

module.exports = router;