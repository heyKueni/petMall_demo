const nodemailer = require('nodemailer')

//创建一个SMTP客户端配置对象
const transporter = nodemailer.createTransport({
  service: 'QQ',
  auth: {
    user: '1305893731@qq.com',
    //发件人邮箱的授权码 需要在自己的邮箱设置中生成,并不是邮件的登录密码
    pass: 'jwgrvkwdvltxfjii',
  },
})

module.exports = transporter
