const express = require('express')
const router = express.Router()

const tokenCheck = require('../../middleware/tokenCheck')

const mallCtrl = require('../../controller/mallCtrl/mallCtrl')

// ?+++++++++++++++++++++++++++++++++++++++++++++++ accountCtrl
// 市集 @查询 商品分类
router.get('/selectClassify', mallCtrl.selectClassify)
// 市集 @查询 分类下的商品
router.post('/selectCommodity',mallCtrl.selectCommodity)

module.exports = router
