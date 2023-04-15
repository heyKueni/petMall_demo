<template>
  <view>
    <view class="header">
      <a-headerSearch
        :keyWord="searchValue"
        @f_search="search"
        @f_toMine="toMine"
      >
        <template v-slot:searchInput>
          <input
            class="searchInput"
            type="text"
            placeholder="百无禁忌，喵~"
            v-model="searchValue"
          />
        </template>
      </a-headerSearch>
    </view>
    <view class="content">
      <!-- 商品图片 -->
      <view class="comImgFrame">
        <view class="comImg">
          <u--image
            :src="comData.details.cImg"
            width="720rpx"
            height="720rpx"
          ></u--image>
        </view>
      </view>
      <!-- 商品简介 -->
      <view class="comIntro">
        <view class="comIntroTitle">
          <view class="ARLANZON">ARLANZON</view>
          <view class="comPrice">¥ {{ comData.details.cPrice }}</view>
          <view class="comName">{{ comData.details.cIntro_text }}</view>
        </view>
      </view>
      <!-- 商品详情图 -->
      <view class="comIntroImgFrame">
        <view class="comIntroImgTitle">商品详情</view>
        <image
          class="comIntroImg"
          :src="comData.details.cIntro_img"
          width="720rpx"
          mode="widthFix"
        ></image>
      </view>
      <!-- BLANK -->
      <view class="BLANK"></view>
      <!-- 提交订单栏 -->
      <view class="submitBar">
        <view class="navigation">
          <view class="left">
            <!-- 收藏 -->
            <view class="item" @tap="collect">
              <u-icon
                :name="isCollected ? 'heart-fill' : 'heart'"
                :size="20"
                :color="
                  isCollected && user.userToken
                    ? 'red'
                    : $u.color['contentColor']
                "
              ></u-icon>
              <view class="text u-line-1">收藏</view>
            </view>
            <!-- 店铺 -->
            <view class="item" @tap="toMall">
              <u-icon
                name="home"
                :size="20"
                :color="$u.color['contentColor']"
              ></u-icon>
              <view class="text u-line-1">店铺</view>
            </view>
            <!-- 购物车 -->
            <view class="item car" @tap="toCart">
              <u-badge
                class="car-num"
                :count="9"
                type="error"
                :offset="[-3, -6]"
              ></u-badge>
              <u-icon
                name="shopping-cart"
                :size="20"
                :color="$u.color['contentColor']"
              ></u-icon>
              <view class="text u-line-1">购物车</view>
            </view>
          </view>
          <view class="right">
            <view class="cart btn u-line-1" @tap="addToCart(cId)">
              加入购物车
            </view>
            <view class="buy btn u-line-1" @tap="pay()">立即购买</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import useStore from '../../../store'

const { proxy } = getCurrentInstance()
const { user } = useStore()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const searchValue = ref('')
const isCollected = ref(false)
const cId = ref(0)

onLoad((options) => {
  cId.value = options.cId
  comIntroSelect(cId.value)
  if (user.userToken) {
    isCollect(cId.value)
  }
})

