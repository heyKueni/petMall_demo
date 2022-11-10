import { defineStore } from 'pinia'

const useUser = defineStore('user', {
  state: () => {
    return {
      userInfo: {},
      userToken: '',
    }
  },
  actions: {
    addLoginState(data) {
      this.userToken = data.token
      this.userInfo = { ...data.userInfo }
      sessionStorage.setItem('token', data.token)
      console.log(this.userToken, this.userInfo)
    },
  },
})

export default useUser
