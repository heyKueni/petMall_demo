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
      console.log(this.userToken, this.userInfo)
    },
  },
})

export default useUser
