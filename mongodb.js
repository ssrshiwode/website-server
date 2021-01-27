const mongoose = require('mongoose');
let website_connection_uri = 'mongodb://omManager:managerpwd@dds-2ze1e3965fa544d4-pub.mongodb.rds.aliyuncs.com:3717/website';
let puzzle_connection_uri_dev = 'mongodb://omManager:managerpwd@dds-2ze1e3965fa544d4-pub.mongodb.rds.aliyuncs.com:3717/puzzle';
let puzzle_connection_uri_pro = 'mongodb://omManager:managerpwd@dds-2ze9e99ba70f7af41.mongodb.rds.aliyuncs.com:3717,dds-2ze9e99ba70f7af42.mongodb.rds.aliyuncs.com:3717/puzzle?replicaSet=mgset-7373351';
let puzzle_connection_uri

let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5,
    useCreateIndex: true
};

let websiteDB = mongoose.createConnection(website_connection_uri, options, err => {
    if (err) {
        console.log(err);
        console.log('website db connect fail')
    } else console.log('website db connect success')
})

process.env.NODE_ENV === 'pro' ? puzzle_connection_uri = puzzle_connection_uri_pro : puzzle_connection_uri = puzzle_connection_uri_dev

let puzzleDB = mongoose.createConnection(puzzle_connection_uri, options, err => {
    if (err) {
        console.log(err);
        console.log('puzzle db connect fail')
    } else console.log('puzzle db connect success')
})

module.exports = {
    websiteDB,
    puzzleDB
};