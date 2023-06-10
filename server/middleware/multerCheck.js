const path = require('path')
const multer = require('multer')

const multerAvatar = async (req, res, next) => {
  let filename = ''
  //   图片上传配置信息
  let storage = multer.diskStorage({
    // 文件存储路径
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images/avatar'))
    },
    // 文件存储名称
    filename: (req, file, cb) => {
      let extname = path.extname(file.originalname)
      filename = file.fieldname + '-' + Date.now() + extname
      cb(null, filename)
    },
  })
  let upload = multer({ storage }).single('avatar')
  upload(req, res, (err) => {
    // console.log('filename', filename)
    if (err instanceof multer.MulterError) {
      // 捕获multer错误
      res.send('multerErr:' + err)
    } else if (err) {
      // 捕获express错误
      res.send('err:' + err)
    } else {
      req.body.avatar = filename
      req.body.path = 'http://localhost:3060/images/avatar/'
      next()
    }
  })
}

const multerAdopt = async (req, res, next) => {
  let filename = ''
  //   图片上传配置信息
  let storage = multer.diskStorage({
    // 文件存储路径
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images/adoptPicture'))
    },
    // 文件存储名称
    filename: (req, file, cb) => {
      let extname = path.extname(file.originalname)
      filename = file.fieldname + '-' + Date.now() + extname
      cb(null, filename)
    },
  })
  let upload = multer({ storage }).single('adopt')
  upload(req, res, (err) => {
    console.log(err)
    if (err instanceof multer.MulterError) {
      // 捕获multer错误
      res.send('multerErr:' + err)
    } else if (err) {
      // 捕获express错误
      res.send('err:' + err)
    } else {
      req.body.aImg = filename
      req.body.path = 'http://localhost:3060/images/adoptPicture/'
      next()
    }
  })
}

module.exports = {
  multerAvatar,
  multerAdopt,
}
