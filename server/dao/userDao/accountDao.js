const query = require('../../utils/dbQuery')

module.exports = {
  // *--------------------------- 轮播图
  mapSelect: () => {
    const sql = `select cImg from commodity limit 3`
    return query(sql, [])
  },
  // *--------------------------- 搜索
  searchAll: (data) => {
    data.searchValue = '%' + data.searchValue + '%'
    console.log(data.searchValue)
    const sql = `select * from commodity where cIntro_text like ?`
    return query(sql, [data.searchValue])
  },
  // *--------------------------- 检查账号存在
  checkAccountExist: (data) => {
    const sql = `select * from user as u join user_Level as ul where u.uAccount=? and u.uLevel=ul.ulId`
    return query(sql, [data.account])
  },
  // *--------------------------- 检查邮箱存在
  checkEmailExistInUser: (data) => {
    const sql = `select * from user as u join user_Level as ul where u.uEmail=? and u.uLevel=ul.ulId`
    return query(sql, [data.email])
  },
  // *--------------------------- 登录 - 通过账号
  loginByAccount: (data) => {
    const sql = `update user set uLoginTime=? where uAccount=?`
    return query(sql, [data.loginTime, data.account])
  },

  // *--------------------------- 登录 - 通过邮箱
  loginByEmail: (data) => {
    const sql = `update user set uLoginTime=? where uEmail=?`
    return query(sql, [data.loginTime, data.email])
  },
  // *--------------------------- 注册 - 通过邮箱
  emailRegister: (data) => {
    const sql = `insert into user value (null,?,null,?,null,null,null,null,?,default,?,default,default)`
    return query(sql, [data.email, data.name, data.email, data.loginTime])
  },
  // *--------------------------- 注册 - 手动注册
  register: (data) => {
    const sql = `insert into user value (null,?,?,?,null,null,null,null,?,default,?,default,default)`
    return query(sql, [
      data.account,
      data.pwd,
      data.name,
      data.email,
      data.loginTime,
    ])
  },
  // *--------------------------- 注册 - 验证码查验
  eCodeBeforeRegister: (data) => {
    const sql = `select * where email=? and codeHealth>0`
    return query(sql, [data.email])
  },
  // *--------------------------- 注册 - 账号邮箱是否存在
  checkBeforeRegister: (data) => {
    const sql = `select * from user where uAccount=? or uEmail=?`
    return query(sql, [data.account, data.email])
  },
  // *--------------------------- 发送验证码 - 备份以供验证
  loginCode: (data) => {
    const sql = `insert into email_code value(null,?,?,default,null)`
    return query(sql, [data.email, data.check])
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
  // *---------------------------  用户pinia数据更新
  userPiniaUpdate: (data) => {
    const sql = `select * from user as u join user_level as ul where u.uId=? and u.uLevel=ul.ulId`
    return query(sql, [data.uId])
  },
  // *--------------------------- 修改密码
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改密码
  changePwd: (data) => {
    const sql = `update user set uPassword=? where uId=?`
    return query(sql, [data.pwd1, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 后台管理员
  // *--------------------------- 登录
  aLogin: (data) => {
    const sql = `select * from admin where account=? and pwd=?`
    return query(sql, [data.account, data.pwd])
  },
  // *--------------------------- 查询商品
  adminSelectCom: (data) => {
    const sql = `select * from commodity c join commodity_class cc where c.cClass=cc.ccId`
    return query(sql, [])
  },
  // *--------------------------- 商品上下架
  changeGround: (data) => {
    const sql = `update commodity set isGround=? where cId=?`
    return query(sql, [data.isGround, data.cId])
  },
  // *--------------------------- 添加商品
  addCom: (data) => {
    const sql = `insert into commodity value(null,?,?,?,null,?,?,default,?,default)`
    return query(sql, [
      data.cImg,
      data.cName,
      data.cIntro_text,
      data.cCase,
      data.cPrice,
      data.cClass,
    ])
  },
  // *--------------------------- 编辑商品 @查询对象
  beforeChangeCom: (data) => {
    const sql = `select * from commodity where cId=?`
    return query(sql, [data.cId])
  },
  // *--------------------------- 编辑商品
  changeCom: (data) => {
    const sql = `update commodity set cImg=?,cName=?,cIntro_text=?,cCase=?,cPrice=?,cClass=? where cId=?`
    return query(sql, [
      data.cImg,
      data.cName,
      data.cIntro_text,
      data.cCase,
      data.cPrice,
      data.cClass,
      data.cId,
    ])
  },
  // *--------------------------- 查询帖子
  adminGetPost: (data) => {
    const sql = `select * from post p join user u where p.po_uId=u.uId`
    return query(sql, [])
  },
  // *--------------------------- 修改帖子封禁状态
  changePostState: (data) => {
    data.isBanned = data.isBanned ? 0 : 1
    console.log(data)
    const sql = `update post set isBanned=? where poId=?`
    return query(sql, [data.isBanned, data.poId])
  },
}
