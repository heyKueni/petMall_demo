<template>
  <view class="orderIntro">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>查看订单</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content" v-if="JSON.stringify(introData.introObj) != '{}'">
      <view class="intro_item">
        <view class="intro_item_title">商品信息</view>
        <view class="intro_item_content">
          <u--image
            :showLoading="true"
            :src="introData.introObj.cImg"
            width="80px"
            height="80px"
            radius="12rpx"
          ></u--image>
          <view class="intro_item_right">
            <view class="intro_item_name">
              {{ introData.introObj.cIntro_text }}
            </view>
            <view class="intro_item_bottom">
              <view class="intro_item_price">
                ¥ {{ introData.introObj.cPrice.toFixed(2) }}
              </view>
              <view class="intro_item_num">
                共{{ introData.introObj.num }}件
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="intro_item">
        <view class="intro_item_title">订单详情</view>
        <view class="intro_item_text">
          <view class="intro_text">单据：{{ introData.introObj.oiId }}</view>
          <view class="intro_text">订单号：{{ introData.introObj.ooId }}</view>
          <view class="intro_text">
            收货人：{{ introData.introObj.receiver }}
          </view>
          <view class="intro_text">电话：{{ introData.introObj.tel }}</view>
          <view class="intro_text">
            收货地址：{{ introData.introObj.address }}
          </view>
          <view class="intro_text">
            支付时间：{{ introData.introObj.ooCreateTime }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
onLoad((options) => {
  selectOrderIntro(options.oiId)
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const introData = reactive({
  introObj: {},
})
// *--------------------------- selectOrderIntro
const selectOrderIntro = (oiId) => {
  const data = { oiId }
  proxy
    .$req({ url: '/mall/selectOrderIntro', method: 'GET', data })
    .then((res) => {
      // console.log(res)
      if (res.data.code == 200) {
        introData.introObj = { ...res.data.result }
      } else {
        uni.$u.toast(res.data.msg)
      }
    })
}
</script>
<style lang="scss" scoped>
.intro_item {
  width: 700rpx;
  height: auto;
  padding: 25rpx;
}
.intro_item_title {
  width: 650rpx;
  height: auto;
  font-size: 27rpx;
  font-weight: 700;
  padding: 12rpx 25rpx;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  border-bottom: 1px solid rgb(231, 231, 231);
}
.intro_item_content {
  width: 650rpx;
  height: auto;
  padding: 12rpx 25rpx;
  background-color: #fff;
  border-radius: 0 0 24rpx 24rpx;
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
  .intro_item_right {
    display: flex;
    flex-direction: column;
    padding-left: 20rpx;
    .intro_item_name {
      font-size: 24rpx;
      padding-bottom: 20rpx;
    }
    .intro_item_bottom {
      display: flex;
      justify-content: space-between;
      padding-top: 10rpx;
      .intro_item_price {
        color: red;
      }
      .intro_item_num {
        font-size: 28rpx;
        padding-right: 20rpx;
      }
    }
  }
}
.intro_item_text {
  width: 650rpx;
  height: auto;
  padding: 12rpx 25rpx;
  background-color: #fff;
  border-radius: 0 0 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  .intro_text {
    font-size: 28rpx;
    padding: 20rpx 0;
  }
}
</style>
