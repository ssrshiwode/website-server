const mongoose = require('mongoose');

module.exports = {
    activity_20200610_user_model: mongoose.model('activity_20200610_user', new mongoose.Schema({
        phone: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
    }, {timestamps: true}))
};