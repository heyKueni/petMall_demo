const express = require('express')
const router = express.Router()

const tokenCheck = require('../../middleware/tokenCheck')

const mallCtrl = require('../../controller/mallCtrl/mallCtrl')

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

module.exports = router
