function listToTree(data) {
  // 创建一个空数组
  let result = []

  // 判断输入数组
  if (!Array.isArray(data)) {
    // 首先判断传进来的这个参数是不是一个数组
    return result
    // 如果不是直接结束
  }

  // 创建一个map对象 添加到map中
  let map = new Map()
  // 遍历
  data.forEach((item) => {
    //创建这个对象并且去掉ooId
    let temp = {
      ...item,
    }
    delete temp['ooId']
    // 判断这个元素的ooid是否加入map
    if (map.has(item['ooId'])) {
      // 如果已经加入
      map.get(item['ooId']).list.push(temp)
    } else {
      // 如果没有
      // 添加到result
      let obj = {
        ooId: item['ooId'],
        list: [temp],
      }
      map.set(item['ooId'], obj)
      result.push(obj)
    }
  })
  return result
}

export { listToTree }

// if (result.length) {
//   let newRes = []
//   // 工具 @生成树形结构
//   function toolFun(list) {
//     // 利用闭包缓存数据
//     let obj = { ooId: list[0].ooId, list: [] }
//     function itemFun(unitObj) {
//       let unit = { ...unitObj }
//       let itemT = {
//         cId: unit.cId,
//         cImg: unit.cImg,
//         cIntro_text: unit.cIntro_text,
//         cPrice: unit.cPrice,
//         num: unit.num,
//         oiId: unit.oiId,
//       }
//       if (obj.ooId == unit.ooId) {
//         // 当ooId相同时，将cImg字段放入缓存
//         obj.list.push(itemT)
//         if (list[list.length - 1].oiId != unit.oiId) {
//           return {}
//         } else {
//           // 根据oiId判断，返回最后一个缓存结果
//           return obj
//         }
//       } else {
//         // 不相同时，将obj临时缓存下来
//         let objRes = { ooId: obj.ooId, list: [...obj.list] }
//         // 更新obj
//         obj.ooId = unit.ooId
//         obj.list.length = 0
//         obj.list.push(itemT)
//         return objRes
//       }
//     }
//     return itemFun
//   }

//   // 初始化工具
//   let tool = toolFun(result)
//   for (let item of result) {
//     let newObj = tool(item)
//     if (JSON.stringify(newObj) != '{}') {
//       newRes.push(newObj)
//     }
//     // if (
//     //   JSON.stringify(newObj) != '{}' &&
//     //   item.oiId != newObj.oiId &&
//     //   result.length > 1
//     // ) {
//     //   let itemX = { ...item }
//     //   itemX.ooId = '这是一个特殊情况，即多订单，且最后一个订单只有一件商品'
//     //   newRes.push(tool(itemX))
//     // }
//   }
//   console.log(newRes)
//   return newRes
// } else {
//   return result
// }
