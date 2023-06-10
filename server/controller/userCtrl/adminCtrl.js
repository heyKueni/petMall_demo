const accountDao = require('../../dao/userDao/accountDao')
// const sendMail = require('../../utils/email')
// const randomStr = require('../../utils/randomStr')
const createToken = require('../../utils/createToken')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 登录
  aLogin: async (req, res) => {
    const result = await accountDao.aLogin(req.body)
    if (result.length) {
      result[0].uId = result[0].adminId
      res.json({ code: 200, msg: '登陆成功', ...createToken(result[0]) })
    } else {
      res.json({ code: 201, msg: '账号密码错误' })
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询商品
  adminSelectCom: async (req, res) => {
    const result = await accountDao.adminSelectCom()
    res.json({ code: 200, msg: '查询成功', list: [...result] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品上架已下架
  changeGround: async (req, res) => {
    req.body.isGround = req.body.isGround ? 0 : 1
    const result = await accountDao.changeGround(req.body)
    typeof result != 'undefined'
      ? res.json({
          code: 200,
          msg: req.body.isGround ? '上架成功' : '下架成功',
        })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 添加商品
  addCom: async (req, res) => {
    const result = await accountDao.addCom(req.body)
    typeof result != 'undefined'
      ? res.json({
          code: 200,
          msg: '添加成功',
        })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 编辑商品 @查询对象
  beforeChangeCom: async (req, res) => {
    const result = await accountDao.beforeChangeCom(req.query)
    res.json({ code: 200, msg: '查询成功', data: result[0] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 编辑商品
  changeCom: async (req, res) => {
    const result = await accountDao.changeCom(req.body)
    typeof result != 'undefined'
      ? res.json({
          code: 200,
          msg: '修改成功',
        })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询帖子
  adminGetPost: async (req, res) => {
    const result = await accountDao.adminGetPost()
    res.json({ code: 200, msg: '查询成功', list: [...result] })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改帖子封禁状态
  changePostState: async (req, res) => {
    const result = await accountDao.changePostState(req.body)
    res.json({ code: 200, msg: req.body.isBanned ? '封禁成功' : '解封成功' })
  },
}
