const router = require('../../router')
const {GameModel, GameEvaluationModel} = require('../models')

router.get('/game/getGameDetailByGameId', async (ctx, next) => {
    try {
        let gameId = ctx.query.gameId
        if (!gameId) throw {message: '参数错误'}
        let {gameName, subtitle, desc, coverImage, others} = await GameModel.findOne({gameId}, {
            gameName: 1,
            subtitle: 1,
            desc: 1,
            coverImage: 1,
            others: 1
        }).lean();
        let game = {
            gameName,
            subtitle,
            desc,
            coverImage,
            scoreAverage: !!others.gameScore ? others.gameScore.scoreAverage : '0.0',
            playerCount: others.playerCount,
            themes: [],
            demo: others.demo ? "true" : "false",
            gameLong: others.gameLong ? (others.gameLong % 60 === 0 ? others.gameLong / 60 : (others.gameLong / 60).toFixed(1)) : 0
        };
        // 区分多人游戏的标签,语音房的适合人数标签
        if (others.isMultiGame) {
            let theme = "";
            if (others.category === 'novel') {
                game.themes.push(`上限6人`);
            } else {
                if (others.playerConfig != null) game.themes.push(`适合${others.playerConfig.length}人`);
            }
            switch (others.category) {
                case "penetralium":
                    theme = "密室逃脱";
                    break;
                case "script":
                    theme = "剧本杀";
                    break;
                case "novel":
                    theme = "互动阅读";
                    break;
                default:
                    !others.category ? theme = "" : theme = others.category;
                    break;
            }
            game.themes.push(theme)
        }
        if (others.themes && Array.isArray(others.themes)) others.themes.forEach(d => game.themes.push(d));
        let evaluation = await GameEvaluationModel.find({gameId, carefully: true}, {_id: 0, __v: 0}).lean();
        if (!evaluation.length) {
            evaluation = await GameEvaluationModel.find({gameId}, {_id: 0, __v: 0}, {
                limit: 3,
                sort: {date: -1}
            }).lean();
        }
        ctx.body = {game, evaluation}
    } catch (e) {
        console.error(e);
        ctx.throw(400, e.message)
    }
})