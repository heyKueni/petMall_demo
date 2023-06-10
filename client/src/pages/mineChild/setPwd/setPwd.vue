<template>
  <view class="header">
    <a-headerNormal>
      <template v-slot:right><text>修改密码</text></template>
    </a-headerNormal>
  </view>
  <view class="content">
    <uni-forms>
      <uni-forms-item name="email">
        <input
          class="register_form_input"
          type="text"
          v-model="data.form.email"
          placeholder="请输入邮箱"
          disabled
        />
      </uni-forms-item>
      <view class="register_form_emailCode">
        <uni-forms-item name="emailCode">
          <input
            class="register_form_emailCode_input"
            type="text"
            v-model="data.form.emailCode"
            placeholder="验证码"
          />
        </uni-forms-item>
        <u-code
          :seconds="data.second"
          ref="uCode"
          @change="codeChange"
        ></u-code>
        <button class="register_form_emailCode_button" @tap="getCode">
          {{ data.tips }}
        </button>
      </view>
      <uni-forms-item name="pwd1">
        <input
          class="register_form_input"
          type="text"
          v-model="data.form.pwd1"
          placeholder="请输入密码"
        />
      </uni-forms-item>
      <uni-forms-item name="pwd2">
        <input
          class="register_form_input"
          type="text"
          v-model="data.form.pwd2"
          placeholder="请再次输入密码"
        />
      </uni-forms-item>
    </uni-forms>
    <button @tap="submit">确认修改</button>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import useStore from '../../../store'

const { proxy } = getCurrentInstance()
const { user } = useStore()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ data
const data = reactive({
  form: { email: user.userInfo.uEmail, emailCode: '', pwd1: '', pwd2: '' },
  tips: '',
  second: 60,
})
// *--------------------------- emailCode
const codeChange = (text) => {
  data.tips = text
}
const getCode = () => {
  if (!data.form.email) {
    uni.$u.toast('邮箱为空')
  } else {
    if (proxy.$refs.uCode.canGetCode) {
      // 向后端请求验证码
      uni.showLoading({
        title: '正在获取验证码',
      })
      proxy
        .$req({
          url: '/userA/registerCode',
          method: 'POST',
          data: { email: data.form.email },
        })
        .then((res) => {
          // 这里此提示会被this.start()方法中的提示覆盖
          uni.$u.toast(res.data.msg)
          if (res.data.code == 200) {
            uni.hideLoading()
            // 通知验证码组件内部开始倒计时
            proxy.$refs.uCode.start()
          }
        })
    } else {
      uni.$u.toast('倒计时结束后再发送')
    }
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ submit
const submit = () => {
  proxy
    .$req({
      url: '/userA/changePwd',
      method: 'POST',
      data: { ...data.form },
    })
    .then((res) => {
      uni.$u.toast(res.data.msg)
      if (res.data.code == 200) {
        uni.navigateBack({
          delta: 1,
        })
      }
    })
}
</script>
<style lang="scss"></style>
