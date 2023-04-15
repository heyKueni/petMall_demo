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
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 市集 @查询 商品详情页
  comIntroSelect: async (req, res) => {
    const result = await mallDao.selectOneCom({
      cId: req.query.cId,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '查询成功', result: result[0] })
      : res.json({
          code: 201,
          msg: '服务器响应错误',
        })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品详情页 @查询 分类下商品 收藏判定
  isCollect: async (req, res) => {
    const collectionList = await mallDao.selectCollectList({
      uId: req.tokenInfo.userId,
      cId: req.query.cId,
    })
    if (collectionList.length) {
      res.json({ code: 200, msg: '判断结束', result: true })
    } else {
      res.json({ code: 200, msg: '判断结束', result: false })
    }
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品详情页 @添加or删除 商品收藏
  collect: async (req, res) => {
    // 判断收藏内是否存在该商品
    let isExist = false
    let data = {
      uId: req.tokenInfo.userId,
      cId: req.body.cId,
    }
    const collectionList = await mallDao.selectCollectList(data)
    if (collectionList.length) {
      collectionList.forEach((item) => {
        if (item.cId == req.body.cId) {
          isExist = true
        }
      })
    }
    // 添加or删除
    const result = isExist
      ? await mallDao.delCollection(data)
      : await mallDao.addCollection(data)
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '操作成功' })
      : res.json({
          code: 201,
          msg: '服务器响应错误',
        })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 商品详情页 @添加到购物车
  addToCart: async (req, res) => {
    let result = null
    const data = {
      uId: req.tokenInfo.userId,
      cId: req.body.cId,
    }
    const cartList = await mallDao.selectCart(data)
    console.log('cartList => ', cartList)
    if (cartList.length) {
      // 如果购物车内已存在该商品，便令数量+1
      result = await mallDao.addComNumInCart({
        ...data,
        num: cartList[0].num + 1,
      })
    } else {
      // 如果购物车内不存在该商品，默认数量为1
      result = await mallDao.addComInCart({
        ...data,
        num: 1,
      })
    }
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '添加成功' })
      : res.json({
          code: 201,
          msg: '服务器响应错误',
        })
  },
}
