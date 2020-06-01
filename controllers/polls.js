const User = require('../models/user');
const FriendGroup = require('../models/friendgroup')


module.exports = {
    index,
    addPoll
};

function index(req, res) {
    let polls;
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.forEach(game => {
            if (game.gameName === req.params.gameName) {
                polls = game.polls
            }
        });
        res.render(`polls/index`, {
            user: req.user,
            group: group[0],
            gameName: req.params.gameName,
            polls: polls
        });
    });
}


function addPoll(req, res) {
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.forEach(game => {
            if (game.gameName === req.params.gameName) {
                req.body.status = 'pending';
                game.polls.push(req.body)
            }
            group[0].save(function(err) {
                res.redirect(`/${req.params.group}/${req.params.gameName}`)
            })
        });
    })
}