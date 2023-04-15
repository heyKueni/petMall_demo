const query = require('../../utils/dbQuery')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品分类 @查询
  selectClassify: () => {
    const sql = `select * from commodity_class`
    return query(sql, [])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 分类下的商品 @查询
  selectCommodity: (data) => {
    const sql = `select cId,cName,cImg from commodity where cClass=?`
    return query(sql, [data.ccId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 单个商品 @查询
  selectOneCom: (data) => {
    const sql = `select * from commodity where cId=?`
    return query(sql, [data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品收藏 @查询
  selectCollectList: (data) => {
    const sql = `select * from collection_com where uId=? and cId=?`
    return query(sql, [data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品收藏 @添加
  addCollection: (data) => {
    const sql = `insert into collection_com value(null,?,?)`
    return query(sql, [data.cId, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品收藏 @删除
  delCollection: (data) => {
    const sql = `delete from collection_com where uId=? and cId=?`
    return query(sql, [data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @查询
  selectCart: (data) => {
    const sql = `select * from cart where uId=? and cId=?`
    return query(sql, [data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @数量+1
  addComNumInCart: (data) => {
    const sql = `update cart set num=? where uId=? and cId=?`
    return query(sql, [data.num, data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @添加新商品
  addComInCart: (data) => {
    const sql = `insert into cart value(null,?,?,?)`
    return query(sql, [data.num, data.cId, data.uId])
  },
}
