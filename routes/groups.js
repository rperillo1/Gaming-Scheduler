var express = require('express');
var router = express.Router();
var groupsCtrl = require('../controllers/groups');

router.get('/', groupsCtrl.index);
router.post('/', groupsCtrl.createGroup);

module.exports = router;