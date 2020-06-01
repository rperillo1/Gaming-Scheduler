var express = require('express');
var router = express.Router();
var pollsCtrl = require('../controllers/polls');

router.get('/:group/:gameName', pollsCtrl.index);
router.post('/:group/:gameName', pollsCtrl.addPoll);
router.delete('/:group/:gameName', pollsCtrl.deletePoll);
router.post('/:group/:gameName/vote', pollsCtrl.vote);


module.exports = router;