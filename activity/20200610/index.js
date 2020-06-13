const router = require('../../router');
const {activity_20200610_user_model} = require('./model');

router.get('/activity/20200610/user/:phone', async (ctx, next) => {
    try {
        let phone = ctx.params.phone;
        ctx.response.body = await activity_20200610_user_model.findOne({phone}, {_id: 0, __v: 0});
    } catch (e) {
        ctx.throw(400, e.message);
    }
});

router.post('/activity/20200610/user/:phone', async (ctx, next) => {
    try {
        let phone = ctx.params.phone;
        let activity_20200610_user = new activity_20200610_user_model({phone});
        await activity_20200610_user.save();
        let count = await activity_20200610_user_model.count();
        ctx.response.body = {phone, count};
    } catch (e) {
        ctx.throw(406, e.message);
    }
});

