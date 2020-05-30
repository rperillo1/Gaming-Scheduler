var express = require('express');
var router = express.Router();
var gamesCtrl = require('../controllers/games');

router.get('/:group/games', gamesCtrl.index);
router.post('/:group/games', gamesCtrl.createGame);


module.exports = router;