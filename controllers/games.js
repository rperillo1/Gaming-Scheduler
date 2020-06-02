const User = require('../models/user');
const FriendGroup = require('../models/friendgroup')


module.exports = {
    index,
    createGame,
    updateName
};

function index(req, res) {
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        res.render(`games/index`, {
            user: req.user,
            group: group[0],
            games: group[0].games
        });
    });
}

function createGame(req, res) {
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.push(req.body);
        group[0].save(function(err){
            res.redirect(`/${group[0].name}/games`)
        });
    });
}

function updateName(req, res) {
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        console.log(group[0].games)
        group[0].games.forEach(game => {
            if (game.gameName === req.body.currentName) {
                game.gameName = req.body.gameName;
            }
        })
        group[0].save(function(err){
            res.redirect(`/${group[0].name}/games`)
        });
    });
}