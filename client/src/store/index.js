// import { defineStore } from 'pinia'

import useUser from './user/user' // 用户信息
import usePage from './page/page' // 页面状态

import useFormDemo from './form/demo' // 表单 - demo

function useStore() {
  // const piniaMessage = '🍍 ' + 'is installed'
  // console.log(piniaMessage)
  return {
    // user
    user: useUser(),
    // page
    page: usePage(),
    // form
    formDemo: useFormDemo(),
  }
}

export default useStore
