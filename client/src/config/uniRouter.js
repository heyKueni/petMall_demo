// 状态管理
import store from '../store'
// router白名单
const whiteList = [
  '/pages/start/start',
  '/pages/login/login',
  '/pages/register/register',
]

// 登录验证拦截
const routerInterceptor = (option, routerMethod) => {
  const check = whiteList.filter((item) => {
    return option.url == item
  })
  if (check.length == 0 && !store.state.userState.token) {
    // console.log('路由拦截')
    return uni.reLaunch({
      url: '/pages/login/login',
    })
  } else {
    // console.log('路由正常')
    return routerMethod.call(this, option)
  }
}

// 非tabBar跳转 - 保留
const navigateTo = (option) => {
  const routerMethod = uni['navigateTo']
  routerInterceptor(option, routerMethod)
}

// 非tabBar跳转 - 关闭
const redirectTo = (option) => {
  const routerMethod = uni['redirectTo']
  routerInterceptor(option, routerMethod)
}

// 非tabBar跳转 - 关闭 - 清空页面栈
const reLaunch = (option) => {
  const routerMethod = uni['reLaunch']
  routerInterceptor(option, routerMethod)
}

// tabBar跳转 - 关闭 - 清空页面栈
// const switchTab = (option) => {
//   const routerMethod = uni['switchTab']
//   routerInterceptor(option, routerMethod)
// }

// 返回 - 根据页面栈回退路由位置
// const navigateBack = (option) => {
//   const routerMethod = uni['navigateBack']
//   routerInterceptor(option, routerMethod)
// }

// 预加载页面 - 性能优化
// const preloadPage = (option) => {
//   const routerMethod = uni['preloadPage']
//   routerInterceptor(option, routerMethod)
// }

export default {
  navigateTo,
  redirectTo,
  reLaunch,
  // switchTab,
  // navigateBack,
  // preloadPage,
}
