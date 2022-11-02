import { defineStore } from 'pinia'

const useFormDemo = defineStore('form_demo', {
  state: () => {
    return {
      formName: '',
      formData: {},
    }
  },
})

export default useFormDemo
