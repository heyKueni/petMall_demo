const mallDao = require('../../dao/mallDao/mallDao')

module.exports = {
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 市集 @查询 商品分类
  selectClassify: async (req, res) => {
    const result = await mallDao.selectClassify()
    result.length != 0
      ? res.json({
          code: 200,
          msg: '查询成功',
          result,
        })
      : res.json({
          code: 201,
          msg: '服务器响应错误',
        })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 市集 @查询 分类下商品
  selectCommodity: async (req, res) => {
    const classifyList = await mallDao.selectClassify()
    const result = await mallDao.selectCommodity({
      ccId: classifyList[req.body.current].ccId,
    })
    result.length != 0
      ? res.json({
          code: 200,
          msg: '查询成功',
          result,
        })
      : res.json({
          code: 201,
          msg: '服务器响应错误',
        })
  },
}
