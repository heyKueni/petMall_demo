const query = require('../../utils/dbQuery')

module.exports = {
  // 上传头像 @更改数据库图片路径地址
  avatarUpload: (data) => {
    const sql = `update user set uAvatar=? where uId=?`
    return query(sql, [data.path, data.uId])
  },
  // 修改昵称
  changeName: (data) => {
    const sql = `update user set uName=? where uId=?`
    return query(sql, [data.name, data.uId])
  },
  // 修改签名
  changeSign: (data) => {
    const sql = `update user set uSign=? where uId=?`
    return query(sql, [data.sign, data.uId])
  },
  // 查询地址
  selectAddress: (data) => {
    const sql = `select aId,receiver,tel,address from user as u,user_address as ua where u.uId=ua.aWhoes and u.uId=?`
    return query(sql, [data.uId])
  },
  delAddress: (data) => {
    const sql = `delete from user_address wheres aWhoes=? and aId=?`
    return query(sql, [data.uId, data.aId])
  },
}
