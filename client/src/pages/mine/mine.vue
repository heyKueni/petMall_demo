<template>
  <view class="content" show-scrollbar="false">
    <view class="mine-header">
      <view class="mine-header-level">1级铲屎官</view>
      <view class="mine-header-name">狗蛋</view>
      <image class="mine-header-avatar" :src="userAvatar" mode="aspectFit" />
    </view>
    <view class="mine-content-doc">
      <view class="mine-content-doc-header">
        <view class="doc-header-name">
          <image
            class="doc-icon-name"
            src="../../static/logo.png"
            mode="aspectFit"
          />
          <view class="doc-name">我的宠物档案</view>
        </view>
        <text class="doc-button">添加宠物</text>
      </view>
      <view class="mine-content-doc-card">
        <view class="doc-card-info">
          <view class="doc-card-info-name">
            鸭鸭
          </view>
          <view class="doc-card-info-other">
            <text style="padding-right: 5px;">1岁6个月</text>
            <text>未绝育</text>
          </view>
        </view>
        <image
          class="doc-card-avatar"
          src="../../static/icon/q-dog.png"
          mode="aspectFit"
        />
      </view>
    </view>
    <view class="mine-content-abilities">
      <view
        class="ability-item"
        v-for="item in pageState.abilityList"
        :key="item.key"
      >
        <image
          class="ability-item-icon"
          src="../../static/logo.png"
          mode="aspectFit"
        />
        {{ item.name }}
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const { user } = useStore()
const { userAvatar } = storeToRefs(user)
const pageState = reactive({
  abilityList: [
    { key: 1, name: '我的发布', icon: '', path: '' },
    { key: 2, name: '我的收藏', icon: '', path: '' },
    { key: 3, name: '我的聊天', icon: '', path: '' },
    { key: 4, name: '我的钱包', icon: '', path: '' },
    { key: 5, name: '打卡签到', icon: '', path: '' },
    { key: 6, name: '我的群', icon: '', path: '' },
    { key: 7, name: '设置', icon: '', path: '' },
  ],
})
</script>
<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mine-header {
  width: 750rpx;
  height: 380rpx;
  background-color: $theme_back;
  border-radius: 0 0 20px 20px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  color: #fff;
  font-size: 14px;
  padding-bottom: 70rpx;
  .mine-header-level {
    font-size: 24rpx;
  }
  .mine-header-name {
    font-size: 28rpx;
    padding-bottom: 15rpx;
  }
  .mine-header-avatar {
    $edge: 140rpx;
    width: $edge;
    height: $edge;
    border-radius: $edge;
    margin-bottom: 50rpx;
  }
}

.mine-content-doc {
  width: 700rpx;
  .mine-content-doc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 0;
    .doc-header-name {
      display: flex;
      align-items: center;
      .doc-icon-name {
        $edge: 36rpx;
        width: $edge;
        height: $edge;
        border-radius: $edge;
        margin-right: 3px;
      }
      .doc-name {
        font-size: 28rpx;
        font-weight: bold;
      }
    }
    .doc-button {
      font-size: 26rpx;
      color: rgb(94, 94, 255);
    }
  }
  .mine-content-doc-card {
    width: 668rpx;
    height: 123rpx;
    padding: 16rpx;
    box-shadow: 0 3px 15rpx #eeeeee;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .doc-card-info {
      width: 500rpx;
      height: 100rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .doc-card-info-name {
        font-size: 28rpx;
      }
      .doc-card-info-other {
        font-size: 24rpx;
      }
    }
    .doc-card-avatar {
      $edge: 123rpx;
      width: $edge;
      height: $edge;
      border-radius: $edge;
    }
  }
}
.mine-content-abilities {
  width: 700rpx;
  padding-top: 16rpx;
  display: flex;
  flex-direction: column;
  .ability-item {
    width: 668rpx;
    height: 90rpx;
    font-size: 28rpx;
    border-bottom: 1px solid #e2e2e2;
    display: flex;
    align-items: center;
    .ability-item-icon {
      $edge: 55rpx;
      width: $edge;
      height: $edge;
      border-radius: $edge;
      margin-right: 20rpx;
    }
  }
}
</style>
