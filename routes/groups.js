var express = require('express');
var router = express.Router();
var groupsCtrl = require('../controllers/groups');

router.get('/', groupsCtrl.index);
router.post('/', groupsCtrl.createGroup);
router.post('/addMember', groupsCtrl.addMember);

module.exports = router;