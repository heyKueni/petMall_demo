<template>
  <view class="content">
    <a-headerNormal>
      <template v-slot:right><text>修改昵称</text></template>
    </a-headerNormal>
    <view class="uni-input-wrapper">
      <input
        class="uni-input nameInput"
        placeholder="铲屎官报上姓名(*^▽^*)"
        v-model="nickName"
      />
    </view>
    <u-button class="nameButton" :disabled="nameSwitch" @tap="changeName">
      确认修改
    </u-button>
  </view>
</template>
<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import useStore from '../../../store'

const { user } = useStore()
const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const nickName = ref(user.userInfo.uName)
const nameSwitch = ref(true)

const closeWatch = watch(nickName, (value, preValue) => {
  nameSwitch.value = false
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ name change
const changeName = () => {
  const data = { name: nickName.value }
  proxy.$req({ url: '/userA/changeName', method: 'POST', data }).then((res) => {
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
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nameInput {
  background-color: $theme;
  margin-top: 40rpx;
  width: 690rpx;
  height: 60rpx;
  padding: 10rpx 30rpx;
  font-size: 28rpx;
  // text-align: center;
}
.nameButton {
  border: none;
  border-radius: 0;
  width: 750rpx;
  background-color: $theme_back;
  color: $theme;
  margin-top: 40rpx;
  font-size: 28rpx;
}
</style>
