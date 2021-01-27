const router = require('../../router')
const {UserModel, GameModel, UserGameModel} = require('./model')
const {getDateByMongooseId} = require('./util')

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
        if (user.others && user.others.games && user.others.games.unlock) {
            let unlock = user.others.games.unlock
            for (let unlockId in unlock) {
                if (!unlock.hasOwnProperty(unlockId)) continue
                let games = await GameModel.find({unlockId}, {data: 0})
                console.log(unlockId + ':' + games);
                for (let game of games) {
                    let gameData = {
                        gameId: game.gameId,
                        gameName: game.gameName,
                        coverImage: game.coverImage,
                        start: unlock[unlockId]
                    }
                    gameData.category = game.others && game.others.category ? game.others.category : ''
                    let userGame = await UserGameModel.findOne({userId, gameId: game.gameId}, {others: 1}).lean()
                    gameData.gameLong = userGame && userGame.others && userGame.others.gameLong ? userGame.others.gameLong : 0
                    data.games.push(gameData)
                }
            }
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
        ctx.body = data
    } catch (e) {
        console.error(e);
        ctx.throw(400, e.message)
    }
})