const mongoose = require('mongoose');
let connection_uri = 'mongodb://omManager:managerpwd@dds-2ze1e3965fa544d4-pub.mongodb.rds.aliyuncs.com:3717/website';

mongoose.connect(connection_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


module.exports = db;