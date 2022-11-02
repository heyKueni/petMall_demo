const express = require('express')
const router = express.Router()

const accountCtrl = require('../controller/userCtrl/accountCtrl')

router.get('/test', accountCtrl.test)

module.exports = router
