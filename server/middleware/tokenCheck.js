const jwt = require('jsonwebtoken')

const { promisify } = require('util')
const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)
const decode = promisify(jwt.decode)

const cErr = require('../config/errConfig')
const secretKey = require('../config/tokenConfig')

const tokenCheck = async (req, res, next) => {
  let token = req.headers['authorization']
  console.log(token)

  if (!token) {
    return res.status(cErr._4790.code).end()
  }

  try {
    // 把用户信息读取出来 挂载到req请求对象 往后继续执行
    req.tokenInfo = await verify(token, secretKey)
    console.log(req.tokenInfo)
    next()
  } catch (error) {
    return res.status(cErr._4790.code).end()
  }
}

module.exports = tokenCheck
