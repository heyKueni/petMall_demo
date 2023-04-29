const jwt = require('jsonwebtoken')

const cErr = require('../../config/errConfig')
const secretKey = require('../../config/tokenConfig')

const accountDao = require('../../dao/petDao/accountDao')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 检查用户宠物信息
  checkPetExist: async (req, res) => {
    const result = await accountDao.checkPetExist(req.query)
    // console.log('宠物信息', result)
    result.length
      ? res.json({
          code: 200,
          data: result,
        })
      : res.json({
          code: cErr._1061.code,
          msg: cErr._1061.msg,
        })
  },
}
