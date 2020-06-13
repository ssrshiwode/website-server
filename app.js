const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const db = require('./mongodb');
require('./activity');

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(require('./router').routes());

db.once('open', function () {
    app.listen(3101);
    console.log('db connected and app started: http://localhost:3000')
});

