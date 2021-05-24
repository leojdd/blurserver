var express = require('express');
var router = express.Router();

var blackUserController = require('../controllers/blackUser');

router.post('/report', blackUserController.blackUserReport);

router.get('/verify', blackUserController.verifyUser);

module.exports = router;