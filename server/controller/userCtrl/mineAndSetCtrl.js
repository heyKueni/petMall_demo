const cErr = require('../../config/errConfig')

const accountDao = require('../../dao/userDao/accountDao')
const mineAndSetDao = require('../../dao/userDao/mineAndSetDao')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改头像
  avatarChange: async (req, res) => {
    let uId = req.tokenInfo.userId
    let path = req.body.path + req.body.avatar
    await mineAndSetDao.avatarUpload({
      path,
      uId,
    })
    const result = await accountDao.userPiniaUpdate({ uId })
    res.json({ code: 200, msg: '修改成功', info: { ...result[0] } })
  },
}
