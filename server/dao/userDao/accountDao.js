const query = require('../../utils/dbQuery')

module.exports = {
  // *--------------------------- 登录 - 通过邮箱
  loginByEmail: (data) => {
    const sql = `update user set uLoginTime=? where uEmail=?`
    return query(sql, [data.loginTime, data.email])
  },
  // *--------------------------- 邮箱注册
  emailRegister: (data) => {
    const sql = `insert into user value (null,?,null,null,null,null,null,?,default,?,null,default)`
    return query(sql, [data.email, data.email, data.loginTime])
  },
  // *--------------------------- 检查邮箱存在
  checkEmailExistInUser: (data) => {
    const sql = `select * from user where uEmail=?`
    return query(sql, [data.email])
  },
  // *--------------------------- 检查验证码存在
  checkCodeExist: (data) => {
    const sql = `select * from email_code where email=? and codeHealth>0`
    return query(sql, [data.email])
  },
  // *---------------------------  验证码死亡进程
  codeToDeath: (data) => {
    const sql = `update email_code set codeHealth=? where emailId=?`
    return query(sql, [data.codeHealth, data.emailId])
  },
  // *--------------------------- 发送验证码 - 备份以供验证
  loginCode: (data) => {
    const sql = `insert into email_code value(null,?,?,default,null)`
    return query(sql, [data.email, data.check])
  },
}
