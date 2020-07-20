const mongoose = require('mongoose');

module.exports = {
    activity_keyhole_user_model: mongoose.model('activity_keyhole_user', new mongoose.Schema({
        phone: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        ip: String,
    }, {timestamps: true})),
    activity_keyhole_user_ip_model: mongoose.model('activity_keyhole_user_ip', new mongoose.Schema({
        ip: String,
        key: Boolean,
        win: Boolean
    }, {timestamps: true}))
};
