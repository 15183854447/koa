const router = require('koa-router')();//路由中间件

const userService = require('../mysql/index')


router.get('/list.html', async function (ctx, next) {
    try {
        await userService.query('select * from users', []).then(res => {
            console.log(res);
            if (res.length > 0) {
                ctx.response.status = 203;
                ctx.body = {
                    code: "200",
                    data: res,
                    message: "成功"
                }
            } else {
                ctx.body = {
                    code: "200",
                    data: [],
                    message: "成功"
                }
            }
        });
    } catch (e) {
        ctx.response.status = 200;
        ctx.body = {
            code: "200",
            data: e,
            message: "查询失败"
        }
    }
});

router.get('/:id', async (ctx, next) => {
    ctx.session.username = '张三';
    ctx.cookies.set('sex', '132456aasdzasda', {
        // domain: 'localhost',  // 写cookie所在的域名
        path: '/',       // 写cookie所在的路径
        maxAge: 10 * 60 * 1000, // cookie有效时长
        // expires: new Date('2017-02-15'),  // cookie失效时间
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
    });
    // await ctx.render('index', {
    //     title: 'Hello Koa 2!'
    // })
    var id = ctx.params.id;
    var data = await userService.query('select * from users WHERE id=?', [id]);
    console.log(data);
    ctx.body = data;
});


router.get('/string', async (ctx, next) => {
    ctx.body = {id: "1231", name: "张三", sex: "女"}
});

router.get('/json', async (ctx, next) => {
    let name = ctx.session.username;
    console.log(ctx.cookies.get('sex'));
    ctx.body = {
        title: 'koa2 json',
        username: name
    }
});

module.exports = router;
