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
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 收货地址 @查询
  selectAddress: async (req, res) => {
    let uId = req.tokenInfo.userId
    const result = await mineAndSetDao.selectAddress({
      uId,
    })
    console.log(result)
    let resList = [...result]
    resList = resList.map((item) => {
      return {
        ...item,
        tel: item.tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      }
    })
    res.json({ code: 200, msg: '查询成功', list: [...resList] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 收货地址 @删除
  delAddress: async (req, res) => {
    let uId = req.tokenInfo.userId
    let aId = req.body.aId
    const result = await mineAndSetDao.delAddress({
      uId,
      aId,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '删除成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 收货地址 @添加
  addAddress: async (req, res) => {
    let data = {
      uId: req.tokenInfo.userId,
      ...req.body,
    }
    const result = await mineAndSetDao.addAddress(data)
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '添加成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 收货地址 @查询被修改地址
  addressEditorSelect: async (req, res) => {
    const result = await mineAndSetDao.addressEditorSelect({
      uId: req.tokenInfo.userId,
      aId: req.body.aId,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '查询成功', data: result[0] })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 收货地址 @修改
  changeAddress: async (req, res) => {
    const result = await mineAndSetDao.changeAddress({
      uId: req.tokenInfo.userId,
      ...req.body,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '修改成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
}
