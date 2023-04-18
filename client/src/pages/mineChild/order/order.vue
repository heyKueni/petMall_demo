<template>
  <view class="order">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>我的订单</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content">
      <!-- BLANK -->
      <view class="blank"></view>
      <!-- 分段器 -->
      <view class="currentPicker">
        <u-subsection
          :list="orderContent.orderContentList"
          :current="orderContent.current"
          activeColor="#79a186"
          inactiveColor="#ffffff"
          bgColor="#79a186"
          @change="sectionChange"
        ></u-subsection>
      </view>
      <!-- 订单列表 @未支付 -->
      <view class="orderRes" v-if="orderData.orderList_0.length">
        <view
          class="orderRes_0_item"
          v-for="item in orderData.orderList_0"
          :key="item.ooId"
        >
          <view class="orderRes_0_item_title">订单号：{{ item.ooId }}</view>
          <view class="orderRes_0_item_content">
            <view
              class="orderRes_0_item_item"
              v-for="element in item.list"
              :key="element.oiId"
            >
              <u--image
                :showLoading="true"
                :src="element.cImg"
                width="80px"
                height="80px"
                radius="12rpx"
              ></u--image>
              <view class="orderRes_0_item_right">
                <view class="orderRes_0_item_name">
                  {{ element.cIntro_text }}
                </view>
                <view class="orderRes_0_item_bottom">
                  <view class="orderRes_0_item_price">
                    ¥ {{ element.cPrice }}
                  </view>
                  <view class="orderRes_0_item_num">× {{ element.num }}</view>
                </view>
              </view>
            </view>
            <view class="orderRes_0_item_content_bottom">
              <button
                class="orderRes_0_item_content_button"
                @tap="delOrder_0(item.ooId)"
              >
                删除
              </button>
              <button
                class="orderRes_0_item_content_button"
                @tap="toPay(item.ooId)"
              >
                前往支付
              </button>
            </view>
          </view>
        </view>
      </view>
      <!-- 订单列表 @已支付 -->
      <view class="orderRes" v-if="orderData.orderList_1.length">
        <view
          class="orderRes_item"
          v-for="item in orderData.orderList_1"
          :key="item.oiId"
          @tap="toOrderIntro(item.oiId)"
        >
          <u--image
            :showLoading="true"
            :src="item.cImg"
            width="80px"
            height="80px"
            radius="12rpx"
          ></u--image>
          <view class="orderIntro">
            <view class="orderIntro_text">{{ item.cIntro_text }}</view>
            <view class="orderIntro_bottom">
              <text class="orderIntro_bottom_font">
                {{ item.ooCreateTime }}
              </text>
              <view>
                <text class="orderIntro_price">
                  ¥ {{ item.cPrice.toFixed(2) }}
                </text>
                <text class="orderIntro_num">共{{ item.num }}件</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 空内容 -->
      <view
        class="empty_view"
        v-if="!orderData.orderList_0.length && !orderData.orderList_1.length"
      >
        <u-empty
          mode="order"
          icon="http://cdn.uviewui.com/uview/empty/order.png"
        ></u-empty>
      </view>
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useStore from '@/store/index'
import { listToTree } from '@/common/js/dataTool'

const { user } = useStore()
const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init

