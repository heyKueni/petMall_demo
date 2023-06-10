const jwt = require('jsonwebtoken')

const cErr = require('../../config/errConfig')
const secretKey = require('../../config/tokenConfig')

const accountDao = require('../../dao/petDao/accountDao')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 检查用户宠物信息
  checkPetExist: async (req, res) => {
    const result = await accountDao.checkPetExist(req.query)
    res.json({
      code: 200,
      data: result,
    })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 添加宠物
  addPet: async (req, res) => {
    const result = await accountDao.addPet({
      uId: req.tokenInfo.userId,
      ...req.body,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '添加成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 删除宠物
  delPet: async (req, res) => {
    const checkRow = await accountDao.checkPetAdopt({
      pId: req.body.pId,
    })
    if (!checkRow.length) {
      const result = await accountDao.delPet({
        uId: req.tokenInfo.userId,
        pId: req.body.pId,
      })
      typeof result != 'undefined'
        ? res.json({ code: 200, msg: '删除成功' })
        : res.json({ code: 201, msg: '服务器响应错误' })
    } else {
      res.json({ code: 201, msg: '处于领养中' })
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改宠物信息 @查询
  petEditorSelect: async (req, res) => {
    const result = await accountDao.petEditorSelect({
      uId: req.tokenInfo.userId,
      pId: req.body.pId,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '查询成功', result: { ...result[0] } })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改宠物信息 @修改
  changePet: async (req, res) => {
    const result = await accountDao.changePet({
      pOwner: req.tokenInfo.userId,
      ...req.body,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '修改成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 宠圈 @查询领养贴
  adoptSelectAll: async (req, res) => {
    const dbData = await accountDao.adoptSelectAll()
    console.log(dbData)
    res.json({ code: 200, dbData })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 宠圈 @查询领养贴 -详情
  adoptIntroSelect: async (req, res) => {
    const dbPost = await accountDao.adoptIntroSelectPost(req.query)
    const dbMessage = await accountDao.adoptIntroSelectMessage(req.query)
    console.log(dbPost[0], dbMessage)
    res.json({
      code: 200,
      msg: '查询成功',
      post: { ...dbPost[0] },
      messageList: [...dbMessage],
    })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养 @留言
  leaveWords: async (req, res) => {
    let result = null
    const daoData = {
      uId: req.tokenInfo.userId,
      ...req.body,
    }
    const checkRow = await accountDao.checkLW(daoData)
    if (checkRow.length) {
      result = await accountDao.leaveWordsUpdate(daoData)
    } else {
      result = await accountDao.leaveWordsAdd(daoData)
    }
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '留言成功' })
      : res.json({ code: 201, msg: '留言失败' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 参与领养 @查询列表
  selectMyLW: async (req, res) => {
    const list = await accountDao.selectMyLW({
      uId: req.tokenInfo.userId,
    })
    res.json({ code: 200, msg: '查询成功', list })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养 @领养关系转接
  finishAdopt: async (req, res) => {
    const reqData = {
      uId: req.tokenInfo.userId,
      targetId: req.body.uId,
      adId: req.body.adId,
      pId: req.body.pId,
    }
    // 修改adopt
    const resultA = await accountDao.finishAdoptA(reqData)
    // 修改pet
    const resultP = await accountDao.finishAdoptP(reqData)
    typeof resultA != 'undefined' && typeof resultP != 'undefined'
      ? res.json({ code: 200, msg: '领养交接完成' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养 @发布领养贴
  sendAdoptPost: async (req, res) => {
    const reqData = {
      uId: req.tokenInfo.userId,
      aTitle: req.body.aTitle,
      aIntro: req.body.aIntro,
      ad_pId: req.body.ad_pId,
      aImg: req.body.path + req.body.aImg,
    }
    console.log(reqData)
    const result = await accountDao.sendAdoptPost(reqData)
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '领养发布成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 帖子 @发布
  sendPost: async (req, res) => {
    const result = await accountDao.sendPost({
      uId: req.tokenInfo.userId,
      ...req.body,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '帖子发布成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 宠圈 @查询帖子
  postSelectAll: async (req, res) => {
    const result = await accountDao.postSelectAll()
    res.json({ code: 200, msg: '查询成功', list: [...result] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 帖子 @查询详情
  selectPostIntro: async (req, res) => {
    const resultP = await accountDao.selectPostIntroP(req.query)
    const resultC = await accountDao.selectPostIntroC(req.query)
    res.json({
      code: 200,
      msg: '查询成功',
      post: resultP[0],
      list: [...resultC],
    })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 回复
  replyPost: async (req, res) => {
    const result = await accountDao.replyPost({
      pro_uId: req.tokenInfo.userId,
      ...req.body,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '回复成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询帖子 @我的帖子
  postSelectOwner: async (req, res) => {
    const result = await accountDao.postSelectOwner({
      po_uId: req.tokenInfo.userId,
    })
    res.json({ code: 200, msg: '查询成功', list: [...result] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 检测帖子收藏状态
  checkPostCollect: async (req, res) => {
    const dbData = await accountDao.checkPostCollect({
      uId: req.tokenInfo.userId,
      ...req.query,
    })
    res.json({ code: 200, msg: '检测成功', result: dbData.length ? 1 : 0 })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改帖子收藏
  changePostCollect: async (req, res) => {
    const result = await accountDao.changePostCollect({
      uId: req.tokenInfo.userId,
      ...req.body,
    })
    typeof result != 'undefined'
      ? res.json({
          code: 200,
          msg: req.body.isCollect ? '取消收藏' : '收藏成功',
        })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 通知消息 @帖子回复
  selectMyReply: async (req, res) => {
    const result = await accountDao.selectMyReply({
      uId: req.tokenInfo.userId,
      ...req.body,
    })
    res.json({ code: 200, msg: '检测成功', list: [...result] })
  },
}
