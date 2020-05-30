const User = require('../models/user');
const FriendGroup = require('../models/friendgroup')


module.exports = {
    index,
    createGroup,
    addMember
};

function index(req, res) {
    FriendGroup.find({ members: req.user }).populate('members').exec(function (err, groups) {
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
    User.findById(req.user, function (err, user) {
        const newGroup = new FriendGroup(req.body);
        newGroup.members.push(user)
        newGroup.save(function (err) {
            if (err) return console.log(err);
            res.redirect('/groups');
        })
    })
}


function addMember(req, res, next) {
    FriendGroup.find({ members: req.user }, function (err, groups) {
        User.find({ email: req.body.email }, function (err, user) {
            groups.forEach(group => {
                if (group.name === req.body.name) {
                    group.members.push(user[0]._id)
                    group.save(function (err) {
                        res.redirect('/groups');
                    })
                }
            })
        })
    })
}
