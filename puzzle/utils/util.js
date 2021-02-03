function getDateByMongooseId(id) {
    if (!id) return
    let timestamp = id.toString().substring(0, 8)
    return new Date(parseInt(timestamp, 16) * 1000)
}

module.exports = {
    getDateByMongooseId
}