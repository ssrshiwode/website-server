const mongoose = require('mongoose')
const {puzzleDB} = require('../../mongodb')

// 秀米文章表
let XiuMiArticleModelSchema = new mongoose.Schema({
    from_id: {
        required: true,
        unique: true,
        type: Number
    },
    title: String,
    picurl: String,
    author: String,
    summary: String,
    showCover: Number,
    description: String,
    url: String, // 当前文章的web地址链接
    uid: Number // 作者的uid
}, {timestamps: true})
XiuMiArticleModelSchema.index({from_id: 1})

// 自定义文章表
let CustomizeArticleModelSchema = new mongoose.Schema({
    id: {
        required: true,
        unique: true,
        type: Number
    },
    url: String, // 当前文章的web地址链接
    uid: Number, // 作者的uid
    backgroundImg: String, // 背景图片
    color: String, // 字体颜色
    summary: String, // 文章简介
    config: [] //自定义内容配置，形如[{type:'title'},{type:'xiuMiArticle', from_id:123},{}]
}, {timestamps: true})
CustomizeArticleModelSchema.index({id: 1})

module.exports = {
    XiuMiArticleModel: puzzleDB.model('xiuMiArticle', XiuMiArticleModelSchema),
    CustomizeArticleModel: puzzleDB.model('customizeArticle', CustomizeArticleModelSchema)
}