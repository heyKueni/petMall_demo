<template>
  <view class="headerNormal">
    <view class="header-left">
      <u-icon
        v-if="page.pageDelta"
        class="header-back"
        name="arrow-leftward"
        color="#fff"
        size="20px"
        @tap="back"
      ></u-icon>
      <view class="header-title">
        <slot name="left"></slot>
      </view>
    </view>

    <view class="header-right">
      <slot name="right"></slot>
    </view>
  </view>
</template>
<script setup>
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ cpn init
const { page } = useStore()

// *--------------------------- back
function back() {
  uni.navigateBack({
    delta: 1,
  })
}
</script>
<style lang="scss">
.headerNormal {
  width: 700rpx;
  height: 85rpx;
  background-color: $theme_back;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 25rpx;
  .header-left {
    display: flex;
    align-items: center;
    .header-title {
      color: #fff;
      line-height: 24rpx;
      font-size: 32rpx;
    }
    .header-back {
      padding-right: 20rpx;
    }
  }
  .header-right {
    font-size: 26rpx;
    color: #fff;
  }
}
</style>
