const User = require('../models/user');
const FriendGroup = require('../models/friendgroup')


module.exports = {
    index,
    createGroup
};

function index(req, res) {
    console.log(req.user)
    FriendGroup.find({members: req.user}, function(err, groups){
        User.find({}, function (err, users) {
            res.render('groups/index', {
                user: req.user,
                users: users,
                groups
            })
        })
    })
}

function createGroup(req, res) {
    User.findById(req.user, function(err, user) {
        const newGroup = new FriendGroup(req.body);
        newGroup.members.push(user)
        console.log('new Group', newGroup)
        newGroup.save(function (err) {
            if (err) return console.log(err);
            res.redirect('groups');
        })
    })
}

