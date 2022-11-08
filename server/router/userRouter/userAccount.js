const express = require('express')
const router = express.Router()

const accountCtrl = require('../../controller/userCtrl/accountCtrl')

// 验证登录
router.post('/loginE', accountCtrl.loginE)
// 邮箱验证码
router.post('/loginCode', accountCtrl.loginCode)

module.exports = router
