import { defineStore } from 'pinia'

const useUser = defineStore('user', {
  state: () => {
    return {
      userId: '1',
      userName: '鸭鸭',
      userAccount: '1305893731',
      userAvatar: '../../static/test_avatar.jpg',
      userToken: '',
    }
  },
})

export default useUser
