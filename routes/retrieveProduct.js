const express = require('express');
const router = express.Router();


const retrieveProduct = require('../controllers/retriveProductCon.js');

router.route('/').post(retrieveProduct);


module.exports = router;