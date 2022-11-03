<template>
  <view class="headerNormal">
    <u-icon
      v-if="page.pageDelta"
      class="header-back"
      name="arrow-leftward"
      color="#fff"
      size="20px"
      @tap="back"
    ></u-icon>
    <text class="header-title">
      <slot></slot>
    </text>
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
  width: 750rpx;
  height: 85rpx;
  background-color: $theme_back;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .header-title {
    color: #fff;
    line-height: 24rpx;
    font-size: 32rpx;
  }
  .header-back {
    position: absolute;
    left: 30rpx;
  }
}
</style>
