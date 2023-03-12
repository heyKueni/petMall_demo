<template>
  <view class="content">
    <a-headerNormal>
      <template v-slot:left>
        <text>设置</text>
      </template>
    </a-headerNormal>
    <view class="set-content">
      <view class="set-user-card">
        <u-avatar
          class="set-user-avatar"
          :src="user.userInfo.uAvatar"
          shape="circle"
          size="90"
        ></u-avatar>
        <view class="set-user-info">
          <view class="set-user-name">
            <text class="set-user-name-nick">
              {{ user.userInfo.uName || '游客' }}
            </text>
            <text class="set-user-name-level">
              {{ user.userInfo.userLevel }}
            </text>
          </view>
          <view class="set-user-sign">
            <text>{{ user.userInfo.uSign || '快来设置个性签名吧' }}</text>
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
      <view class="login-out" v-if="pageState.isOnline" @tap="loginOut">
        <text class="login-out-text onlineState-true">退出登录</text>
      </view>
      <view class="login-out" v-if="!pageState.isOnline" @tap="loginIn">
        <text class="login-out-text onlineState-false">前往登录</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const { proxy } = getCurrentInstance()
const pageState = reactive({
  title: '设置',
  abilityList: [
    {
      key: '1',
      name: '更换头像',
      setFn: () => {
        proxy.$uri.navigateTo({ url: '/pages/mineChild/setAvatar/setAvatar' })
      },
    },
    {
      key: '2',
      name: '修改昵称',
      setFn: () => {
        proxy.$uri.navigateTo({ url: '/pages/mineChild/setName/setName' })
      },
    },
    {
      key: '3',
      name: '设置个性签名',
      setFn: () => {
        proxy.$uri.navigateTo({ url: '/pages/mineChild/setSign/setSign' })
      },
    },
    {
      key: '4',
      name: '等级介绍',
      setFn: () => {
        proxy.$uri.navigateTo({ url: '/pages/mineChild/setLevel/setLevel' })
      },
    },
    {
      key: '5',
      name: '我的地址',
      setFn: () => {
        proxy.$uri.navigateTo({ url: '/pages/mineChild/setAddress/setAddress' })
      },
    },
    {
      key: '6',
      name: '绑定邮箱',
      setFn: () => {
        proxy.$uri.navigateTo({ url: '/pages/mineChild/setEmail/setEmail' })
      },
    },
  ],
  isOnline: false,
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ back
const { page, user } = useStore()
onShow(() => {
  page.deltaChange(getCurrentPages().length)
  user.userToken ? (pageState.isOnline = true) : (pageState.isOnline = false)
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ abilities
// *--------------------------- login
// out
function loginOut() {
  user.$reset()
  console.log(user.userInfo)
  proxy.$uri.navigateTo({ url: '/pages/login/login' })
}
// in
function loginIn() {
  proxy.$uri.navigateTo({ url: '/pages/login/login' })
}
</script>
<style lang="scss">
.set-content {
  width: 700rpx;
  padding: 70rpx 0 15rpx 0;
  display: flex;
  flex-direction: column;
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
  @include item;
  .login-out-text {
    width: inherit;
    color: red;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .onlineState-true {
    color: $theme_back;
  }
  .onlineState-false {
    color: $theme_back;
  }
}
</style>
