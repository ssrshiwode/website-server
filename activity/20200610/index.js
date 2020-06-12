const router = require('../../router');
var fn_hello = async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
};


router.get('/hello/:name', fn_hello);
