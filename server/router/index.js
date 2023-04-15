const express = require('express')
const router = express.Router()

// const adminRouter = require('./adminRouter')
const userAccount = require('./userRouter/userAccount')
const petAccount =require('./petRouter/petAccount')
const mall = require('./mallRouter/mallRouter')

router.get('/', (req, res, next) => {
  res.render('Arlanzon服务器运行中...')
})

// controller - user
router.use('/userA', userAccount)

// controller - pet
router.use('/petA', petAccount)

// controller - mall
router.use('/mall',mall)

// controller - admin
// router.use('/admin', adminRouter)

module.exports = router
