import { defineStore } from 'pinia'

const useUser = defineStore('user', {
  state: () => {
    return {
      userId: '1',
      userToken: '',
    }
  },
  actions: {
    loginStore(data) {
      this.userId = data.uId
      this.userToken = data.token
    },
  },
})

export default useUser
