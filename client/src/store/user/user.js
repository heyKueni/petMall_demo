import { defineStore } from 'pinia'

const useUser = defineStore('user', {
  state: () => {
    return {
      userInfo: {},
      userToken: '',
    }
  },
  actions: {
    // 登录添加用户状态
    addLoginState(data) {
      this.userToken = data.token
      this.userInfo = { ...data.userInfo }
      sessionStorage.setItem('token', data.token)
      // console.log(this.userToken, this.userInfo)
    },
    // 修改用户状态
    updateUserState(data) {
      this.userInfo = { ...data }
      // console.log(this.userInfo)
    },
  },
})

export default useUser