onShow(() => {
  searchValue.value = ''
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ cpn fun
// *--------------------------- f_search
const search = () => {
  searchValue.value
    ? proxy.$uri.navigateTo({
        url: '/pages/search/search?tag=' + searchValue.value,
      })
    : uni.$u.toast('请输入搜索内容，喵~')
}
// *--------------------------- f_toMine
const toMine = () => {
  uni
    .switchTab({
      url: '/pages/mine/mine',
    })
    .catch((err) => {
      console.log(err)
    })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ submitBar
// *--------------------------- collect
const collect = () => {
  const data = { cId: comData.details.cId }
  user.userToken
    ? proxy.$req({ url: '/mall/collect', method: 'POST', data }).then((res) => {
        if (res.data.code == 200) {
          isCollected.value = !isCollected.value
        } else {
          uni.$u.toast(res.data.msg)
        }
      })
    : proxy.$uri.navigateTo({ url: '/pages/login/login' })
}
// *--------------------------- toMall
const toMall = () => {
  uni.switchTab({ url: '/pages/mall/mall' })
}
// *--------------------------- toCart
const toCart = () => {
  proxy.$uri.navigateTo({
    url: '/pages/mallChild/cart/cart',
  })
}
// *--------------------------- addToCart
const addToCart = (cId) => {
  const data = { cId }
  if (user.userToken) {
    proxy.$req({ url: '/mall/addToCart', method: 'POST', data }).then((res) => {
      if (res.data.code == 200) {
        uni.$u.toast(res.data.msg)
      } else {
        uni.$u.toast(res.data.msg)
      }
    })
  } else {
    proxy.$uri.navigateTo({ url: '/pages/login/login' })
  }
}
// *--------------------------- pay
const pay = (options) => {
  if (user.userToken) {
    console.log('立即购买')
  } else {
    proxy.$uri.navigateTo({ url: '/pages/login/login' })
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const comData = reactive({
  details: {},
})
// *--------------------------- comIntroSelect
const comIntroSelect = (cId) => {
  const data = { cId }
  proxy
    .$req({
      url: '/mall/comIntroSelect',
      method: 'GET',
      data,
    })
    .then((res) => {
      if (res.data.code == 200) {
        comData.details = { ...res.data.result }
      } else {
        uni.$u.toast(res.data.msg)
      }
    })
}
// *--------------------------- isCollect
const isCollect = (cId) => {
  let data = { cId }
  proxy.$req({ url: '/mall/isCollect', method: 'GET', data }).then((res) => {
    isCollected.value = res.data.result
  })
}
</script>

<style lang="scss" scoped>
.content {
  .BLANK {
    width: 750rpx;
    height: 100rpx;
    // background-color: #ff7900;
  }
}
.comImgFrame {
  width: 720rpx;
  height: 720rpx;
  padding: 15rpx 15rpx 0 15rpx;
  .comImg {
    width: inherit;
    height: inherit;
    border-radius: 12rpx 12rpx 0 0;
    overflow: hidden;
  }
}
.comIntro {
  width: 720rpx;
  height: auto;
  padding: 0 15rpx 15rpx 15rpx;
  .comIntroTitle {
    width: inherit;
    height: auto;
    background-color: #79a186;
    color: #fff;
    position: relative;
    border-radius: 0 0 12rpx 12rpx;
    overflow: hidden;
    .ARLANZON {
      position: absolute;
      top: 20rpx;
      left: 100rpx;
      font-size: 160rpx;
      font-weight: 900;
      color: rgba($color: #ffffff, $alpha: 0.1);
    }
    .comPrice {
      font-size: 50rpx;
      padding: 18rpx 0 0 12rpx;
    }
    .comName {
      font-size: 16rpx;
      padding: 8rpx 12rpx 24rpx 12rpx;
    }
  }
}
.comIntroImgFrame {
  width: 720rpx;
  padding: 0 15rpx 15rpx 15rpx;
  .comIntroImgTitle {
    width: 708rpx;
    padding: 10rpx 0 10rpx 10rpx;
    border-radius: 12rpx 12rpx 0 0;
    font-weight: 700;
    font-size: 19rpx;
    background-color: #fff;
  }
  .comIntroImg {
    width: 720rpx;
    border-radius: 0 0 12rpx 12rpx;
  }
}
.submitBar {
  width: 720rpx;
  padding: 0 15rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  .navigation {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 16rpx 0;
    .left {
      display: flex;
      font-size: 20rpx;
      .item {
        margin: 0 20rpx;
        &.car {
          text-align: center;
          position: relative;
          .car-num {
            position: absolute;
            top: -10rpx;
            right: -10rpx;
          }
        }
      }
    }
    .right {
      display: flex;
      font-size: 28rpx;
      align-items: center;
      .btn {
        line-height: 66rpx;
        padding: 0 30rpx;
        border-radius: 36rpx;
        color: #ffffff;
      }
      .cart {
        background-color: #ed3f14;
        margin-right: 30rpx;
      }
      .buy {
        background-color: #ff7900;
      }
    }
  }
}
</style>
