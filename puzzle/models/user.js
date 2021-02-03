const mongoose = require('mongoose')
const {puzzleDB} = require('../../mongodb')

let UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    uid: {
        type: Number,
        unique: true
    },
    username: String,
    password: String,
    havePassword: Boolean,
    followNum: {type: Number, default: 0}, // 关注数
    activityNum: {type: Number, default: 0}, // 动态数
    fansNum: {type: Number, default: 0}, // 粉丝数
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    date: Date,
    token: String,
    admin: String,  // [admin, editor, operation, customer]
    author: String,  // [editor, author_senior, author]
    isAuthor: Boolean, // 用户是否是作者
    authentication: String, // 官方认证身份
    avatarFrame: String, // 头像框
    'others.role': String, // admin 账户可以进入所有游戏
    'others.nickname': String,
    'others.headimgurl': String,
    'others.sex': Number,   //0: 未设置 1:男 2: 女
    'others.userIdCounts': Number,
    'others.registerTime': Date,
    'others.loginTime': Date,
    'others.nimToken': String,  //云信token
    'others.city': String,
    'others.province': String,
    'others.country': String,
    'others.sign': String,
    'others.unionid': String,   //微信ID
    'others.weChatUserInfo': {},    //微信账户信息
    'others.appleId': String,   //苹果ID
    'others.appleUserInfo': {}, //苹果账户信息
    'others.games.unlock': {},  //解锁的游戏
    'others.games.test': {},    //测试的游戏
    'others.backgroundurl': String,  //背景图片

}, {timestamps: true});
UserSchema.index({userId: 1});
UserSchema.index({uid: 1});
UserSchema.index({'others.userIdCounts': 1});

module.exports = {
    UserModel: puzzleDB.model('user', UserSchema)
}