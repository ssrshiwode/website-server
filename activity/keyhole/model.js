const mongoose = require('mongoose');

module.exports = {
    activity_keyhole_user_model: mongoose.model('activity_keyhole_user', new mongoose.Schema({
        phone: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
    }, {timestamps: true}))
};