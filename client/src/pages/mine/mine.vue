<template>
  <view class="header"></view>
  <view class="mainBody" show-scrollbar="false">
    <view class="mine-header">
      <view class="mine-header-level">{{ user.userInfo.uLevel }}</view>
      <view class="mine-header-name">{{ user.userInfo.uName || '游客' }}</view>
      <view>
        <u-avatar
          class="mine-header-avatar"
          :src="user.userInfo.uAvatar"
          shape="circle"
          size="65"
        ></u-avatar>
      </view>
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
      <view class="mine-content-doc-card" v-if="user.userToken == ''">
        <image
          class="empty-pet-card ePet-1"
          src="../../static/icon/q-pig.png"
          mode="aspectFit"
        />
        <image
          class="empty-pet-card ePet-2"
          src="../../static/icon/q-bird.png"
          mode="aspectFit"
        />
        <text class="empty-pet-tip">快给朕注册身份证~</text>
      </view>
      <view
        class="mine-content-doc-card"
        v-if="JSON.stringify(pageState.petInfo) != '{}' && user.userToken != ''"
      >
        <view class="doc-card-info">
          <view class="doc-card-info-name">
            {{ pageState.petInfo.pName }}
          </view>
          <view class="doc-card-info-other">
            <text style="padding-right: 5px;">{{ petAge }}</text>
            <text>{{ pageState.petInfo.pBear ? '未绝育' : '已绝育' }}</text>
          </view>
        </view>
        <image
          class="doc-card-avatar"
          :src="pageState.petInfo.ptIcon"
          mode="aspectFit"
        />
      </view>
    </view>
    <view class="mine-content-abilities">
      <view
        class="ability-item"
        v-for="item in pageState.abilityList"
        :key="item.key"
        @tap="item.routerTo"
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
import { reactive, getCurrentInstance, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const { user } = useStore()
const { proxy } = getCurrentInstance()
const pageState = reactive({
  petInfo: {},
  abilityList: [
    {
      key: 1,
      name: '我的帖子',
      icon: '',
      routerTo: () => {
        console.log('我的帖子')
      },
    },
    {
      key: 2,
      name: '我的收藏',
      icon: '',
      routerTo: () => {
        proxy.$uri.navigateTo({
          url: '/pages/mineChild/collection/collection',
        })
      },
    },
    {
      key: 3,
      name: '通知消息',
      icon: '',
      routerTo: () => {
        console.log('通知消息')
      },
    },
    {
      key: 4,
      name: '我的订单',
      icon: '',
      routerTo: () => {
        proxy.$uri.navigateTo({
          url: '/pages/mineChild/order/order',
        })
      },
    },
    {
      key: 5,
      name: '购物车',
      icon: '',
      routerTo: () => {
        proxy.$uri.navigateTo({
          url: '/pages/mallChild/cart/cart',
        })
      },
    },
    {
      key: 6,
      name: '设置',
      icon: '',
      routerTo: () => {
        proxy.$uri.navigateTo({
          url: '/pages/mineChild/set/set',
        })
      },
    },
  ],
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ getPetInfo
onShow(() => {
  if (user.userToken != '') {
    proxy
      .$req({
        url: '/petA/checkPetExist',
        methods: 'GET',
        data: {
          uId: user.userInfo.uId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          pageState.petInfo = res.data.data[0]
        }
      })
  } else {
    user.userInfo = {}
  }
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ petAge
const petAge = computed(() => {
  if (JSON.stringify(pageState.petInfo) == '{}') {
    return 'computedError'
  } else {
    let dateNow = new Date()
    let birth = new Date(pageState.petInfo.pBirth)
    let result =
      dateNow.getFullYear() * 12 +
      dateNow.getMonth() -
      (birth.getFullYear() * 12 + birth.getMonth())
    return parseInt(result / 12) + '岁' + (result % 12) + '个月'
  }
})
</script>
<style lang="scss" scoped>
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
    overflow: hidden;
    position: relative;
    .empty-pet-card {
      width: 240rpx;
      height: 240rpx;
      position: absolute;
    }
    .empty-pet-tip {
      padding-left: 280rpx;
      font-weight: 700;
      color: $theme_back;
      font-size: 35rpx;
    }
    .ePet-1 {
      top: -70rpx;
      left: -50rpx;
      transform: rotate(25deg);
      z-index: 11;
    }
    .ePet-2 {
      top: 10rpx;
      left: 50rpx;
      transform: rotate(-5deg);
    }
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
  .ability-item:last-child {
    margin-bottom: 50rpx;
  }
}
</style>
