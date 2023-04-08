<template>
  <view class="header">
    <a-headerNormal>
      <template v-slot:right>
        <text>{{ navigatorTitle }}</text>
      </template>
    </a-headerNormal>
  </view>
  <view class="content">
    <!-- 表单 -->
    <view class="formAddress">
      <u--form
        labelPosition="left"
        :model="addressForm"
        :rules="rules"
        ref="form1"
      ></u--form>
    </view>
    <!-- 按钮 -->
    <view class="buttonArea">
      <u-button class="addAddress">确定</u-button>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const navigatorTitle = ref('')
const addressForm = {}

onLoad((options) => {
  JSON.stringify(options) != '{}'
    ? (navigatorTitle.value = '修改地址')
    : (navigatorTitle.value = '添加地址')
})
</script>
<style lang="scss" scoped>
.formAddress {
  width: 750rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::before {
    content: '';
    display: block;
    width: 750rpx;
    height: 32rpx;
  }
}
.buttonArea {
  width: 750rpx;
  height: 100rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 30rpx;
  // background-color: $theme_back;
  .addAddress {
    width: 700rpx;
    height: 80rpx;
    border: none;
    border-radius: 80rpx;
    background-color: $theme_back;
    color: #fff;
    font-size: 28rpx;
  }
}
</style>
