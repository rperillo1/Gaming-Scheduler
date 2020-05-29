const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pollSchema = new Schema(
    {
        gameDate: {
            type: Date,
            required: true
        },
        voteYes: {
            type: Array
        },
        voteNo: {
            type: Array
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'finished']
        }
    }, {
    timestamps: true
})


const gameSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        polls: [pollSchema]
    }, {
    timestamps: true
})


const friendGroupSchema = new Schema(
    {
        name: {
            type: String,
            required: true
            // unique: true
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        games: [gameSchema]
    }, {
    timestamps: true
});



module.exports = mongoose.model('FriendGroup', friendGroupSchema)