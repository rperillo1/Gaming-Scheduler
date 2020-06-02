var express = require('express');
var router = express.Router();
var homeCtrl = require('../controllers/home');

router.get('/', homeCtrl.index);


module.exports = router;