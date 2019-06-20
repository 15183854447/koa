const router = require('koa-router')()

router.prefix('/users')

router.get('/:id', function (ctx, next) {
    var id = ctx.params.id;
    ctx.body = {
        id: id
    }
});

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
});

router.post('/login', async (ctx, next) => {
    console.log(ctx.request);
    var data = ctx.request.body;//获取post 传值
    ctx.body = data

});

module.exports = router
