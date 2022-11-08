const userADao = require('../../dao/userDao/accountDao')
const sendMail = require('../../utils/email')
const cErr = require('../../config/errConfig')
const { emailRegister } = require('../../dao/userDao/accountDao')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 邮箱登录注册
  loginE: async (req, res) => {
    // 验证码状态 验证码匹配
    validCode = false
    // 验证码有效期状态
    lifespan = false
    const codeDb = await userADao.checkCodeExist(req.body)
    let codeRow = codeDb[codeDb.length - 1] || null
    // 被验证邮箱存在
    if (codeRow) {
      console.log(codeRow)
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
            code: 200,
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
