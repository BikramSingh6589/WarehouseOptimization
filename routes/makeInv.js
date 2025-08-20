const express = require('express');

const router = express.Router();


const makeInvController = require('../controllers/makeInventory.js');

router.route('/').get(makeInvController.get).post(makeInvController.post);

module.exports = router;