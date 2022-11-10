const jwt = require('jsonwebtoken')

const secretKey = require('../config/tokenConfig')

const createToken = (data) => {
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
    userInfo: {
      uId: data.uId,
      uName: data.uName,
      uSex: data.uSex,
      uAvatar: data.uAvatar,
      uSex: data.uSex,
      uLevel: data.ulName,
      uSign: data.uSign,
    },
    token,
  }
}

module.exports = createToken
