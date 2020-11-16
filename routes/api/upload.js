const { apiUrl } = require('../../config/keys')
const Router = require('koa-router')
const router = new Router()

/**
 * @route POST appi/users/test
 * @desc 无登录上传接口地址
 * @acsess 接口公开 
 */
router.post('/minus', async ctx => {
  const { file : { size, path, name, type }} = ctx.request.files;
  const url = path.match(/upload_.+/g)[0]
  ctx.body = {
    size, url: `${apiUrl}upload/${url}`, name
  }
})

module.exports = router.routes()