const express = require('express');
const router = express.Router();


const addingController = require('../controllers/addingController.js');

router.route('/').post(addingController);

module.exports = router;