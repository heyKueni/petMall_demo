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
      console.log(data)
      this.userToken = data.token
      this.userInfo = { ...data.userInfo }
      uni.setStorageSync('token', data.token)
    },
    // 修改用户状态
    updateUserState(data) {
      this.userInfo = { ...data }
      // console.log(this.userInfo)
    },
    // 清空用户状态
    resetLoginState() {
      this.$reset()
      uni.removeStorageSync('token')
    },
  },
})

export default useUser
