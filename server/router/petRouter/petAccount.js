const express = require('express')
const router = express.Router()
const tokenCheck = require('../../middleware/tokenCheck')

const accountCtrl = require('../../controller/petCtrl/accountCtrl')

// 检查用户宠物信息
router.get('/checkPetExist', tokenCheck, accountCtrl.checkPetExist)

module.exports = router
