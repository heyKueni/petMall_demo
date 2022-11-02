const express = require('express')
const router = express.Router()

const adminRouter = require('./admin')
const userRouter = require('./user')

// user - controller
router.use('/user', userRouter)
// admin - controller
router.use('/admin', adminRouter)

module.exports = router
