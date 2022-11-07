const express = require('express')
const route = express.Router()

const accountCtrl = require('../../controller/userCtrl/accountCtrl')

// router.get('/login', accountCtrl.login)
route.get('/login', accountCtrl.login)

module.exports = route
