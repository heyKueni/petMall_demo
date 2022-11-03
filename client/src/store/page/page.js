import { defineStore } from 'pinia'

const usePage = defineStore('page', {
  state: () => {
    return {
      text:
        'uview-plus UI众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用',
      pageDelta: false,
    }
  },
  actions: {
    deltaChange(length) {
      length > 1 ? (this.pageDelta = true) : (this.pageDelta = false)
    },
  },
})

export default usePage
