const router = require('../../router')
const {UserModel, GameModel, UserGameModel} = require('../models')
const {getDateByMongooseId} = require('../utils/util')

router.get('/user/annual_report', async (ctx, next) => {
    try {
        let userId = ctx.query.userId
        if (!userId) throw {message: '参数错误'}
        let user = await UserModel.findOne({userId}).lean()
        if (!user) throw {message: '用户不存在'}
        let data = {
                games: []
            },
            createdAt = getDateByMongooseId(user._id),
            firstGame = {
                gameName: '',
                coverImage: '',
                start: Infinity
            },
            playLongGame = {
                gameName: '',
                coverImage: '',
                gameLong: 0
            },
            gameList = {
                total: 0,
                entity: 0,
                penetralium: 0,
                novel: 0
            }
        let userGames = await UserGameModel.find({userId},{gameId: 1, others: 1})
        for (let {gameId , others} of userGames) {
            let game = await GameModel.findOne({gameId}, {data: 0}).lean()
            if (!game) continue
            let gameData = {
                gameId: game.gameId,
                gameName: game.gameName,
                coverImage: game.coverImage
            }
            gameData.category = game.others && game.others.category ? game.others.category : ''
            gameData.start = others && others.startTime ? others.startTime : new Date()
            gameData.gameLong = others && others.gameLong ? others.gameLong : 0
            data.games.push(gameData)
        }
        if (data.games.length !== 0) {
            for (let game of data.games) {
                if (firstGame.start > game.start.getTime()) {
                    firstGame = {
                        gameName: game.gameName,
                        coverImage: game.coverImage,
                        start: game.start.getTime()
                    }
                }
                if (playLongGame.gameLong < game.gameLong) {
                    playLongGame = {
                        gameName: game.gameName,
                        coverImage: game.coverImage,
                        gameLong: game.gameLong
                    }
                }
                if (game.category === "entity") gameList.entity += 1
                if (game.category === "penetralium") gameList.penetralium += 1
                if (game.category === "novel") gameList.novel += 1
            }
        }
        gameList.total = data.games.length
        data.end = (new Date("2021-02-11 00:00").getTime() - createdAt.getTime()) > 0
            ? Math.floor((new Date("2021-02-11 00:00").getTime() - createdAt.getTime()) / 86400000)
            : 0
        data.nickname = user.others && user.others.nickname ? user.others.nickname : ''
        data.headimgurl = user.others && user.others.headimgurl ? user.others.headimgurl : ''
        data.start = createdAt.getFullYear()
        data.firstGame = firstGame
        data.playLongGame = playLongGame
        data.gameList = gameList
        delete data.games
        ctx.body = data
    } catch (e) {
        console.error(e);
        ctx.throw(400, e.message)
    }
})