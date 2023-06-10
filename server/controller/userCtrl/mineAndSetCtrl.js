const accountDao = require('../../dao/userDao/accountDao')
const mineAndSetDao = require('../../dao/userDao/mineAndSetDao')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 我的收藏 @查询
  collectRes: async (req, res) => {
    let data = { uId: req.tokenInfo.userId, current: req.query.current }
    const result = data.current
      ? await mineAndSetDao.collectPostRes(data)
      : await mineAndSetDao.collectComRes(data)
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '修改成功', result })
      : res.json({ code: 201, msg: '服务器响应失败' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 我的收藏 @查询 -帖子
  collectPostSelect: async (req, res) => {
    const dbData = await mineAndSetDao.collectPostSelect({
      uId: req.tokenInfo.userId,
    })
    res.json({ code: 200, msg: '查询成功', result: [...dbData] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 我的收藏 @删除
  delCollectCom: async (req, res) => {
    const result = await mineAndSetDao.delCollectCom({
      uId: req.tokenInfo.userId,
      collectCId: req.body.collectCId,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '删除成功' })
      : res.json({ code: 201, msg: '服务器响应失败' })
  },
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
    let resList = [...result]
    resList = resList.map((item) => {
      return {
        ...item,
        tel: item.tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      }
    })
    res.json({ code: 200, msg: '查询成功', list: [...resList] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 收货地址 @查询单个
  selectAddressOne: async (req, res) => {
    let uId = req.tokenInfo.userId
    let addressOne = null
    const result = await mineAndSetDao.selectAddress({
      uId,
    })
    if (result.length) {
      addressOne = result[0]
      addressOne.tel = addressOne.tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    } else {
      addressOne = undefined
    }
    res.json({ code: 200, msg: '查询成功', addressOne })
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
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改密码
  changePwd: async (req, res) => {
    // *--------------------------- 用户邮箱登录的请求信息 @查询 -email -codeHealth
    const codeDb = await accountDao.checkCodeExist(req.body)
    const codeRow = codeDb[codeDb.length - 1] || {
      emailCode: '',
      eCreateTime: '',
    }
    // *--------------------------- 验证码匹配 @判断 -emailCode
    console.log(codeRow.emailCode)
    const validCode = codeRow.emailCode == req.body.emailCode ? true : false
    // *--------------------------- 验证码有效期 @判断 -codeHealth
    lifespan =
      Date.parse(new Date()) - Date.parse(codeRow.eCreateTime) <= 300000
        ? true
        : false
    // *--------------------------- 分支判断
    if (!codeRow || (!validCode && !lifespan)) {
      // 非法验证
      res.json({ code: 201, msg: '验证码错误' })
    } else {
      if (!validCode && lifespan) {
        // 验证码错误，但并未锁定
        codeRow.codeHealth > 1
          ? res.json({
              code: 201,
              msg: '验证码错误',
            })
          : res.json({
              code: 202,
              msg: '验证码失效，请重新获取',
            })
        // codeToDeath -1
        await accountDao.codeToDeath({
          emailId: codeRow.emailId,
          codeHealth: codeRow.codeHealth - 1,
        })
      } else if (validCode && !lifespan) {
        // 验证码过期
        res.json({
          code: '203',
          msg: '验证码已过期，请重新获取',
        })
        // codeToDeath 0
        await accountDao.codeToDeath({
          emailId: codeRow.emailId,
          codeHealth: 0,
        })
      } else if (validCode && lifespan) {
        // 验证码合法
        const userByEmail = await accountDao.checkEmailExistInUser(req.body)
        console.log(userByEmail)
        if (userByEmail.length) {
          const ccccc = await accountDao.changePwd({
            uId: userByEmail[0].uId,
            ...req.body,
          })
          typeof ccccc != 'undefined'
            ? res.json({ code: 200, msg: '修改成功' })
            : res.json({ code: 201, msg: '服务器响应错误' })
        } else {
          res.json({ code: 201, msg: '填写信息有误' })
        }
      }
    }
  },
}
