const User = require('../models/User');
const FriendGroup = require('../models/FriendGroup')


module.exports = {
    index,
    createGroup,
    addMember,
    delete: deleteGroup
};

function index(req, res) {
    FriendGroup.find({ members: req.user }).populate('members').exec(function (err, groups) {
        User.find({}, function (err, users) {
            res.render('groups/index', {
                user: req.user,
                users: users,
                groups
            });
        });
    });
};

function createGroup(req, res) {
    User.findById(req.user, function (err, user) {
        const newGroup = new FriendGroup(req.body);
        newGroup.members.push(user)
        newGroup.save(function (err) {
            if (err) return console.log(err);
            res.redirect('/groups');
        });
    });
};


function addMember(req, res) {
    let idx;
    FriendGroup.find({ members: req.user }, function (err, groups) {
        User.find({ email: req.body.email }, function (err, user) {
            if (user[0] === undefined) {
                console.log('send email to user')
                return;
            };
            groups.forEach(group => {
                if (group.name === req.body.name) {
                    group.members.forEach(member => {
                        if (member.equals(user[0]._id)) {
                            idx = group.members.indexOf(member)
                            group.members.splice(idx, 1)
                        };
                    });
                    group.members.push(user[0]._id)
                    group.save(function (err) {
                        res.redirect('/groups');
                    });
                };
            });
        });
    });
};

function deleteGroup(req, res) {
    FriendGroup.find({ members: req.user }, function (err, groups) {
        User.find({ email: req.body.email }, function (err, user) {
            groups.forEach(group => {
                if (group.name === req.body.name) {
                    FriendGroup.findByIdAndRemove(group._id, function(err, group) {
                        res.redirect('/groups')
                    });
                };
            });
        });
    });
};
