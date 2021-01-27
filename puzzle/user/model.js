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

let GameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    gameType: String,
    gameName: String,
    subtitle: String,   //副标题
    icon: String,
    coverImage: String,
    images: [],
    backerMoney: Number,   //众筹金额
    backerCount: Number,   //众筹人数
    saleVolume: Number,   //销售量
    saleAmount: Number,   //销售金额
    bookNumber: Number,   //预约人数
    releaseId: String,    //发布人id
    releaseName: String,
    releaseHeadImgUrl: String,
    desc: String,
    language: String,
    mainUrl: String,
    version: String,
    unlockId: String,
    app_display_version: mongoose.Schema.Types.Number,
    app_min_version: mongoose.Schema.Types.Number,
    old_version_id: mongoose.Schema.Types.String,
    sdkVersion: Number,
    status: Number, // 0：下线 1，上线
    auditStatus: Number, // 0：未审核 1，待审核 2，审核中 3，审核通过 4，审核失败
    data: {},    //title: 'string', config: {}, modules: {}, props: {}
    date: {
        type: Date,
        default: Date.now
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    others: {}
});
GameSchema.index({unlockId: 1});
GameSchema.index({gameId: 1});
GameSchema.index({gameName: 1});
GameSchema.index({'others.category': 1});

let UserGameSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    gameId: {
        type: String,
        required: true,
    },
    gameType: String,
    date: Date,
    data: {},   //process: 'string', record: {}, bag: {}, startTime: Date
    forever: {},
    saves: [],  //{data}
    mainTask: {},
    secondTasks: [],
    totalData: [],
    others: {},
    saveData: {},
    splitLine: {}
});
UserGameSchema.index({userId: 1, gameId: 1});
UserGameSchema.index({gameId: 1, 'others.score': -1});
UserGameSchema.index({gameId: 1, date: -1});

module.exports = {
    UserModel: puzzleDB.model('user', UserSchema),
    GameModel: puzzleDB.model('progame', GameSchema),
    UserGameModel: puzzleDB.model('usergame', UserGameSchema),
}