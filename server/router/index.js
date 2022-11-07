const express = require('express')
const router = express.Router()

// const adminRouter = require('./adminRouter')
const userAccount = require('./userRouter/userAccount')

// controller - user
router.use('/userA', userAccount)

// controller - admin
// router.use('/admin', adminRouter)

module.exports = router
