<template>
  <view class="header">
    <a-headerNormal>
      <template v-slot:right><text>设置个性签名</text></template>
    </a-headerNormal>
  </view>
  <view class="content">
    <view class="signFrame">
      <textarea
        class="uTextarea"
        v-model="signValue"
        height="100"
        placeholder="快来设置个性签名吧"
        border="none"
      ></textarea>
      <u-button class="signButton" :disabled="nameCheck" @tap="changeSign">
        完成
      </u-button>
    </view>
  </view>
</template>
<script setup>
import { getCurrentInstance, ref, watch } from 'vue'
import useStore from '../../../store'

const { user } = useStore()
const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const signValue = ref(user.userInfo.uSign)
const nameCheck = ref(true)

const closeWatch = watch(signValue, (value, preValue) => {
  nameCheck.value = false
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ sign Change
const changeSign = () => {
  const data = { sign: signValue.value }
  proxy.$req({ url: '/userA/changeSign', method: 'POST', data }).then((res) => {
    if (res.data.code == 200) {
      // 更新用户信息
      const data = res.data
      user.updateUserState(data.info)
      // 离开页面
      uni.$u.toast(data.msg)
      closeWatch()
      uni.navigateBack({
        delta: 1,
      })
    }
  })
}
</script>
<style lang="scss">
.signFrame {
  width: 750rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .signNormal {
    width: 720rpx;
    padding: 20rpx 0 30rpx 30rpx;
  }
  .uTextarea {
    width: 750rpx;
    border-radius: 0;
    background-color: #fff;
    margin-top: 40rpx;
    font-size: 28rpx;
  }
  .signButton {
    width: 750rpx;
    border: none;
    border-radius: 0;
    background-color: $theme_back;
    color: #fff;
    margin-top: 40rpx;
    font-size: 28rpx;
  }
}
</style>
