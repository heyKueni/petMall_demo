const transporter = require('../config/emailConfig')

const receiver = {
  from: `"Arlanzon客服"<1305893731@qq.com>`,
  subject: '您的Arlanzon账户：登录验证',
}

function sendMail(payload) {
  let result = receiver
  result.to = payload.email

  result.html = `
  <br />
  <br />
  <br />
  <br />
  <h2 style="color: #383838;">${payload.email},您好！</h2>
  <h4 style="color: #9b9b9b;">
    您登录账号${payload.email}所需的 Arlanzon 令牌验证码为：
  </h4>
  <h1 style="color: #79a186; font-size: 30px;">${payload.check}</h1>
  <p style="color: #ff0000; font-size: 13px; line-height: 0;">
    验证码有效期5分钟
  </p>
  <br />
  <h4 style="color: #9b9b9b;">
    您会收到这封自动产生的邮件，是由于有人在试图通过网页或移动设备登录您的帐户。
  </h4>
  <h4 style="color: #9b9b9b;">
    没有人能够不访问这封电子邮件就访问您的帐户。
  </h4>
  <h4 style="color: #9b9b9b;">
    如果您未曾尝试登录，那么请更改您的 Arlanzon
    密码，并考虑更改您的电子邮件密码，以确保您的帐户安全。
  </h4>
  <br />
  <div
    style="
      width: calc(100% - 40px);
      padding: 12px;
      border-left: 6px solid #79a186;
      color: #79a186;
      background-color: #bcf2ce;
    "
  >
    <h4>祝您愉快，</h4>
    <h4>Arlanzon团队</h4>
  </div>
  <br />
  <br />
  <div style="font-size: 16px;">
    <p>此通知已发送至与您的 Arlanzon 帐户关联的电子邮件地址。</p>
    <p>
      这封电子邮件由系统自动生成，请勿回复。如果您需要额外帮助，请访问
      Arlanzon 客服。
    </p>
  </div>
  <br />
  `
  transporter.sendMail(result, (err, info) => {
    if (err) {
      return console.log('发送失败', err)
    }
    transporter.close()
  })
}

module.exports = sendMail
