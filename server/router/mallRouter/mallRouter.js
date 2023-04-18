const express = require('express')
const router = express.Router()

const tokenCheck = require('../../middleware/tokenCheck')

const mallCtrl = require('../../controller/mallCtrl/mallCtrl')
const { token } = require('morgan')
const mallDao = require('../../dao/mallDao/mallDao')

// ?+++++++++++++++++++++++++++++++++++++++++++++++ accountCtrl
// 市集 @查询 商品分类
router.get('/selectClassify', mallCtrl.selectClassify)
// 市集 @查询 分类下的商品
router.post('/selectCommodity', mallCtrl.selectCommodity)
// 市集 @查询 商品详情
router.get('/comIntroSelect', mallCtrl.comIntroSelect)
// 商品详情页 @查询 收藏判定
router.get('/isCollect', tokenCheck, mallCtrl.isCollect)
// 商品详情页 @添加or删除 商品收藏
router.post('/collect', tokenCheck, mallCtrl.collect)
// 商品详情页 @添加到购物车
router.post('/addToCart', tokenCheck, mallCtrl.addToCart)
// 商品详情页 @立即购买
router.post('/payNow', tokenCheck, mallCtrl.payNow)
// 购物车 @查询
router.get('/selectCartAll', tokenCheck, mallCtrl.selectCartAll)
// 购物车 @修改数量
router.post('/numChange', tokenCheck, mallCtrl.numChange)
// 购物车 @删除商品
router.post('/delCartCom', tokenCheck, mallCtrl.delCartCom)
// 购物车 @去结算
router.post('/toPayFromCart', tokenCheck, mallCtrl.toPayFromCart)
// 支付订单 @查询当前订单
router.post('/SelectOrderOne', tokenCheck, mallCtrl.SelectOrderOne)
// 支付订单 @提交订单
router.post('/submitOrder', tokenCheck, mallCtrl.submitOrder)
// 我的订单 @查询已支付订单
router.get('/orderRes_1', tokenCheck, mallCtrl.orderRes_1)
// 我的订单 @查询未支付订单
router.get('/orderRes_0', tokenCheck, mallCtrl.orderRes_0)
// 我的订单 @查询订单详情
router.get('/selectOrderIntro', tokenCheck, mallCtrl.selectOrderIntro)
// 我的订单 @删除未支付订单
router.post('/delOrder_0', tokenCheck, mallCtrl.delOrder_0)

module.exports = router
