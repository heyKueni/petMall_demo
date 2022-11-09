const userADao = require('../../dao/userDao/accountDao')
const sendMail = require('../../utils/email')
const cErr = require('../../config/errConfig')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱登录注册
  loginE: async (req, res) => {
    // *--------------------------- 验证码状态 验证码匹配
    validCode = false
    // *--------------------------- 验证码有效期状态
    lifespan = false
    // *--------------------------- 被验证邮箱存在
    const codeDb = await userADao.checkCodeExist(req.body)
    let codeRow = codeDb[codeDb.length - 1] || null
    if (codeRow) {
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
        await userADao.codeToDeath({
          emailId: codeRow.emailId,
          codeHealth: codeRow.codeHealth - 1,
        })
      } else if (validCode && !lifespan) {
        // 验证码过期
        res.json({
          code: cErr._1058.code,
          msg: cErr._1058.msg,
        })
        await userADao.codeToDeath({
          emailId: codeRow.emailId,
          codeHealth: 0,
        })
      } else if (validCode && lifespan) {
        // 验证码合法
        const userByEmail = await userADao.checkEmailExistInUser(req.body)
        if (userByEmail.length) {
          // 登录
          await userADao.loginByEmail({
            email: req.body.email,
            loginTime: new Date(),
          })
          res.json({
            code: 200,
            msg: '登陆成功',
          })
          await userADao.codeToDeath({
            emailId: codeRow.emailId,
            codeHealth: 0,
          })
        } else {
          // 系统注册
          await userADao.emailRegister({
            email: req.body.email,
            loginTime: new Date(),
          })
          res.json({
            code: 203,
            msg: '注册成功',
          })
          await userADao.codeToDeath({
            emailId: codeRow.emailId,
            codeHealth: 0,
          })
        }
      }
    } else {
      // 非法验证
      res.json({
        code: cErr._1059.code,
        msg: cErr._1059.msg,
      })
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 密码登录
  loginA: async (req, res) => {
    const userRow = await userADao.loginByAccount(req.body)
    if (userRow[0] && userRow[0].uPassword) {
      userRow[0].uPassword == req.body.password
        ? res.json({
            code: 200,
            msg: '登陆成功',
            data: {
              uId: userRow[0].uId,
              token: '???????????????????????????',
            },
          })
        : res.json({
            code: cErr._1060.code,
            msg: cErr._1060.msg,
          })
    } else {
      // 数据库密码为空 - 非法登录
      res.json({
        code: cErr._1060.code,
        msg: cErr._1060.msg,
      })
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
    const result = await userADao.loginCode(req.body)
    if (result) {
      res.json({
        code: 200,
      })
    }
  },
}
