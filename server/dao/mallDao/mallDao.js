const query = require('../../utils/dbQuery')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品分类 @查询
  selectClassify: (data) => {
    const sql = `select * from commodity_class`
    return query(sql, [])
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 分类下的商品 @查询
  selectCommodity: (data) => {
    const sql = `select cId,cName,cImg from commodity where cClass=?`
    return query(sql, [data.ccId])
  },
}
