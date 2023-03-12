<template>
  <view class="content">
    <a-headerNormal>
      <template v-slot:right><text>设置个性签名</text></template>
    </a-headerNormal>
    <view class="signFrame">
      <view class="signNormal">修改签名</view>
      <textarea
        cols="30"
        rows="10"
        placeholder="汪汪汪！喵喵喵？"
        placeholder-style="font-size:16rpx"
        v-model="signValue"
      ></textarea>
      {{ signValue }}
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const signValue = ref('')
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
}
</style>
