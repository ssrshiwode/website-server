const mongoose = require('mongoose')
const {puzzleDB} = require('../../mongodb')

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

let GameEvaluationSchema = new mongoose.Schema({
    evaluationId: {
        type: String,
        required: String,
        unique: true
    },
    gameId: String,
    userId: String,
    username: String,
    headimgurl: String,
    puzzle: Number, //谜题分
    plot: Number,   //剧情分
    material: Number,//实物分
    score: Number,  //总评分
    content: String,  //评价内容
    gameLong: Number,  //游戏时长 分钟
    carefully: Boolean,  //精选
    date: Date,
});
GameEvaluationSchema.index({gameId: 1, score: 1});
GameEvaluationSchema.index({gameId: 1, score: -1});
GameEvaluationSchema.index({userId: 1});
GameEvaluationSchema.index({userId: 1, gameId: 1});

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
    GameModel: puzzleDB.model('progame', GameSchema),
    GameEvaluationModel: puzzleDB.model('gameevaluation', GameEvaluationSchema),
    UserGameModel: puzzleDB.model('usergame', UserGameSchema),
}