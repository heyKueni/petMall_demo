// 状态管理
import useStore from '../../store/index'

// router白名单
const whiteList = [
  // 加载页
  '/pages/start/start',
  // 登录页
  '/pages/login/login',
  // 设置页
  '/pages/mineChild/set/set',
  // 搜索页
  '/pages/search/search',
  // 商品详情页
  '/pages/mallChild/comIntro/comIntro',
  // 领养详情页
  '/pages/forumChild/adopt',
  // 帖子详情页
  '/pages/forumChild/post',
]

// 登录验证拦截
const routerInterceptor = (option, routerMethod) => {
  let urlChecked = option.url
  // 不能在函数外取用user，pinia并未挂载
  const { user } = useStore()
  // 截取正在路由传值的url
  if (urlChecked.lastIndexOf('?') != -1) {
    urlChecked = urlChecked.slice(0, urlChecked.lastIndexOf('?'))
  }
  // 检索白名单
  const check = whiteList.filter((item) => {
    return urlChecked == item
  })
  // 路由守卫
  if (check.length == 0 && !user.userToken) {
    console.log('路由拦截')
    return uni.navigateTo({
      url: '/pages/login/login',
    })
  } else {
    // console.log('路由正常')
    return routerMethod.call(this, option).catch((err) => {
      console.log('路由跳转报错', err)
    })
  }
}

// 全局属性uri - 封装路由
const uri = {
  // 非tabBar跳转 - 保留
  navigateTo: (option) => {
    const routerMethod = uni['navigateTo']
    routerInterceptor(option, routerMethod)
  },
  // 非tabBar跳转 - 关闭
  redirectTo: (option) => {
    const routerMethod = uni['redirectTo']
    routerInterceptor(option, routerMethod)
  },
  // 非tabBar跳转 - 关闭 - 清空页面栈
  reLaunch: (option) => {
    const routerMethod = uni['reLaunch']
    routerInterceptor(option, routerMethod)
  },

  // tabBar跳转 - switchTab - 关闭 - 清空页面栈

  // 返回 - navigateBack - 根据页面栈回退路由位置

  // 预加载页面 - preloadPage - 性能优化
}

export default uri
