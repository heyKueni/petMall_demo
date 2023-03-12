const express = require('express')
const router = express.Router()

const tokenCheck = require('../../middleware/tokenCheck')
const { multerAvatar } = require('../../middleware/multerCheck')

const accountCtrl = require('../../controller/userCtrl/accountCtrl')
const mineAndSetCtrl = require('../../controller/userCtrl/mineAndSetCtrl')

// ?+++++++++++++++++++++++++++++++++++++++++++++++ accountCtrl
// 邮箱登录注册
router.post('/loginE', accountCtrl.loginE)
// 邮箱验证码
router.post('/loginCode', accountCtrl.loginCode)
// 密码登录
router.post('/loginA', accountCtrl.loginA)

// ?+++++++++++++++++++++++++++++++++++++++++++++++ mineAndSetCtrl
// 修改头像
router.post(
  '/avatarChange',
  tokenCheck,
  multerAvatar,
  mineAndSetCtrl.avatarChange,
)

module.exports = router
