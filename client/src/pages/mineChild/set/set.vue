<template>
  <view class="content">
    <a-headerNormal>
      {{ pageState.title }}
    </a-headerNormal>
    <view class="set-content">
      <view class="set-user-card">
        <view class="set-user-avatar"></view>
        <view class="set-user-info">
          <view class="set-user-name">
            <text class="set-user-name-nick">我的昵称</text>
            <text class="set-user-name-level">养宠小白</text>
          </view>
          <view class="set-user-sign">
            <text>快来设置自己的个性签名吧</text>
          </view>
        </view>
      </view>
      <view
        class="set-user-card-item"
        v-for="item in pageState.abilityList"
        :key="item.key"
        @tap="item.setFn"
      >
        <text>{{ item.name }}</text>
        <u-icon name="arrow-right" color="#cdcdcd"></u-icon>
      </view>
      <view class="login-out">
        <text class="login-out-text">退出登录</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const pageState = reactive({
  title: '设置',
  abilityList: [
    { key: '1', name: '更换头像', setFn: () => {} },
    { key: '2', name: '修改昵称', setFn: () => {} },
    { key: '3', name: '设置个性签名', setFn: () => {} },
    { key: '4', name: '等级介绍', setFn: () => {} },
    { key: '5', name: '我的地址', setFn: () => {} },
    { key: '6', name: '绑定邮箱', setFn: () => {} },
  ],
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ back
const { page } = useStore()
onShow(() => {
  page.deltaChange(getCurrentPages().length)
})
</script>
<style lang="scss">
.set-content {
  width: 700rpx;
  padding: 70rpx 0 15rpx 0;
  display: flex;
  flex-direction: column;
  // align-items: center;
}
.set-user-card {
  width: 720rpx;
  height: 130rpx;
  padding: 15rpx 15rpx 35rpx 35rpx;
  $border: 1px solid #cdcdcd;
  //   border-top: $border;
  border-bottom: $border;
  display: flex;
  align-items: flex-end;
  .set-user-avatar {
    $edge: 180rpx;
    width: $edge;
    height: $edge;
    border-radius: $edge;
    border: 1px solid #000;
    background: {
      image: url('../../../static/test_avatar.jpg');
      repeat: no-repeat;
      size: cover;
    }
  }
  .set-user-info {
    width: 465rpx;
    height: inherit;
    padding-left: 25rpx;
    // background-color: yellow;
    .set-user-name {
      width: inherit;
      height: 85rpx;
      display: flex;
      align-items: center;
      .set-user-name-nick {
        font-size: 38rpx;
        font-weight: 600;
        padding-right: 15rpx;
      }
      .set-user-name-level {
        font-size: 24rpx;
        padding-top: 20rpx;
        transform: scale(0.8);
      }
    }
    .set-user-sign {
      width: inherit;
      height: 38rpx;
      font-size: 24rpx;
    }
  }
}

@mixin item {
  width: 690rpx;
  height: 100rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #cdcdcd;
  display: flex;
}

.set-user-card-item {
  align-items: center;
  justify-content: space-between;
  @include item;
}
.login-out {
  position: fixed;
  bottom: 40rpx;
  border-top: 1px solid #cdcdcd;
  .login-out-text {
    width: inherit;
    color: red;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @include item;
}
</style>
