const query = require('../../utils/dbQuery')

module.exports = {
  // 上传头像 @更改数据库图片路径地址
  avatarUpload: (data) => {
    const sql = `update user set uAvatar=? where uId=?`
    return query(sql, [data.path, data.uId])
  },
}
