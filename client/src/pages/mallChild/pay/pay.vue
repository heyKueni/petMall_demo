<template>
  <view class="pay">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>支付订单</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content">
      <!-- 收货地址 -->
      <view class="address">
        <view class="address_title">收货地址</view>
        <view class="address_content" @tap="checkPopup">
          <view class="address_r">{{ orderData.address.receiver }}</view>
          <view class="address_t">{{ orderData.address.tel }}</view>
          <view class="address_a">{{ orderData.address.address }}</view>
          <view
            class="address_empty"
            v-if="JSON.stringify(orderData.address) == '{}'"
          >
            添加收货地址
          </view>
          <view class="address_i">
            <u-icon
              name="arrow-right"
              color="#fff"
              size="28"
              v-if="JSON.stringify(orderData.address) != '{}'"
            ></u-icon>
          </view>
        </view>
      </view>
      <!-- 商品清单 -->
      <view class="commodity">
        <view class="commodity_title">商品清单</view>
        <view class="commodity_order">订单号：{{ orderData.order }}</view>
        <view class="commodity_content">
          <view
            class="commodity_item"
            v-for="(item, index) in orderData.orderList"
            :key="index"
          >
            <view class="commodity_item_img">
              <u--image
                width="150rpx"
                height="150rpx"
                radius="12rpx"
                :src="item.cImg"
              ></u--image>
            </view>
            <view class="commodity_item_intro">
              <view class="commodity_item_name">{{ item.cIntro_text }}</view>
              <view class="commodity_item_intro_bottom">
                <view class="commodity_item_price">¥{{ item.cPrice }}</view>
                <view class="commodity_item_num">×{{ item.num }}</view>
              </view>
            </view>
          </view>
          <view
            class="commodity_order commodity_time"
            v-if="orderData.orderList.length"
          >
            {{ orderData.orderList[0].ooCreateTime }}
          </view>
        </view>
      </view>
    </view>
    <!-- BLANK -->
    <view class="BLANK"></view>
    <!-- 提交订单栏 -->
    <view class="submitBar">
      <view class="text">
        <text class="RMB">¥</text>
        <text class="INT">
          {{ parseInt(orderData.allCost) }}
        </text>
        <text>
          .
          {{
            ((orderData.allCost - parseInt(orderData.allCost)) * 100).toFixed(0)
          }}
        </text>
      </view>
      <button class="submit" @tap="submitOrder">提交订单</button>
    </view>
    <view class="ChangeAddress">
      <u-popup :show="show" :round="10" mode="bottom" @close="close">
        <view>
          <view class="ChangeAddress_title">
            修改收货地址
          </view>
          <view class="ChangeAddress_content">
            <scroll-view scroll-y>
              <view
                class="ChangeAddress_content_item"
                v-for="item in orderData.addressList"
                :key="item.aId"
                @tap="changeAddress(item)"
              >
                <view class="ChangeAddress_item_r">{{ item.receiver }}</view>
                <view class="ChangeAddress_item_t">{{ item.tel }}</view>
                <view class="ChangeAddress_item_a">{{ item.address }}</view>
              </view>
            </scroll-view>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import useUser from '../../../store/index'

const { proxy } = getCurrentInstance()
const { user } = useUser()
// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const show = ref(false)
const orderData = reactive({
  orderList: [],
  addressList: [],
  address: {},
  allCost: 0,
  order: '',
})

onLoad((options) => {
  orderData.order = options.order
  SelectOrderOne(options.order)
})

