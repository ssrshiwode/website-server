const router = require('../../router');
const {activity_keyhole_user_model, activity_keyhole_user_ip_model} = require('./model');
const {getRealIp, formatPhone} = require('./util');

router.get('/activity/keyhole/user', async (ctx, next) => {
    try {
        let phone = ctx.request.query.phone;
        ctx.response.body = await activity_keyhole_user_model.findOne({phone}, {_id: 0, __v: 0});
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.post('/activity/keyhole/user', async (ctx, next) => {
    try {
        let phone = ctx.request.body.phone,
            ip = getRealIp(ctx.request),
            rankList = [],
            rank = 0,
            message = '提交成功';

        if (!phone || phone.length !== 11) {
            let err = new Error('参数错误');
            err.code = 400;
            ctx.throw(err);
        }

        let self = await activity_keyhole_user_model.findOne({phone});
        if (!self) {
            let answerHistory = await activity_keyhole_user_ip_model.findOne({ip});
            if (!answerHistory || !answerHistory.key || !answerHistory.win) {
                let err = new Error('请先答题再领取奖励');
                err.code = 401;
                ctx.throw(err);
            }
            let activity_keyhole_user = new activity_keyhole_user_model({phone, ip});
            await activity_keyhole_user.save();
        } else message = "手机号已提交过";
        let users = await activity_keyhole_user_model.find({}, {_id: 0, __v: 0}, {sort: {createdAt: 1}, limit: 500});
        users.forEach((user, index) => {
            index++;
            if (user.phone === phone) rank = index;
            let userPhone = {phone: formatPhone(user.phone), rank: index};
            if (index <= 10) rankList.push(userPhone);
        });
        if (rank > 500) message = '奖励已全部领完';
        switch (rank) {
            case 11:
                rankList.push({rank, phone: formatPhone(users[rank - 1].phone)});
                break;
            case 12:
                rankList.push({rank: rank - 1, phone: formatPhone(users[rank - 2].phone)});
                rankList.push({rank, phone: formatPhone(users[rank - 1].phone)});
                break;
            case 13:
                rankList.push({rank: rank - 2, phone: formatPhone(users[rank - 3].phone)});
                rankList.push({rank: rank - 1, phone: formatPhone(users[rank - 2].phone)});
                rankList.push({rank, phone: formatPhone(users[rank - 1].phone)});
                break;
            case 14:
                rankList.push({rank: rank - 3, phone: formatPhone(users[rank - 4].phone)});
                rankList.push({rank: rank - 2, phone: formatPhone(users[rank - 3].phone)});
                rankList.push({rank: rank - 1, phone: formatPhone(users[rank - 2].phone)});
                rankList.push({rank, phone: formatPhone(users[rank - 1].phone)});
                break;
            case 15:
                rankList.push({rank: rank - 4, phone: formatPhone(users[rank - 5].phone)});
                rankList.push({rank: rank - 3, phone: formatPhone(users[rank - 4].phone)});
                rankList.push({rank: rank - 2, phone: formatPhone(users[rank - 3].phone)});
                rankList.push({rank: rank - 1, phone: formatPhone(users[rank - 2].phone)});
                rankList.push({rank, phone: formatPhone(users[rank - 1].phone)});
                break;
            default:
                if (rank >= 16) {
                    rankList.push({rank: '', phone: '……'});
                    rankList.push({rank: rank - 4, phone: formatPhone(users[rank - 5].phone)});
                    rankList.push({rank: rank - 3, phone: formatPhone(users[rank - 4].phone)});
                    rankList.push({rank: rank - 2, phone: formatPhone(users[rank - 3].phone)});
                    rankList.push({rank: rank - 1, phone: formatPhone(users[rank - 2].phone)});
                    rankList.push({rank, phone: formatPhone(users[rank - 1].phone)});
                    if (!!users[rank]) rankList.push({rank: rank + 1, phone: formatPhone(users[rank].phone)});
                    if (!!users[rank + 1]) rankList.push({rank: rank + 2, phone: formatPhone(users[rank + 1].phone)});
                    if (!!users[rank + 2]) rankList.push({rank: rank + 3, phone: formatPhone(users[rank + 2].phone)});
                    if (!!users[rank + 3]) rankList.push({rank: rank + 4, phone: formatPhone(users[rank + 3].phone)});
                    if (!!users[rank + 4]) rankList.push({rank: rank + 5, phone: formatPhone(users[rank + 4].phone)});
                }
                break;
        }
        rankList.push({rank: '', phone: '……'});
        ctx.response.body = {phone, rank, rankList, message};
    } catch (e) {
        ctx.throw(e.code || 400, e.message);
    }
});

router.get('/activity/keyhole/user/rank', async (ctx, next) => {
    try {
        let phone = ctx.request.query.phone;
        let user = await activity_keyhole_user_model.findOne({phone}, {_id: 0, __v: 0});
        let count = await activity_keyhole_user_model.count({createdAt: {$lt: user.createdAt}});
        ctx.response.body = count + 1;
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.get('/activity/keyhole/user/count', async (ctx, next) => {
    try {
        let count = await activity_keyhole_user_model.count();
        ctx.response.body = count + 1;
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.get('/activity/keyhole/rank/list', async (ctx, next) => {
    try {
        let list = await activity_keyhole_user_model.find({}, {_id: 0, phone: 1, createdAt: 1}, {limit: 200});
        ctx.response.body = list.map(user => {
            user.phone = user.phone.substring(0, 3) + '*****' + user.phone.substring(8);
            return user;
        })
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.get('/activity/keyhole/check/answer', async (ctx, next) => {
    try {
        let answer = ctx.request.query.answer,
            type = ctx.request.query.type,
            ip = getRealIp(ctx.request),
            result,
            message;
        if (!answer || !type) throw {message: '参数错误'};
        switch (type) {
            case 'key':
                if (answer === '2310') {
                    result = 1;
                    message = '答案正确';
                    await activity_keyhole_user_ip_model.updateOne({ip}, {$set: {key: true}}, {upsert: true});
                } else {
                    result = 0;
                    message = '答案错误';
                }
                break;
            case 'win':
                if (answer === 'youwin') {
                    result = 1;
                    message = '答案正确';
                    await activity_keyhole_user_ip_model.updateOne({ip}, {$set: {win: true}}, {upsert: true});
                } else {
                    result = 0;
                    message = '答案错误';
                }
                break;
            default:
                result = 0;
                message = '答案错误';
                break;
        }
        ctx.response.body = {result, message}
    } catch (e) {
        ctx.throw(400, e.message);
    }
});
