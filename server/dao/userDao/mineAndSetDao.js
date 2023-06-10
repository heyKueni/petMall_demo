const query = require('../../utils/dbQuery')

module.exports = {
  // 我的收藏 @查询-商品
  collectComRes: (data) => {
    const sql_collect = `select * from collection_com where uId=?`
    const sql = `select * from (${sql_collect}) as sc join commodity as c where sc.cId=c.cId`
    return query(sql, [data.uId])
  },
  // 我的收藏 @查询-帖子
  collectPostRes: (data) => {
    const sql_collect = `select * from collection_com where uId=?`
    const sql = `select * from (${sql_collect}) as sc join commodity as c where sc.cId=c.cId`
    return query(sql, [data.uId])
  },
  // 查询帖子收藏
  collectPostSelect: (data) => {
    const sql_collect = `select cp.collectPId,cp.poId,cp.uId,p.poTitle,p.poCreateTime from collection_post cp join post p where cp.poId=p.poId`
    const sql = `select * from (${sql_collect}) sss join user u where sss.uId=u.uId and sss.uId=?`
    return query(sql, [data.uId])
  },
  // 我的收藏 @删除-商品
  delCollectCom: (data) => {
    const sql = `delete from collection_com where collectCId=? and uId=?`
    return query(sql, [data.collectCId, data.uId])
  },
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
    const sql = `select aId,receiver,tel,address from user_address where aWhoes=?`
    return query(sql, [data.uId])
  },
  // 删除地址
  delAddress: (data) => {
    const sql = `delete from user_address where aWhoes=? and aId=?`
    return query(sql, [data.uId, data.aId])
  },
  // 添加地址
  addAddress: (data) => {
    const sql = `insert into user_address value(null,?,?,?,null,?)`
    return query(sql, [data.receiver, data.tel, data.address, data.uId])
  },
  // 查询被修改地址
  addressEditorSelect: (data) => {
    const sql = `select receiver,tel,address from user_address where aWhoes=? and aId=?`
    return query(sql, [data.uId, data.aId])
  },
  // 修改地址
  changeAddress: (data) => {
    console.log(data)
    const sql = `update user_address set receiver=?,tel=?,address=? where aWhoes=? and aId=?`
    return query(sql, [
      data.receiver,
      data.tel,
      data.address,
      data.uId,
      data.aId,
    ])
  },
}
