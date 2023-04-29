// const cErr = require('../../config/errConfig')

const accountDao = require('../../dao/userDao/accountDao')
const sendMail = require('../../utils/email')
const randomStr = require('../../utils/randomStr')
const createToken = require('../../utils/createToken')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱登录注册
  loginE: async (req, res) => {
    // *--------------------------- 用户邮箱登录的请求信息 @查询 -email -codeHealth
    const codeDb = await accountDao.checkCodeExist(req.body)
    const codeRow = codeDb[codeDb.length - 1] || {
      emailCode: '',
      eCreateTime: '',
    }
    // *--------------------------- 验证码匹配 @判断 -emailCode
    const validCode = codeRow.emailCode == req.body.checkCode ? true : false
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
        if (userByEmail.length) {
          // 登录
          await accountDao.loginByEmail({
            email: req.body.email,
            loginTime: new Date(),
          })
          // codeToDeath 0
          await accountDao.codeToDeath({
            emailId: codeRow.emailId,
            codeHealth: 0,
          })
          res.json({
            code: 200,
            msg: '登陆成功',
            ...createToken(userByEmail[0]),
          })
        } else {
          // 系统注册
          await accountDao.emailRegister({
            email: req.body.email,
            loginTime: new Date(),
            name: '用户' + randomStr('userName'),
          })
          // codeToDeath 0
          await accountDao.codeToDeath({
            emailId: codeRow.emailId,
            codeHealth: 0,
          })
          res.json({
            code: 200,
            msg: '注册成功',
            ...createToken(userByEmail[0]),
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
        code: 201,
        msg: '账号或密码错误',
      })
    } else {
      if (!(userRow[0].uPassword == req.body.password)) {
        // 账号或密码错误
        res.json({
          code: 201,
          msg: '账号或密码错误',
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
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱验证码 @登录
  loginCode: async (req, res) => {
    let str = ''
    for (let i = 6; i > 0; i--) {
      str += Math.floor(Math.random() * 10)
    }
    req.body.check = str
    sendMail({
      email: req.body.email,
      check: req.body.check,
      sendType: 'login',
    })
    const result = await accountDao.loginCode(req.body)
    if (result) {
      res.json({
        code: 200,
        msg: '验证码已发送',
      })
    } else {
      res.json({
        code: 201,
        msg: '服务器响应错误',
      })
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱验证码 @注册
  registerCode: async (req, res) => {
    let str = ''
    for (let i = 6; i > 0; i--) {
      str += Math.floor(Math.random() * 10)
    }
    req.body.check = str
    sendMail({
      email: req.body.email,
      check: req.body.check,
      sendType: 'register',
    })
    const result = await accountDao.loginCode(req.body)
    if (result) {
      res.json({
        code: 200,
        msg: '验证码已发送',
      })
    } else {
      res.json({
        code: 201,
        msg: '服务器响应错误',
      })
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱验证码 @修改密码
  pwdCode: async (req, res) => {
    let str = ''
    for (let i = 6; i > 0; i--) {
      str += Math.floor(Math.random() * 10)
    }
    req.body.check = str
    sendMail({
      email: req.body.email,
      check: req.body.check,
      sendType: 'changePwd',
    })
    const result = await accountDao.loginCode(req.body)
    if (result) {
      res.json({
        code: 200,
        msg: '验证码已发送',
      })
    } else {
      res.json({
        code: 201,
        msg: '服务器响应错误',
      })
    }
  },
}
