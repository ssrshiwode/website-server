const router = require('../../router');
const {activity_20200610_user_model} = require('./model');

router.get('/activity/20200610/user', async (ctx, next) => {
    try {
        let phone = ctx.request.query.phone;
        ctx.response.body = await activity_20200610_user_model.findOne({phone}, {_id: 0, __v: 0});
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.post('/activity/20200610/user', async (ctx, next) => {
    try {
        let phone = ctx.request.body.phone;
        if (phone.length !== 11) throw Error('手机号信息错误!');
        let activity_20200610_user = new activity_20200610_user_model({phone});
        await activity_20200610_user.save();
        let count = await activity_20200610_user_model.count();
        ctx.response.body = {phone, count};
    } catch (e) {
        ctx.throw(406, e.message);
    }
});

router.get('/activity/20200610/user/rank', async (ctx, next) => {
    try {
        let phone = ctx.request.query.phone;
        let user = await activity_20200610_user_model.findOne({phone}, {_id: 0, __v: 0});
        let count = await activity_20200610_user_model.count({createdAt: {$lt: user.createdAt}});
        ctx.response.body = count + 1;
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.get('/activity/20200610/user/count', async (ctx, next) => {
    try {
        let count = await activity_20200610_user_model.count();
        ctx.response.body = count + 1;
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.get('/activity/20200610/rank/list', async (ctx, next) => {
    try {
        let list = await activity_20200610_user_model.find({}, {_id: 0, phone: 1, createdAt: 1}, {limit: 200});
        ctx.response.body = list.map(user => {
            user.phone = user.phone.substring(0, 3) + '*****' + user.phone.substring(8);
            return user;
        })
    } catch (e) {
        ctx.throw(400, e.message);
    }
});
