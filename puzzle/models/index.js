let user = require('./user')
let game = require('./game')
let information = require('./information')

module.exports = {
    ...user,
    ...game,
    ...information
}