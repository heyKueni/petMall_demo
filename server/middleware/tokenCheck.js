const jwt = require('jsonwebtoken')

const { promisify } = require('util')
const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)
const decode = promisify(jwt.decode)

const cErr = require('../config/errConfig')
const secretKey = require('../config/tokenConfig')

const tokenCheck = async (req, res, next) => {
  let token = req.headers['authorization']

  if (!token) {
    // return res.status(401).end()
    console.log(111)
    res.json({
      code: cErr._4790.code,
      msg: cErr._4790.msg,
    })
  }

  try {
    // 把用户信息读取出来 挂载到req请求对象 往后继续执行
    req.tokenInfo = await verify(token, secretKey)
    console.log('tokenInfo', req.tokenInfo)
    next()
  } catch (error) {
    // return res.status(401).end()
    console.log(222)
    res.json({
      code: cErr._4790.code,
      msg: cErr._4790.msg,
    })
  }
}

module.exports = tokenCheck
