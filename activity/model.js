const mongoose = require('mongoose');

module.exports = {
    activity_user_model: mongoose.model('activity_user', new mongoose.Schema({
        userKey: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        activityId: {
            type: String,
            index: true,
        },
        data: {},
    }, {timestamps: true}))
};