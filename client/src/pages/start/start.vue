<template>
  <view class="content-start">
    <button class="start-skip" @tap="skipToIndex">
      <text class="skip-time">{{ pageState.skipTime }}</text>
      <text class="skip-tip">跳过</text>
    </button>
    <view class="start-img"></view>
    <view class="start-text">
      <text class="start-title">
        {{ pageState.title }}
      </text>
      <text class="start-tip">
        {{ pageState.tip }}
      </text>
    </view>
    <text class="start-info">
      {{ pageState.info }}
    </text>
  </view>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import useStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const pageState = reactive({
  skipTime: 5,
  title: '阿尔蓝松',
  tip: '奶酪、薯片与电子猫咖',
  info: '@copyright 阿尔蓝松™ 2022-11-2 非商业用途',
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ skip
//  skip timer
const createTimer = setInterval(() => {
  --pageState.skipTime
  if (pageState.skipTime <= 0) {
    skipToIndex()
  }
}, 1000)
//  skip tap
function skipToIndex() {
  clearInterval(createTimer)
  uni.switchTab({ url: '/pages/index/index' })
}
</script>
<style lang="scss">
.content-start {
  width: 750rpx;
}
.start-skip {
  $edge: 80rpx;
  width: $edge;
  height: $edge;
  border-radius: $edge;
  position: fixed;
  top: 23rpx;
  right: 23rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #bcbcbc;
  color: #fff;
  .skip-time {
    height: 20rpx;
    font-size: 25rpx;
  }
  .skip-tip {
    width: 50rpx;
    height: 20rpx;
    font-size: 24rpx;
    transform: scale(0.75);
    padding-top: 12rpx;
  }
}
.start-img {
  width: inherit;
  height: 100vh;
  background: {
    image: url('../../static/img/start.jpg');
    repeat: no-repeat;
    size: cover;
    position: 22%;
  }
  overflow: hidden;
  animation: startImg 8s forwards;
}
.start-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 302rpx;
  left: 50%;
  transform: translate(-50%);
}
.start-title {
  color: $theme_back;
  width: 750rpx;
  text-align: center;
  font-size: 95rpx;
  font-weight: 700;
  padding-bottom: 10rpx;
}
.start-tip {
  color: #b7b7b7;
  font-size: 28rpx;
}
.start-info {
  color: #cdcdcd;
  width: 750rpx;
  text-align: center;
  position: fixed;
  font-size: 24rpx;
  bottom: 18rpx;
}

@keyframes startImg {
  from {
    background-position: 20%;
  }
  to {
    background-position: 25%;
  }
}
</style>
