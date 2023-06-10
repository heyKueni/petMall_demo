const jwt = require('jsonwebtoken')

const { promisify } = require('util')
const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)
const decode = promisify(jwt.decode)

const cErr = require('../config/errConfig')
const secretKey = require('../config/tokenConfig')

const tokenCheck = async (req, res, next) => {
  let token = req.headers['authorization']
  try {
    // 把用户信息读取出来 挂载到req请求对象 往后继续执行
    let result = await verify(token, secretKey)
    if (result) {
      req.tokenInfo = result
      next()
    }
  } catch (error) {
    res.json({
      code: cErr._4790.code,
      msg: cErr._4790.msg,
    })
  }
}

module.exports = tokenCheck
