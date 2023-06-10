const query = require('../../utils/dbQuery')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询宠物信息 @全部
  checkPetExist: (data) => {
    const sql = `select * from pet as p join pet_type as pt on p.pOwner=? and p.pType=pt.ptId and p.p_isDel=0`
    return query(sql, [data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 添加宠物
  addPet: (data) => {
    const sql = `insert into pet value(null,?,?,?,?,null,?,?,default)`
    return query(sql, [
      data.pName,
      data.pBirth,
      data.pBear,
      data.pSex,
      data.uId,
      data.pType,
    ])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 删除宠物
  delPet: (data) => {
    const sql = `update pet set p_isDel=1 where pOwner=? and pId=?`
    return query(sql, [data.uId, data.pId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 删除宠物 @检测未结束领养贴是否存在该宠物
  checkPetAdopt: (data) => {
    const sql = `select * from adopt where isAdopted=0 and ad_pId=?`
    return query(sql, [data.pId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改宠物信息 @查询
  petEditorSelect: (data) => {
    const sql = `select * from pet where pId=? and pOwner=? and p_isDel=0`
    return query(sql, [data.pId, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改宠物信息 @修改
  changePet: (data) => {
    const sql = `update pet set pName=?,pBirth=?,pBear=?,pSex=?,pType=? where pId=? and pOwner=? and p_isDel=0`
    return query(sql, [
      data.pName,
      data.pBirth,
      data.pBear,
      data.pSex,
      data.pType,
      data.pId,
      data.pOwner,
    ])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 宠圈 @查询领养贴
  adoptSelectAll: (data) => {
    const sql = `select * from adopt a left join user u on a.uId=u.uId and isAdopted=0 left join (select sum(amId) as cNum,aa.uId from adopt_message am join adopt aa where am.am_adId=aa.adId) amm on amm.uId=a.uId`
    return query(sql, [])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养贴详情 @查询帖子
  adoptIntroSelectPost: (data) => {
    const sql = `select * from adopt a left join user u on a.uId=u.uId and a.adId=? left join pet p on p.pId=a.ad_pId left join pet_type pt on pt.ptId=p.pType`
    return query(sql, [data.adId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养贴详情 @查询留言
  adoptIntroSelectMessage: (data) => {
    const sql = `select * from adopt_message am left join user u on am.uId=u.uId and am.am_adId=?`
    return query(sql, [data.adId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养 @留言 -检测是否已留言
  checkLW: (data) => {
    const sql = `select * from adopt_message where uId=? and am_adId=?`
    return query(sql, [data.uId, data.am_adId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养 @添加留言
  leaveWordsAdd: (data) => {
    const sql = `insert into adopt_message value(null,?,?,default,?,?)`
    return query(sql, [data.amContent, data.amTel, data.uId, data.am_adId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养 @修改留言
  leaveWordsUpdate: (data) => {
    const sql = `update adopt_message set amContent=?,amTel=? where uId=? and am_adId=?`
    return query(sql, [data.amContent, data.amTel, data.uId, data.am_adId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 参与领养 @查询列表
  selectMyLW: (data) => {
    const sql = `select * from adopt_message am left join adopt a on am.am_adId=a.adId and am.uId=? left join user u on u.uId=a.uId`
    return query(sql, [data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养关系转接 @修改adopt
  finishAdoptA: (data) => {
    const sql = `update adopt set isAdopted=? where uId=? and adId=?`
    return query(sql, [data.targetId, data.uId, data.adId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 领养关系转接 @修改pet
  finishAdoptP: (data) => {
    const sql = `update pet set pOwner=? where pId=? and pOwner=?`
    return query(sql, [data.targetId, data.pId, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 发布领养贴
  sendAdoptPost: (data) => {
    const sql = `insert into adopt value(null,?,?,?,default,?,default,?)`
    return query(sql, [
      data.aTitle,
      data.aImg,
      data.aIntro,
      data.uId,
      data.ad_pId,
    ])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 发布帖子
  sendPost: (data) => {
    const sql = `insert into post value(null,?,?,default,default,?)`
    return query(sql, [data.title, data.content, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询帖子 @全部
  postSelectAll: () => {
    const sql = `select * from post p join user u where p.po_uId=u.uId and p.isBanned=0`
    return query(sql, [])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询帖子详情 @Post
  selectPostIntroP: (data) => {
    const sql = `select * from post p join user u where p.po_uId=u.uId and p.poId=?`
    return query(sql, [data.poId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询帖子详情 @Comment
  selectPostIntroC: (data) => {
    const cInPost = `select * from post p join post_reply pr where p.poId=? and p.poId=pr.pro_poId`
    const sql = `select * from (${cInPost}) cp join user u where cp.pro_uId=u.uId`
    return query(sql, [data.poId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 回复
  replyPost: (data) => {
    console.log(data)
    const check = data.pro_reply ? true : false
    const arr = check
      ? [
          data.proContent,
          data.pro_uId,
          data.pro_poId,
          data.pro_reply,
          data.pro_reply_name,
        ]
      : [data.proContent, data.pro_uId, data.pro_poId]
    const sql = check
      ? `insert into post_reply value(null,?,default,?,?,?,?)`
      : `insert into post_reply value(null,?,default,?,?,null,null)`
    console.log(arr)
    return query(sql, arr)
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询帖子 @我的帖子
  postSelectOwner: (data) => {
    const sql = `select * from post p join user u where p.po_uId=u.uId and p.po_uId=? and p.isBanned=0`
    return query(sql, [data.po_uId])
  },
  // 检测帖子收藏状态
  checkPostCollect: (data) => {
    const sql = `select * from collection_post where poId=? and uId=?`
    return query(sql, [data.poId, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 修改帖子收藏
  changePostCollect: (data) => {
    if (data.isCollect) {
      // 删除收藏
      const sql = `delete from collection_post where uId=? and poId=?`
      return query(sql, [data.uId, data.poId])
    } else {
      // 添加收藏
      const sql = `insert into collection_post value(null,?,?)`
      return query(sql, [data.poId, data.uId])
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 通知消息 @帖子回复
  selectMyReply: (data) => {
    const sql = `select * from post_reply pm join user u where pm.pro_reply_name=? and pm.pro_uId=u.uId`
    return query(sql, [data.pro_reply_name])
  },
}
