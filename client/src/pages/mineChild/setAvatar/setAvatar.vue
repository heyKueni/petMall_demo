<template>
  <view class="header">
    <a-headerNormal>
      <template v-slot:right><text>更换头像</text></template>
    </a-headerNormal>
  </view>
  <view class="content">
    <view class="avatarChangeFrame">
      <image class="avatar" :src="avatarSrc"></image>
      <text class="avatarName">当前头像</text>
      <view class="operaFrame">
        <u-button
          class="avatarB"
          type="success"
          text="选择图片"
          @tap="chooseImg"
        ></u-button>
        <u-button
          class="avatarB"
          type="success"
          text="确认上传"
          @tap="upLoadImg"
          :disabled="uploadCheck"
        ></u-button>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, watch } from 'vue'
import userStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const { user } = userStore()
let avatarSrc = ref(user.userInfo.uAvatar)
let uploadCheck = ref(true)

const closeWatch = watch(avatarSrc, (newValue, oldValue) => {
  uploadCheck.value = false
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ avatar

// *--------------------------- choose
function chooseImg() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      avatarSrc.value = res.tempFilePaths[0] // 用于更新视图
    },
  })
}
// *--------------------------- upload

function upLoadImg() {
  uni.uploadFile({
    url: '/arlanzon/userA/avatarChange', // 请求地址
    filePath: avatarSrc.value, // 临时文件路径
    name: 'avatar', // 文件对应的key值
    header: {
      Authorization: uni.getStorageSync('token'),
    },
    success: (res) => {
      console.log(res)
      // 更新用户信息
      const data = JSON.parse(res.data)
      user.updateUserState(data.info)
      // 离开页面
      uni.$u.toast(data.msg)
      closeWatch()
      uni.navigateBack({
        delta: 1,
      })
    },
  })
}
</script>
<style lang="scss">
.avatarChangeFrame {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 500rpx;
  height: 500rpx;
  margin: 150rpx 0 30rpx 0;
  border-radius: 250rpx;
}
.avatarName {
  color: gray;
  margin-bottom: 120rpx;
}
.avatarB {
  width: 390rpx;
  margin-bottom: 40rpx;
  background-color: $theme_back;
  color: white;
  border: none;
}
</style>
