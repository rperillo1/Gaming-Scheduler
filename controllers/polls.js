const User = require('../models/User');
const FriendGroup = require('../models/FriendGroup');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');



module.exports = {
    index,
    addPoll,
    deletePoll,
    vote
};

function index(req, res) {
    let pendingPolls = [];
    let completedPolls = [];
    let finishedPolls = [];
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.forEach(game => {
            if (game.gameName === req.params.gameName) {
                game.polls.forEach(poll => {
                    if (poll.status === 'pending') {
                        pendingPolls.push(poll);
                    }
                    else if (poll.status === 'completed') {
                        completedPolls.push(poll);
                    }
                    else if (poll.status === 'finished') {
                        finishedPolls.push(poll);
                    };
                });
            };
        });
        res.render(`polls/index`, {
            user: req.user,
            group: group[0],
            gameName: req.params.gameName,
            pendingPolls: pendingPolls,
            completedPolls: completedPolls,
            finishedPolls: finishedPolls
        });
    });
};


function addPoll(req, res) {
    let date;
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.forEach(game => {
            date = new Date(req.body.gameDate)
            if (game.gameName === req.params.gameName) {
                if (date < new Date()) {
                    return;
                }
                if (req.body.timezone === 'ET') {
                    date.setHours(date.getHours() + 4)
                }
                if (req.body.timezone === 'CT') {
                    date.setHours(date.getHours() + 5)
                }
                if (req.body.timezone === 'MT') {
                    date.setHours(date.getHours() + 6)
                }
                if (req.body.timezone === 'PT') {
                    date.setHours(date.getHours() + 7)
                }
                req.body.status = 'pending';
                req.body.gameDate = date;
                game.polls.push(req.body)
            };
        });
        group[0].save(function (err) {
            res.redirect(`/polls/${req.params.group}/${req.params.gameName}`)
        });
    });
};

function deletePoll(req, res) {
    let idx;
    FriendGroup.find({ name: req.params.group }, function (err, group) {
        group[0].games.forEach(game => {
            if (game.gameName === req.params.gameName) {
                game.polls.forEach(poll => {
                    if (poll._id.equals(req.body.id)) {
                        idx = game.polls.indexOf(poll)
                        game.polls.splice(idx, 1)
                    };
                });
            };
        });
        group[0].save(function (err) {
            res.redirect(`/polls/${req.params.group}/${req.params.gameName}`)
        });
    });
};


function vote(req, res) {
    let idx;
    User.findById(req.user, function (err, user) {
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
                                };
                            };
                        };
                        if ((poll.voteYes.length + poll.voteNo.length) === group[0].members.length) {
                            if (poll.voteYes.length > poll.voteNo.length) {
                                poll.status = 'completed'
                            } else if (poll.voteNo.length > poll.voteYes.length) {
                                poll.status = 'finished'
                            } else {
                                poll.status = 'finished'
                            };
                        };
                    });
                };
            });
            const oAuth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET, "urn:ietf:wg:oauth:2.0:oob");
            oAuth2Client.setCredentials({ access_token: user.accessToken });
            listEvents(oAuth2Client)
            group[0].save(function (err) {
                res.redirect(`/polls/${req.params.group}/${req.params.gameName}`)
            });
        });
    })
};



function listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    // calendar.events.list({
    //     calendarId: 'primary',
    //     timeMin: (new Date()).toISOString(),
    //     maxResults: 10,
    //     singleEvents: true,
    //     orderBy: 'startTime',
    // }, (err, res) => {
    //     if (err) return console.log('The API returned an error: ' + err);
    //     const events = res.data.items;
    //     if (events.length) {
    //         console.log('Upcoming 10 events:');
    //         events.map((event, i) => {
    //             const start = event.start.dateTime || event.start.date;
    //             console.log(`${start} - ${event.summary}`);
    //         });
    //     } else {
    //         console.log('No upcoming events found.');
    //     }
    // });
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created: %s', event.htmlLink);
      });
}


var event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2020-06-07T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2020-06-07T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'robertest001@gmail.com'},
      {'email': 'robertest002@gmail.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };

  