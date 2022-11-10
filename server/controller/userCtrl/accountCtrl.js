const jwt = require('jsonwebtoken')

const cErr = require('../../config/errConfig')
const secretKey = require('../../config/tokenConfig')

const accountDao = require('../../dao/userDao/accountDao')
const sendMail = require('../../utils/email')
const randomStr = require('../../utils/randomStr')
const createToken = require('../../utils/createToken')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱登录注册
  loginE: async (req, res) => {
    // *--------------------------- 验证码状态 验证码匹配
    validCode = false
    // *--------------------------- 验证码有效期状态
    lifespan = false
    // *--------------------------- 被验证邮箱存在
    const codeDb = await accountDao.checkCodeExist(req.body)
    let codeRow = codeDb[codeDb.length - 1] || null
    if (!codeRow) {
      // 非法验证
      res.json({
        code: cErr._1059.code,
        msg: cErr._1059.msg,
      })
    } else {
      Date.parse(new Date()) - Date.parse(codeRow.createTime) <= 300000
        ? (lifespan = true)
        : (lifespan = false)
      codeRow.emailCode == req.body.checkCode
        ? (validCode = true)
        : (validCode = false)
      if (!validCode && !lifespan) {
        // 非法验证
        res.json({
          code: cErr._1059.code,
          msg: cErr._1059.msg,
        })
      } else if (!validCode && lifespan) {
        // 验证码错误
        codeRow.codeHealth > 1
          ? res.json({
              code: cErr._1057.code,
              msg: '验证码错误，还有' + (codeRow.codeHealth - 1) + '次机会',
            })
          : res.json({
              code: cErr._1057.code,
              msg: '验证码被锁定，请重新获取',
            })
        await accountDao.codeToDeath({
          emailId: codeRow.emailId,
          codeHealth: codeRow.codeHealth - 1,
        })
      } else if (validCode && !lifespan) {
        // 验证码过期
        res.json({
          code: cErr._1058.code,
          msg: cErr._1058.msg,
        })
        await accountDao.codeToDeath({
          emailId: codeRow.emailId,
          codeHealth: 0,
        })
      } else if (validCode && lifespan) {
        // 验证码合法
        const userByEmail = await accountDao.checkEmailExistInUser(req.body)
        if (userByEmail.length) {
          // 登录
          await accountDao.loginByEmail({
            email: req.body.email,
            loginTime: new Date(),
          })
          res.json({
            code: 200,
            msg: '登陆成功',
          })
          await accountDao.codeToDeath({
            emailId: codeRow.emailId,
            codeHealth: 0,
          })
        } else {
          // 系统注册
          const result = await accountDao.emailRegister({
            email: req.body.email,
            loginTime: new Date(),
            name: '用户' + randomStr('userName'),
          })
          res.json({
            code: 203,
            msg: '注册成功',
          })
          await accountDao.codeToDeath({
            emailId: codeRow.emailId,
            codeHealth: 0,
          })
        }
      }
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 密码登录
  loginA: async (req, res) => {
    const userRow = await accountDao.checkAccountExist(req.body)
    if (!(userRow[0] && userRow[0].uPassword)) {
      // 账号或密码错误
      res.json({
        code: cErr._1060.code,
        msg: cErr._1060.msg,
      })
    } else {
      if (!(userRow[0].uPassword == req.body.password)) {
        // 账号或密码错误
        res.json({
          code: cErr._1060.code,
          msg: cErr._1060.msg,
        })
      } else {
        // 密码正确
        const result = createToken(userRow[0])
        req.body.loginTime = new Date()
        await accountDao.loginByAccount(req.body)
        res.json({
          code: 200,
          msg: '登陆成功',
          ...result,
        })
      }
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱验证码
  loginCode: async (req, res) => {
    let str = ''
    for (let i = 6; i > 0; i--) {
      str += Math.floor(Math.random() * 10)
    }
    req.body.check = str
    sendMail({
      email: req.body.email,
      check: req.body.check,
    })
    const result = await accountDao.loginCode(req.body)
    if (result) {
      res.json({
        code: 200,
      })
    }
  },
}
