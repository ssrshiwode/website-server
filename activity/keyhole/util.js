function getRealIp(req) {
    let ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
}

function formatPhone(phone) {
    return phone.substring(0, 3) + '*****' + phone.substring(8)
}

module.exports = {
    getRealIp,
    formatPhone
};
