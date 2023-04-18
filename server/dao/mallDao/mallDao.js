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
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @查询 单个
  selectCart: (data) => {
    const sql = `select * from cart where uId=? and cId=?`
    return query(sql, [data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @查询 所有
  selectCartAll: (data) => {
    const sql_commodity = `select ca.cId,cImg,cIntro_text,cPrice,cClass,num from commodity as co join cart as ca where co.cId=ca.cId and ca.uId=?`
    const sql_commodity_class = `select cId,cImg,cIntro_text,cPrice,ccName,num from (${sql_commodity}) as sc join commodity_class as cc where sc.cClass=cc.ccId`
    return query(sql_commodity_class, [data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @数量+1
  addComNumInCart: (data) => {
    const sql = `update cart set num=? where uId=? and cId=?`
    return query(sql, [data.num, data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @数量修改
  numChange: (data) => {
    const sql = `update cart set num=? where uId=? and cId=?`
    return query(sql, [data.num, data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @添加新商品
  addComInCart: (data) => {
    const sql = `insert into cart value(null,?,?,?)`
    return query(sql, [data.num, data.cId, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @删除商品
  delCartCom: (data) => {
    const sql = `delete from cart where uId=? and cId=?`
    return query(sql, [data.uId, data.cId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @添加订单-未支付
  // *--------------------------- 添加大订单
  addNoPayedOrder: (data) => {
    const sql = `insert into order_out value(?,null,null,null,?,?,default,?)`
    return query(sql, [data.ooId, data.allCost, data.timeData, data.uId])
  },
  // *--------------------------- 添加小订单
  addOrderIn: (data) => {
    const sql = `insert into order_in value(null,?,?,?)`
    return query(sql, [data.num, data.cId, data.ooId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 支付订单 @查询当前订单
  SelectOrderOne: (data) => {
    const sql_order_select = `oi.cId,oi.num,oo.ooId,oo.allCost,oo.ooCreateTime`
    const sql_order_where = `oi.ooId=oo.ooId and oi.ooId=? and oo.uId=? and oo.isPayed=0`
    const sql_order = `select ${sql_order_select} from order_in as oi join order_out as oo where ${sql_order_where}`
    const sql = `select * from (${sql_order}) as so join commodity as c where so.cId=c.cId`
    return query(sql, [data.ooId, data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 支付订单 @提交订单
  submitOrder: (data) => {
    const sql = `update order_out set receiver=?,tel=?,address=?,ooCreateTime=?,isPayed=? where uId=? and ooId=?`
    return query(sql, [
      data.receiver,
      data.tel,
      data.address,
      data.ooCreateTime,
      data.isPayed,
      data.uId,
      data.ooId,
    ])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询订单 @已支付
  selectOrder_1: (data) => {
    const selectRes = `so.ooId,so.receiver,so.tel,so.address,so.allCost,so.ooCreateTime,so.isPayed,oi.num,oi.cId,oi.oiId`
    const sql_o = `select * from order_out where uId=? and isPayed=1`
    const sql_i = `select ${selectRes} from (${sql_o}) as so join order_in as oi where so.ooId=oi.ooId`
    const sql = `select * from (${sql_i}) as si join commodity as c where si.cId = c.cId`
    return query(sql, [data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 查询订单 @未支付
  orderRes_0: (data) => {
    const sql_order = `select oo.ooId,oi.cId,oi.oiId,oi.num from order_out as oo join order_in as oi where uId=? and isPayed=0 and oo.ooId=oi.ooId`
    const sql = `select c.cId,c.cIntro_text,c.cImg,c.cPrice,x.ooId,x.oiId,x.num from (${sql_order}) as x join commodity as c where x.cId=c.cId`
    return query(sql, [data.uId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 我的订单 @查询订单详情
  selectOrderIntro: (data) => {
    const sql_order = `select oo.ooId,oo.receiver,oo.tel,oo.address,oo.ooCreateTime,oi.oiId,oi.num,oi.cId from order_out as oo join order_in as oi where oi.oiId=? and oi.ooId=oo.ooId`
    const sql = `select * from (${sql_order}) as x join commodity as c where x.cId=c.cId`
    return query(sql, [data.oiId])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 删除订单 @未支付
  delOrder_0: (data) => {
    const sql = `delete from order_out where uId=? and ooId=?`
    return query(sql, [data.uId, data.ooId])
  },
}
