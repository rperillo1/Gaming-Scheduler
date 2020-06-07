const { google } = require('googleapis');
const User = require('../models/User');
const FriendGroup = require('../models/FriendGroup');



module.exports = {
    push
};

function push(req, res) {
    User.findById(req.user, function (err, user) {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET, "urn:ietf:wg:oauth:2.0:oob");
        oAuth2Client.setCredentials({ access_token: user.accessToken });
        pushEvents(oAuth2Client, req)
        res.redirect(`/polls/${req.params.group}/${req.params.gameName}`)
    });
}

function pushEvents(auth, req) {
    var event;
    let attendeesArray = [];
    let startDateString;
    let endDateString;
    let pollDate = new Date(req.body.pollDate)
    startDateString = `${pollDate.getFullYear()}-${(pollDate.getMonth() + 1).toString().padStart(2, '0')}-${pollDate.getDate()}T${pollDate.getHours().toString().padStart(2, '0')}:${pollDate.getMinutes().toString().padStart(2, '0')}:00-01:00`
    endDateString = `${pollDate.getFullYear()}-${(pollDate.getMonth() + 1).toString().padStart(2, '0')}-${pollDate.getDate()}T${(pollDate.getHours() + 1).toString().padStart(2, '0')}:${pollDate.getMinutes().toString().padStart(2, '0')}:00-01:00`
    FriendGroup.find({ name: req.params.group }).populate('members').exec(function (err, group) {
        group[0].members.forEach(member => {
            attendeesArray.push({ 'email': member.email })
        })
        event = {
            'summary': `${req.params.gameName} session with ${req.params.group}`,
            'start': {
                'dateTime': startDateString,
            },
            'end': {
                'dateTime': endDateString,
            },
            'attendees': attendeesArray,
        };
        console.log(event)
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event.htmlLink);
        });
    });
}