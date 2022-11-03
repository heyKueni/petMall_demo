const express = require('express')
const router = express.Router()

const adminRouter = require('./adminRouter')
const userRouter = require('./userRouter')

// user - controller
router.use('/user', userRouter)
// admin - controller
// router.use('/admin', adminRouter)

module.exports = router
