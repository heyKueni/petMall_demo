const express = require('express')
const router = express.Router()

const accountCtrl = require('../../controller/petCtrl/accountCtrl')

router.get('/checkPetExist', accountCtrl.checkPetExist)

module.exports = router
