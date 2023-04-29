const express = require('express')
const router = express.Router()

const tokenCheck = require('../../middleware/tokenCheck')
const { multerAvatar } = require('../../middleware/multerCheck')

const accountCtrl = require('../../controller/userCtrl/accountCtrl')
const mineAndSetCtrl = require('../../controller/userCtrl/mineAndSetCtrl')

// ?+++++++++++++++++++++++++++++++++++++++++++++++ accountCtrl
// 邮箱登录注册
router.post('/loginE', accountCtrl.loginE)
// 密码登录
router.post('/loginA', accountCtrl.loginA)
// 邮箱验证码 @登录
router.post('/loginCode', accountCtrl.loginCode)
// 邮箱验证码 @注册
router.post('/registerCode', accountCtrl.registerCode)
// 邮箱验证码 @修改密码
router.post('/registerCode', accountCtrl.pwdCode)

// ?+++++++++++++++++++++++++++++++++++++++++++++++ mineAndSetCtrl
// *--------------------------- COLLECTION
// 我的收藏 @查询
router.get('/collectRes', tokenCheck, mineAndSetCtrl.collectRes)
// 我的收藏 @删除
router.post('/delCollectCom', tokenCheck, mineAndSetCtrl.delCollectCom)
// *--------------------------- SET
// 修改头像
router.post(
  '/avatarChange',
  tokenCheck,
  multerAvatar,
  mineAndSetCtrl.avatarChange,
)
// 修改昵称
router.post('/changeName', tokenCheck, mineAndSetCtrl.changeName)
// 修改签名
router.post('/changeSign', tokenCheck, mineAndSetCtrl.changeSign)
// 收货地址 @查询
router.get('/selectAddress', tokenCheck, mineAndSetCtrl.selectAddress)
// 收货地址 @查询单个
router.get('/selectAddressOne', tokenCheck, mineAndSetCtrl.selectAddressOne)
// 收货地址 @删除
router.post('/delAddress', tokenCheck, mineAndSetCtrl.delAddress)
// 收货地址 @添加
router.post('/addAddress', tokenCheck, mineAndSetCtrl.addAddress)
// 收货地址 @查询被修改地址
router.post(
  '/addressEditorSelect',
  tokenCheck,
  mineAndSetCtrl.addressEditorSelect,
)
// 收货地址 @修改
router.post('/changeAddress', tokenCheck, mineAndSetCtrl.changeAddress)

module.exports = router
