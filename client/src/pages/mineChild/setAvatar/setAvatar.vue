<template>
  <view class="content">
    <a-headerNormal>
      <template v-slot:right><text>更换头像</text></template>
    </a-headerNormal>
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
        ></u-button>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive } from 'vue'
import userStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const { user } = userStore()
let avatarSrc = ref(user.userInfo.uAvatar)

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
    name: 'avatarFile', // 文件对应的key值
    header: {
      Authorization: sessionStorage.getItem('token'), // 需要带的请求头，token等等
      // type: 'client',
    },
    formData: {
      // 额外的请求数据
      uId: user.userInfo.uId,
    },
    success: (res) => {
      // 成功后的回调
      console.log(res)
      console.log('修改成功')
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
