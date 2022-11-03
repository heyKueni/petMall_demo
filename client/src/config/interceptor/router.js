// 状态管理
import useStore from '../../store/index'

// router白名单
const whiteList = [
  '/pages/start/start',
  '/pages/login/login',
  'pages/mineChild/set/set',
]

// 登录验证拦截
const routerInterceptor = (option, routerMethod) => {
  // 不能在函数外取用user，pinia并未挂载
  const { user } = useStore()
  const check = whiteList.filter((item) => {
    return option.url == item
  })
  if (check.length == 0 && !user.userToken) {
    // console.log('路由拦截')
    return uni.reLaunch({
      url: '/pages/login/login',
    })
  } else {
    // console.log('路由正常')
    return routerMethod.call(this, option)
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
