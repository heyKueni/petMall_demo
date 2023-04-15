<template>
  <view>
    <view class="header">
      <a-headerNormal>
        <template v-slot:right><text>我的地址</text></template>
      </a-headerNormal>
    </view>
    <view class="content">
      <view><u-loading-page loadingText="加载中……"></u-loading-page></view>
      <!-- 地址为空 -->
      <view class="emptyArea" v-if="!addressList.length">
        <u-empty
          mode="list"
          icon="http://cdn.uviewui.com/uview/empty/list.png"
          width="220"
          height="220"
          text="还没有录入地址信息"
          textColor="#79a186"
        ></u-empty>
      </view>
      <!-- 地址数据 @删除 @修改 -->
      <view class="listArea" v-if="addressList.length">
        <u-swipe-action :autoClose="true">
          <view v-for="item in addressList" :key="item.aId">
            <u-swipe-action-item :options="options" @tap="del(item.aId)">
              <view class="swipe-action u-border-top u-border-bottom">
                <view class="swipe-action__content">
                  <view class="addressItem">
                    <view class="itemInfo">
                      <view class="infoName">{{ item.receiver }}</view>
                      <view class="infoTel">{{ item.tel }}</view>
                      <view class="infoAddress">{{ item.address }}</view>
                    </view>
                    <view class="itemButton">
                      <u-icon
                        name="edit-pen"
                        color="#79a186"
                        size="28"
                        data-tag="item.aId"
                        @tap="changeAddress(item.aId)"
                      ></u-icon>
                    </view>
                  </view>
                </view>
              </view>
            </u-swipe-action-item>
          </view>
        </u-swipe-action>
      </view>
      <!-- 添加地址 -->
      <view class="buttonArea">
        <u-button class="addAddress" @tap="addAddress">添加地址</u-button>
      </view>
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const addressList = reactive([])
onShow(() => {
  addressSelect()
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ address select
const addressSelect = () => {
  addressList.length = 0
  proxy.$req({ url: '/userA/selectAddress' }).then((res) => {
    if (res.data.code == 200) {
      res.data.list.forEach((item) => {
        addressList.push(item)
      })
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ address delete
const options = reactive([
  { text: '删除', style: { backgroundColor: '#ef3473' } },
])
const del = (aId) => {
  let data = { aId }
  proxy.$req({ url: '/userA/delAddress', method: 'POST', data }).then((res) => {
    if (res.data.code == 200) {
      uni.showToast({
        title: res.data.msg,
        icon: 'success',
      })
      addressSelect()
    } else {
      uni.showToast({
        title: res.data.msg,
        icon: 'error',
      })
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ address editor
// *--------------------------- add
const addAddress = () => {
  proxy.$uri.navigateTo({
    url: '/pages/mineChild/setAddressEditor/setAddressEditor',
  })
}
// *--------------------------- change
const changeAddress = (aId) => {
  // console.log('修改');
  proxy.$uri.navigateTo({
    url: '/pages/mineChild/setAddressEditor/setAddressEditor?aId=' + aId,
  })
}
</script>
<style lang="scss">
.emptyArea {
  width: 750rpx;
  height: auto;
  top: 240rpx;
  position: fixed;
}
.addressItem {
  width: 725rpx;
  height: 120rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 30rpx 0 20rpx 25rpx;
  .itemButton {
    width: 80rpx;
    height: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .infoTel {
    font-size: 24rpx;
    padding: 5rpx 0 3rpx 0;
  }
  .infoAddress {
    font-size: 26rpx;
    color: #84b595;
    padding-top: 5rpx;
    background-color: #fff;
  }
  &:before {
    content: '';
    display: block;
    width: 720rpx;
    position: absolute;
    left: 15rpx;
    top: 0;
    border-top: 1px solid rgb(199, 199, 199);
  }
  &:first-child:before {
    display: none;
  }
}
.u-swipe-action-item {
  width: 750rpx;
  height: 170rpx;
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
