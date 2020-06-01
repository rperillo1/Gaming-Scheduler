var express = require('express');
var router = express.Router();
var pollsCtrl = require('../controllers/polls');

router.get('/:group/:gameName', pollsCtrl.index);
router.post('/:group/:gameName', pollsCtrl.addPoll);

module.exports = router;