onShow(() => {
  selectAddress()
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ address popup
const checkPopup = () => {
  if (JSON.stringify(orderData.address) == '{}') {
    proxy.$uri.navigateTo({
      url: '/pages/mineChild/setAddress/setAddress?uId=' + user.userInfo.cId,
    })
  } else {
    selectAddressAll()
    show.value = true
  }
}
const changeAddress = (item) => {
  orderData.address = { ...item }
  show.value = false
}
const close = () => {
  show.value = false
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ submitBar
// *--------------------------- submitOrder
const submitOrder = () => {
  if (JSON.stringify(orderData.address) != '{}') {
    let data = { ...orderData.address, ooId: orderData.order }
    proxy
      .$req({ url: '/mall/submitOrder', method: 'POST', data })
      .then((res) => {
        if (res.data.code == 200) {
          uni.$u.toast(res.data.msg)
          uni.navigateBack({ delta: 1 })
        } else {
          uni.$u.toast(res.data.msg)
        }
      })
  } else {
    uni.$u.toast('请添加收货地址，喵~')
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
// *--------------------------- SelectOrderOne
const SelectOrderOne = (ooId) => {
  const data = { ooId }
  proxy
    .$req({ url: '/mall/SelectOrderOne', method: 'POST', data })
    .then((res) => {
      if (res.data.code == 200) {
        orderData.orderList = [...res.data.result]
        orderData.allCost = res.data.result[0].allCost
      }
    })
}
// *--------------------------- selectAddress
const selectAddress = () => {
  proxy.$req({ url: '/userA/selectAddressOne', method: 'GET' }).then((res) => {
    if (res.data.code == 200 && res.data.addressOne != undefined) {
      orderData.address = { ...res.data.addressOne }
    }
  })
}
// *--------------------------- selectAddressAll
const selectAddressAll = () => {
  proxy.$req({ url: '/userA/selectAddress', method: 'GET' }).then((res) => {
    if (res.data.code == 200) {
      orderData.addressList = [...res.data.list]
    } else {
      uni.$u.toast(res.data.msg)
    }
  })
}
</script>
<style lang="scss" scoped>
.address {
  width: 710rpx;
  height: auto;
  padding: 25rpx 20rpx 0 20rpx;
  .address_title {
    width: 660rpx;
    height: auto;
    background-color: #fff;
    font-size: 28rpx;
    font-weight: 700;
    padding: 10rpx 20rpx;
    border-radius: 12rpx 12rpx 0 0;
  }
  .address_content {
    width: 660rpx;
    height: auto;
    background-color: $theme_back;
    padding: 15rpx 20rpx;
    border-radius: 0 0 12rpx 12rpx;
    color: #fff;
    font-weight: 700;
    position: relative;
    .address_r {
      font-size: 40rpx;
      padding-bottom: 10rpx;
    }
    .address_t {
      font-size: 28rpx;
      padding-bottom: 10rpx;
    }
    .address_a {
      padding-bottom: 10rpx;
    }
    .address_i {
      position: absolute;
      top: 65rpx;
      right: 10rpx;
    }
    .address_empty {
      padding-bottom: 40rpx;
    }
  }
}
.commodity {
  width: 710rpx;
  height: auto;
  padding: 25rpx 20rpx 0 20rpx;
  .commodity_title {
    width: 660rpx;
    height: auto;
    background-color: #fff;
    font-size: 28rpx;
    font-weight: 700;
    padding: 10rpx 20rpx;
    border-radius: 12rpx 12rpx 0 0;
  }
  .commodity_order {
    width: 660rpx;
    height: auto;
    background-color: #fff;
    font-size: 20rpx;
    font-weight: 700;
    padding: 10rpx 20rpx;
  }
  .commodity_time {
    padding: 30rpx 20rpx 0 0;
    display: flex;
    justify-content: flex-end;
  }
  .commodity_content {
    width: 660rpx;
    height: auto;
    background-color: #fff;
    padding: 25rpx 20rpx;
    border-radius: 0 0 12rpx 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .commodity_item {
      width: 630rpx;
      height: auto;
      background-color: #fff;
      box-shadow: 0 2rpx 2rpx 1rpx rgba(0, 0, 0, 0.2);
      padding: 15rpx;
      margin-top: 20rpx;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
    }
    .commodity_item_intro {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .commodity_item_name {
        padding-left: 10rpx;
        font-size: 27rpx;
        padding-bottom: 12rpx;
      }
      .commodity_item_intro_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .commodity_item_price {
          padding-left: 12rpx;
          font-size: 27rpx;
        }
        .commodity_item_num {
          padding-right: 12rpx;
        }
      }
    }
  }
}
.BLANK {
  width: 750rpx;
  height: 110rpx;
  margin-top: 20rpx;
}
.submitBar {
  width: 700rpx;
  height: 90rpx;
  background-color: #fff;
  padding: 10rpx 25rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    color: red;
    font-weight: 700;
    .RMB {
      padding-right: 10rpx;
    }
    .INT {
      font-size: 50rpx;
    }
  }
  .submit {
    width: 190rpx;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 70rpx;
    font-size: 30rpx;
    background-color: red;
    color: #fff;
    margin: 0;
  }
}
.ChangeAddress_title {
  width: 710rpx;
  height: auto;
  padding: 20rpx;
  font-size: 30rpx;
  font-weight: 700;
}
.ChangeAddress_content {
  width: 710rpx;
  height: auto;
  padding: 20rpx;
  .ChangeAddress_content_item {
    border-radius: 12rpx;
    padding: 12rpx;
    color: #fff;
    background-color: $theme_back;
    margin-bottom: 12rpx;
  }
}
</style>
