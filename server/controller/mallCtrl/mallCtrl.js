const mallDao = require('../../dao/mallDao/mallDao')
const mineAndSetDao = require('../../dao/userDao/mineAndSetDao')

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
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @查询
  selectCartAll: async (req, res) => {
    const result = await mallDao.selectCartAll({
      uId: req.tokenInfo.userId,
    })
    res.json({ code: 200, msg: '查询成功', result })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @数量修改
  numChange: async (req, res) => {
    const result = await mallDao.numChange({
      cId: req.body.cId,
      num: req.body.num,
      uId: req.tokenInfo.userId,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '修改成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @删除商品
  delCartCom: (req, res) => {
    let result = null
    req.body.toDelList.forEach(async (item) => {
      result = await mallDao.delCartCom({
        cId: item,
        uId: req.tokenInfo.userId,
      })
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '删除成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 购物车 @去结算
  toPayFromCart: async (req, res) => {
    let data = { payList: req.body.payList, uId: req.tokenInfo.userId }
    // 订单号 @order_out 随机六位数+总毫秒数+年月日时分秒
    let timeData = new Date()
    let ooId =
      '' +
      Math.floor(Math.random() * 1000000) +
      timeData.getTime() +
      timeData.getFullYear() +
      timeData.getMonth() +
      timeData.getDate() +
      timeData.getHours() +
      timeData.getMinutes() +
      timeData.getSeconds()
    // 订单总价
    let allCost = 0
    // *--------------------------- 添加未支付订单 @order_out 大订单
    data.payList.forEach(async (item, index) => {
      let comOne = await mallDao.selectOneCom({
        cId: item,
      })
      let cumOneInCart = await mallDao.selectCart({
        cId: item,
        uId: data.uId,
      })
      allCost += comOne[0].cPrice * cumOneInCart[0].num
      if (index == data.payList.length - 1) {
        // 此处有未知的异步操作
        // 导致allCost的值无法写入dao层
        // 只能写进这个forEach循环
        allCost = allCost.toFixed(2)
        const result1 = await mallDao.addNoPayedOrder({
          ooId,
          timeData,
          allCost,
          uId: data.uId,
        })
        // *--------------------------- 添加未支付订单 @order_in 小订单
        if (typeof result1 != 'undefined') {
          // 此处有未知的异步操作
          // 只能写进这个forEach循环
          data.payList.forEach(async (item, index) => {
            let comOneInCart = await mallDao.selectCart({
              cId: item,
              uId: data.uId,
            })
            // console.log(comOneInCart[0].num, item, ooId)
            await mallDao.addOrderIn({
              num: comOneInCart[0].num,
              cId: item,
              ooId,
            })
            if (index == data.payList.length - 1) {
              // 此处有未知的异步操作
              // 只能写进这个forEach循环
              // *--------------------------- 删除购物车对应商品
              data.payList.forEach(async (item) => {
                await mallDao.delCartCom({
                  uId: data.uId,
                  cId: item,
                })
              })
            }
          })
        }
      }
    })
    res.json({ code: 200, msg: '订单生成成功', result: ooId })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 支付订单 @查询当前订单
  SelectOrderOne: async (req, res) => {
    let data = { ooId: req.body.ooId, uId: req.tokenInfo.userId }
    const result = await mallDao.SelectOrderOne(data)
    result.length
      ? res.json({ code: 200, msg: '查询成功', result })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
  // ?+++++++++++++++++++++++++++++++++++++++++++++++ 支付订单 @提交订单
  submitOrder: async (req, res) => {
    let data = { ...req.body, uId: req.tokenInfo.userId }
    let ooCreateTime = '' + new Date()
    const addressList = await mineAndSetDao.selectAddress({
      uId: data.uId,
    })
    addressList.forEach((item) => {
      if (item.aId == data.aId) {
        console.log('aId', item.aId)
        data.tel = item.tel
      }
    })
    const result = await mallDao.submitOrder({
      ooId: data.ooId,
      receiver: data.receiver,
      tel: data.tel,
      address: data.address,
      ooCreateTime,
      isPayed: 1,
      uId: data.uId,
    })
    typeof result != 'undefined'
      ? res.json({ code: 200, msg: '支付成功' })
      : res.json({ code: 201, msg: '服务器响应错误' })
  },
}
