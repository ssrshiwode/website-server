const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
require('./activity');
require('./puzzle')

// CORS
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    if (ctx.method === 'OPTIONS')
        ctx.body = 200
    else await next()
})

// replace '/website-server' in req url
app.use(async (ctx, next) => {
    if (ctx.url.startsWith('/website-server')) ctx.url = ctx.url.replace('/website-server', '')
    await next()
})

// parse request body:
app.use(bodyParser());

// log
app.use(async (ctx, next) => {
    console.log('------------>')
    console.log("request:", {method: ctx.method, url: ctx.url, query: ctx.query, body: ctx.request.body});
    await next()
    console.log('<------------')
    console.log("response:", {status: ctx.status, message: ctx.message, body: ctx.body});
    console.log('\n')
})

// error handler
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        ctx.status = error.status || error.statusCode;
        ctx.response.body = error.message;
    }
});

// router
app.use(require('./router').routes());

app.listen(3101, () => {
    console.log('app started: http://localhost:3101')
})