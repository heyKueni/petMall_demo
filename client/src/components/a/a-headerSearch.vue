<template>
  <view class="headerSearch">
    <view class="header-left">
      <u-icon
        v-if="page.pageDelta"
        class="header-back"
        name="arrow-leftward"
        color="#fff"
        size="20px"
        @tap="back"
      ></u-icon>
      <u-avatar
        v-show="!page.pageDelta"
        :src="user.userInfo.uAvatar"
        size="30"
        @tap="f_fun('f_toMine')"
      ></u-avatar>
    </view>
    <view class="header-center">
      <slot name="searchInput"></slot>
    </view>
    <view class="header-right">
      <text class="searchButton" @tap="f_fun('f_search')">搜索</text>
    </view>
  </view>
</template>
<script setup>
import useStore from '@/store/index'
import { onShow } from '@dcloudio/uni-app'

const { user, page } = useStore()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ cpn init
const f_fun = defineEmits(['f_search', 'f_toMine'])

onShow(() => {
  page.deltaChange()
})

// *--------------------------- fun back
function back() {
  uni.navigateBack({
    delta: 1,
  })
}
// *--------------------------- fun toMine
</script>
<style lang="scss" scoped>
.headerSearch {
  width: 700rpx;
  height: 85rpx;
  background-color: $theme_back;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // position: fixed;
  padding: 0 35rpx 0 20rpx;
  .header-left {
    display: flex;
    align-items: center;
    .header-back {
      padding-right: 10rpx;
    }
  }
  .header-right {
    font-size: 26rpx;
    color: #fff;
  }
  .searchButton {
    font-size: 28rpx;
  }
}
</style>
