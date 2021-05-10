var express = require('express');
var router = express.Router();

var companyController = require('../controllers/company');

router.get('/getList', companyController.getList);

module.exports = router;