onShow(() => {
  orderRes()
})
// *--------------------------- 分段器
const orderContent = reactive({
  current: 0,
  orderContentList: [{ name: '未支付' }, { name: '已支付' }],
})
const sectionChange = (index) => {
  if (index != orderContent.current) {
    orderContent.current = index
    orderRes()
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ order_bottom
const toPay = (ooId) => {
  proxy.$uri.navigateTo({
    url: '/pages/mallChild/pay/pay?order=' + ooId,
  })
}
const delOrder_0 = (ooId) => {
  let data = { ooId }
  proxy.$req({ url: '/mall/delOrder_0', method: 'POST', data }).then((res) => {
    uni.$u.toast(res.data.msg)
    if (res.data.code == 200) {
      orderRes()
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const orderData = reactive({
  orderList_0: [],
  orderList_1: [],
})
// *--------------------------- orderRes
const orderRes = () => {
  // 重置数据
  orderData.orderList_0.length = 0
  orderData.orderList_1.length = 0
  if (!orderContent.current && user.userToken) {
    // 查询未支付订单
    proxy.$req({ url: '/mall/orderRes_0', method: 'GET' }).then((res) => {
      console.log(res)
      if (res.data.code == 200 && res.data.result) {
        orderData.orderList_0 = [...listToTree(res.data.result)]
        // console.log(orderData.orderList_0)
      }
    })
  } else if (orderContent.current && user.userToken) {
    // 查询已支付订单
    proxy.$req({ url: '/mall/orderRes_1', method: 'GET' }).then((res) => {
      // console.log(res)
      if (res.data.code == 200) {
        orderData.orderList_1 = [...res.data.result]
      }
    })
  } else {
    uni.$u.toast('登录状态丢失')
  }
}
// *--------------------------- toOrderIntro
const toOrderIntro = (oiId) => {
  proxy.$uri.navigateTo({
    url: '/pages/mineChild/orderIntro/orderIntro?oiId=' + oiId,
  })
}
</script>
<style lang="scss" scoped>
.blank {
  width: 750rpx;
  height: 70rpx;
}
.currentPicker {
  width: 750rpx;
  height: auto;
  position: fixed;
  top: 125rpx;
  z-index: 999;
}
::v-deep.u-subsection--button[data-v-297fcc41] {
  height: 32px px;
  background-color: rgb(238, 238, 239);
  padding: 7rpx 3px;
  border-radius: 0;
  align-items: stretch;
}
.orderRes {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25rpx 0;
}
.orderRes_0_item {
  margin-bottom: 25rpx;
  .orderRes_0_item_title {
    width: 650rpx;
    height: auto;
    padding: 15rpx 25rpx;
    background-color: #fff;
    border-radius: 12rpx 12rpx 0 0;
    font-size: 20rpx;
    font-weight: 700;
  }
  .orderRes_0_item_content {
    width: 650rpx;
    height: auto;
    padding: 15rpx 25rpx;
    border-radius: 0 0 12rpx 12rpx;
    border-top: 1px solid rgb(219, 219, 219);
    background-color: #fff;
    .orderRes_0_item_item {
      width: 620rpx;
      height: auto;
      padding: 15rpx;
      display: flex;
      align-items: center;
      margin-bottom: 15rpx;
      .orderRes_0_item_right {
        display: flex;
        flex-direction: column;
        padding-left: 20rpx;
        .orderRes_0_item_name {
          font-size: 24rpx;
          padding-bottom: 20rpx;
        }
        .orderRes_0_item_bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .orderRes_0_item_price {
          color: red;
        }
        .orderRes_0_item_num {
          font-size: 28rpx;
          padding-right: 20rpx;
        }
      }
    }
  }
  .orderRes_0_item_content_bottom {
    width: 650rpx;
    height: auto;
    background-color: #fff;
    padding-top: 20rpx;
    border-top: 1px solid rgb(232, 232, 232);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .orderRes_0_item_content_button {
      width: 180rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 60rpx;
      margin: 0 0 0 20rpx;
      background-color: red;
      color: #fff;
      font-size: 30rpx;
    }
  }
}

.orderRes_item {
  width: 700rpx;
  height: auto;
  padding: 15rpx;
  background-color: #fff;
  border-radius: 24rpx;
  margin-bottom: 25rpx;
  display: flex;
  align-items: center;
  border: 1px solid rgb(240, 240, 240);
  .orderIntro {
    padding-left: 25rpx;
  }
  .orderIntro_text {
    font-size: 24rpx;
    padding-bottom: 30rpx;
  }
  .orderIntro_bottom {
    display: flex;
    justify-content: space-between;
    padding-right: 25rpx;
    .orderIntro_bottom_font {
      font-size: 12rpx;
      color: rgb(157, 157, 157);
      line-height: 40rpx;
    }
    .orderIntro_price {
      font-size: 30rpx;
    }
    .orderIntro_num {
      font-size: 24rpx;
      padding-left: 12rpx;
    }
  }
}
</style>
