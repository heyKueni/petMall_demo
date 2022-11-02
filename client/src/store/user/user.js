import { defineStore } from 'pinia'

const useUser = defineStore('user', {
  state: () => {
    return {
      userId: '1',
      userName: '鸭鸭',
      userAccount: '1305893731',
      userAvatar: '../../static/icon/q-cat.png',
    }
  },
})

export default useUser
