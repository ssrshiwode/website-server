const mongoose = require('mongoose')
const {websiteDB} = require('../../mongodb');

module.exports = {
    activity_keyhole_user_model: websiteDB.model('activity_keyhole_user', new mongoose.Schema({
        phone: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        ip: String,
    }, {timestamps: true})),
    activity_keyhole_user_ip_model: websiteDB.model('activity_keyhole_user_ip', new mongoose.Schema({
        ip: String,
        key: Boolean,
        win: Boolean
    }, {timestamps: true}))
};
