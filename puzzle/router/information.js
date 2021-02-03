const router = require('../../router')
const {CustomizeArticleModel, XiuMiArticleModel} = require('../models')

router.get('/information/customizeArticle', async (ctx, next) => {
    try {
        let id = ctx.query.id
        if (!id) throw {message: '参数错误'}
        ctx.body = await CustomizeArticleModel.findOne({id}, {_id: 0, __v: 0}).lean()
    } catch (e) {
        console.error(e);
        ctx.throw(400, e.message)
    }
})

router.get('/information/xiuMiArticle', async (ctx, next) => {
    try {
        let from_id = ctx.query.from_id
        if (!from_id) throw {message: '参数错误'}
        let {description} = await XiuMiArticleModel.findOne({from_id}, {description: 1}).lean()
        ctx.body = description
    } catch (e) {
        console.error(e);
        ctx.throw(400, e.message)
    }
})