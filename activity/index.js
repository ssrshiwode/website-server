require('./keyhole');
const router = require('../router');
const {activity_user_model} = require('./model');

router.get('/activity/user', async (ctx, next) => {
    try {
        let userKey = ctx.request.query.userKey;
        let activityId = ctx.request.query.activityId;
        ctx.response.body = await activity_user_model.findOne({activityId, userKey}, {_id: 0, __v: 0});
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.post('/activity/user', async (ctx, next) => {
    try {
        let userKey = ctx.request.body.userKey;
        let activityId = ctx.request.body.activityId;
        let data = ctx.request.body.data;

        let activity_user = new activity_user_model({userKey, activityId, data});
        await activity_user.save();
        let count = await activity_user_model.count({activityId});
        ctx.response.body = {activity_user, count};
    } catch (e) {
        if (e.code === 11000) {
            e.code = 406;
            e.message = '手机号已提交过';
        }
        ctx.throw(e.code || 400, e.message);
    }
});

router.get('/activity/user/rank', async (ctx, next) => {
    try {
        let userKey = ctx.request.query.userKey;
        let activityId = ctx.request.query.activityId;
        let user = await activity_user_model.findOne({userKey, activityId}, {_id: 0, __v: 0});
        let count = await activity_user_model.count({activityId, createdAt: {$lt: user.createdAt}});
        ctx.response.body = count + 1;
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.get('/activity/user/count', async (ctx, next) => {
    try {
        let activityId = ctx.request.query.activityId;
        let count = await activity_user_model.count({activityId});
        ctx.response.body = count + 1;
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.get('/activity/rank/list', async (ctx, next) => {
    try {
        let limit = ctx.request.query.limit || 50;
        let activityId = ctx.request.query.activityId;
        let list = await activity_user_model.find({activityId}, {
            _id: 0,
            userKey: 1,
            data: 1,
            createdAt: 1
        }, {limit});
        ctx.response.body = list.map(user => {
            user.userKey = user.userKey.substring(0, 3) + '***' + user.userKey.substring(6);
            return user;
        })
    } catch (e) {
        ctx.throw(400, e.message);
    }
});
