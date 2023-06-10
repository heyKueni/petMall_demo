const jwt = require('jsonwebtoken')

const secretKey = require('../config/tokenConfig')

const createToken = (data) => {
  console.log(data)
  const token = jwt.sign(
    {
      userId: data.uId,
    },
    secretKey,
    {
      // 有效期：30天
      expiresIn: 60 * 60 * 24 * 30,
    },
  )
  return {
    userInfo: data,
    token,
  }
}

module.exports = createToken
