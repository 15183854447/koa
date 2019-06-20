const Koa = require('koa');
const app = new Koa();
const views = require('koa-views'); //koa-views对需要进行视图模板渲染的应用是个不可缺少的中间件，支持ejs, nunjucks等众多模板引擎。
const json = require('koa-json'); //返回json数据中间件
const onerror = require('koa-onerror'); //错误处理中间件
const bodyparser = require('koa-bodyparser');//post请求参数的处理
const logger = require('koa-logger');//koa-logger提供了输出请求日志的功能，包括请求的url、状态码、响应时间、响应体大小等信息
const session = require('koa-session');//session中间件


app.keys = ['some secret hurr'];
/** 签名*/
//session配置
const CONFIG = {
    key: 'koa:sess', /**默认值 */
    maxAge: 86400000, /**一个数字表示从Date.now()得到的毫秒值*/
    autoCommit: true, /** (布尔值)自动提交报头(默认为true) */
    overwrite: true, /** 是否重写 无效 */
    httpOnly: true, /**  */
    signed: true, /**签名 默认 true  */
    rolling: false, /**  每次请求强制设置session  */
    renew: true, /**快过期的时候的请求设置session[需要设置] */
};
app.use(session(CONFIG, app));//session


//引入路由
const index = require('./routes/index');
const users = require('./routes/users');

// error handler
onerror(app);

// post 解析参数中间件
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));

app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));//静态资源


//设置允许跨域 或者让使用 koa2-cors中间件
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});


//视图
app.use(views(__dirname + '/views', {
    extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
    console.log('检测session');
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)//模板字符串
});

// routes 挂在路由
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());


// 监听错误
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});
//监听端口
app.listen("9528", err => {
    if (err) {
        throw err
    } else {
        console.log('9528端口 服务已启动');
    }
});
module.exports = app;
