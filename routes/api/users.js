const Router = require('koa-router')
const router = new Router()
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { secretOrKey } = require('../../config/keys')
const passport = require('koa-passport')

/**
 * @route GET appi/users/test
 * @desc 测试接口地址
 * @acsess 接口公开 
 */
router.get('/test', async ctx => {
  ctx.status = 200
  ctx.body = { msg: 'test api' }
})

/**
 * @route POST appi/users/register
 * @desc 测试接口地址
 * @acsess 接口公开 
 */
router.post('/register', async ctx => {
  const { email, name, account, password, avatar } = ctx.request.body
  const findResult = await User.find({email})
  if(findResult && findResult.length > 0) {
    ctx.body = {
      code: -1,
      message: '账号已存在',
      data: {}
    }
  } else {
    // 实例化数据
    const newUser = new User({
      name, email, account, password, avatar
    })
    // 存储到数据库
    await newUser.save()
    
    ctx.body = {
      code: 0,
      message: 'succuss',
      data: { ...ctx.request.body }
    }
  }
})

/**
 * @route GET appi/users/login
 * @desc 登录接口地址
 * @acsess 接口公开 
 */
router.post('/login', async ctx => {
  const { email, password } = ctx.request.body
  const user = await User.find({email, password})
  if(user && user.length > 0) {
    // 验证通过
    const payload = {
      id: user.id,
      name: user.name
    }
    const token = jwt.sign(payload, secretOrKey, { expiresIn: 3600 })
    ctx.status = 200
    ctx.body = {
      code: 0,
      token: 'Bearer ' + token,
      message: '登录成功'
    }
  } else {
    ctx.status = 200
    ctx.body = {
      code: -1,
      message: '账号不存在或密码错误'
    }
  }
})

/**
 * @route POST appi/users/current
 * @desc 获取用户信息接口地址
 * @acsess 接口私密
 */
router.post('/current', async (ctx) => {
  return passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (user) {
      const { name, email, account, avatar } = user
        ctx.body = {
          code: 0,
          data: { name, email, account, avatar }
        }
    } else {
        ctx.body = {
          code: 999
        }
    }
})(ctx)
})

module.exports = router.routes()