const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const db = require('./mongodb');
require('./activity');

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(require('./router').routes());

db.once('open', function () {
    app.listen(3101);
    console.log('db connected and app started: http://localhost:3101')
});

