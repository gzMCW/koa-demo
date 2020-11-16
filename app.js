const koa = require('koa')
const Router = require('koa-router')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('koa-passport')

const { mongoURL } = require('./config/keys')

// 实例化koa
const app = new koa()
const router = new Router()

// 配置koa-body
const koaBody = require('koa-body');

// 静态文件
app.use(require('koa-static')(__dirname + '/public'))

// 链接数据库
mongoose.connect(mongoURL,
  {useNewUrlParser:true,useUnifiedTopology: true}
)
  .then(() => {
    console.log('mongoose connect')
    // 初始化passport
    app.use(passport.initialize())
    app.use(passport.session())
    // 回调到passport.js文件中
    require('./config/passport')(passport)
  })
  .catch(err => {
    console.log(err)
  })


// 路由
router.get('/', async ctx => {
  ctx.code = 200
  ctx.body = { msg: 'hello koa-demo' }
})

// 引入api
const users = require('./routes/api/users')
const upload = require('./routes/api/upload')

// 配置路由地址
router.use('/api/users', users)
router.use('/api/upload', koaBody({
  multipart:true, // 支持文件上传
  encoding:'gzip',
  formidable:{
    uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    onFileBegin: (name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}),upload)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server start on ${port}`)
})