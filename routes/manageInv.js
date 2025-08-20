const express = require('express');

const router = express.Router();


const manageInvController = require('../controllers/manageInventory.js');

router.route('/').get(manageInvController.get);

module.exports = router;