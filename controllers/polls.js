const User = require('../models/user');
const FriendGroup = require('../models/friendgroup')


module.exports = {
    index,
    addPoll,
    deletePoll,
    vote
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
            group[0].save(function (err) {
                res.redirect(`/polls/${req.params.group}/${req.params.gameName}`)
            })
        });
    })
}

function deletePoll(req, res) {
    let idx;
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.forEach(game => {
            if (game.gameName === req.params.gameName) {
                game.polls.forEach(poll => {
                    if (poll._id.equals(req.body.id)) {
                        idx = game.polls.indexOf(poll)
                        game.polls.splice(idx, 1)
                    }
                })
            }
            group[0].save(function (err) {
                res.redirect(`/polls/${req.params.group}/${req.params.gameName}`)
            })
        });
    })
}


function vote(req, res) {
    let idx;
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.forEach(game => {
            if (game.gameName === req.params.gameName) {
                game.polls.forEach(poll => {
                    if (poll._id.equals(req.body.id)) {
                        if (req.body.vote === 'voteYes') {
                            if (poll.voteNo.includes(req.user._id)) {
                                idx = poll.voteNo.indexOf(req.user._id)
                                poll.voteNo.splice(idx, 1)
                                poll.voteYes.push(req.user._id)
                            }
                            else if (poll.voteYes.includes(req.user._id)) {
                                console.log('Yes - already in here')
                            } else {
                                poll.voteYes.push(req.user._id)
                            }
                        }
                        if (req.body.vote === 'voteNo') {
                            if (poll.voteYes.includes(req.user._id)) {
                                idx = poll.voteYes.indexOf(req.user._id)
                                poll.voteYes.splice(idx, 1)
                                poll.voteNo.push(req.user._id)
                            }
                            else if (poll.voteNo.includes(req.user._id)) {
                                console.log('No - already in here')
                            } else {
                                poll.voteNo.push(req.user._id)
                            }
                        }
                    }
                    console.log(poll)
                    // handleVotes(poll.voteYes, poll.voteNo, group.members, poll)
                })
            }
            group[0].save(function (err) {
                res.redirect(`/polls/${req.params.group}/${req.params.gameName}`)
            })
        });
    })
}

// function handleVotes(voteYes, voteNo, members, poll) {
//     if (voteYes.length + voteNo.length === members.length) {
//         poll.status = 'completed'
//         if (voteYes.length > voteNo.length) {
//             //card text turn green
//             console.log('turn the card green')
//         } else {
//             //card text turn red
//             console.log('turn the card red')
//         }
//     }
// }