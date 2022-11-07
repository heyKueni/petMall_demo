import { defineStore } from 'pinia'

const useUser = defineStore('user', {
  state: () => {
    return {
      userId: '1',
      userName: '',
      userAccount: '1305893731',
      userLevel: '',
      userToken: '',
      userSign: '',
      havePet: false,
    }
  },
})

export default useUser
