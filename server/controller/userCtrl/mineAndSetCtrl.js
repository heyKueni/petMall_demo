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
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改昵称
  changeName: async (req, res) => {
    let uId = req.tokenInfo.userId
    let name = req.body.name
    await mineAndSetDao.changeName({
      uId,
      name,
    })
    const result = await accountDao.userPiniaUpdate({ uId })
    res.json({ code: 200, msg: '修改成功', info: { ...result[0] } })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改签名
  changeSign: async (req, res) => {
    let uId = req.tokenInfo.userId
    let sign = req.body.sign
    await mineAndSetDao.changeSign({
      uId,
      sign,
    })
    const result = await accountDao.userPiniaUpdate({ uId })
    res.json({ code: 200, msg: '修改成功', info: { ...result[0] } })
  },
}
