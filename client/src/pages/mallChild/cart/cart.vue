<template>
  <view class="cart">
    <view class="header">
      <a-headerNormal>
        <template v-slot:left>
          <text>购物车</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content" v-if="cartData.comList.length">
      <view class="cart_title">全部 {{ allComNum }}</view>
      <!-- 购物车清单 -->
      <view class="cartCom_list">
        <u-checkbox-group placement="column">
          <view
            class="cartCom_item"
            v-for="item in cartData.comList"
            :key="item.cId"
          >
            <!-- 复选框 -->
            <u-checkbox
              :customStyle="{ marginBottom: '8px' }"
              shape="circle"
              activeColor="red"
              :checked="item.checked"
              @change="choose(item)"
            ></u-checkbox>
            <!-- 图片 -->
            <view class="cart_img">
              <u--image
                :showLoading="true"
                :src="item.cImg"
                width="80px"
                height="80px"
                radius="12rpx"
              ></u--image>
            </view>
            <!-- 商品信息 -->
            <view class="cart_com">
              <view class="cart_com_name">{{ item.cIntro_text }}</view>
              <view class="cart_com_price">
                <view class="cart_com_price_p">
                  ¥ {{ item.cPrice.toFixed(2) }}
                </view>
                <view class="cart_com_price_n">
                  <uni-number-box
                    v-model="item.num"
                    :min="1"
                    @change="numChange(item.cId)"
                  ></uni-number-box>
                </view>
              </view>
            </view>
          </view>
        </u-checkbox-group>
      </view>
      <view class="BLANK"></view>
    </view>
    <!-- 购物车为空 -->
    <view class="empty_tip" v-if="!cartData.comList.length"></view>
    <button class="empty_toMall" @tap="toMall" v-if="!cartData.comList.length">
      前往市集
    </button>
    <!-- 订单提交栏 -->
    <view class="bottom_submit">
      <view class="allPrice">
        <view class="checkbox_selectAll">
          <u-checkbox-group placement="column">
            <u-checkbox
              :customStyle="{ marginBottom: '8px' }"
              shape="circle"
              activeColor="red"
              :disabled="!cartData.comList.length"
              :checked="cartData.isAllSelected"
              label="全选"
              @change="selectedAll"
            ></u-checkbox>
          </u-checkbox-group>
        </view>
        <view class="allPrice_text">合计：¥{{ allPrice }}</view>
      </view>
      <view class="submit_button">
        <button class="del_button" @tap="delCartCom">删除</button>
        <button class="pay_button" @tap="toPayFromCart">
          去结算({{ selectComNum }})
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const searchValue = ref('')

onShow(() => {
  searchValue.value = ''
  cartData.isAllSelected = false
  selectCartAll()
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ empty
const toMall = () => {
  uni.switchTab({ url: '/pages/mall/mall' })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ numberBox
const numChange = async (cId) => {
  // 此处步进器的数据更新是异步的，使用nextTick便可在DOM更新后获取数据
  await nextTick()
  let data = { cId: 0, num: 0 }
  cartData.comList.forEach((item) => {
    if (item.cId == cId) {
      ;(data.cId = cId), (data.num = item.num)
    }
  })
  proxy.$req({ url: '/mall/numChange', method: 'POST', data }).then((res) => {
    if (res.data.code != 200) {
      uni.$u.toast(res.data.msg)
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ checkboxGroup
// *--------------------------- choose
const choose = (item) => {
  // 反选
  item.checked = !item.checked
  // 全选判定
  cartData.isAllSelected = cartData.comList.every(
    (item) => item.checked == true,
  )
}
// *--------------------------- selectedAll
const selectedAll = () => {
  cartData.isAllSelected = !cartData.isAllSelected
  cartData.comList.map((item) => {
    item.checked = cartData.isAllSelected
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ submitBar
// *--------------------------- delCartCom
const delCartCom = () => {
  let data = { toDelList: [] }
  cartData.comList.forEach((item) => {
    if (item.checked) {
      data.toDelList.push(item.cId)
    }
  })
  data.toDelList.length
    ? proxy
        .$req({ url: '/mall/delCartCom', method: 'POST', data })
        .then((res) => {
          uni.$u.toast(res.data.msg)
          selectCartAll()
        })
    : uni.$u.toast('无商品被选中，喵~')
}
// *--------------------------- toPayFromCart
const toPayFromCart = () => {
  let payList = []
  cartData.comList.forEach((item) => {
    if (item.checked == true) {
      payList.push(item.cId)
    }
  })
  if (payList.length) {
    let data = { payList }
    proxy
      .$req({ url: '/mall/toPayFromCart', method: 'POST', data })
      .then((res) => {
        if (res.data.code == 200) {
          uni.$u.toast(res.data.msg)
          proxy.$uri.navigateTo({
            url: '/pages/mallChild/pay/pay?order=' + res.data.result,
          })
        }
        uni.$u.toast(res.data.msg)
      })
  } else {
    uni.$u.toast('无商品被选中，喵~')
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const cartData = reactive({
  comList: [],
  isAllSelected: false,
  itemIsChanged: {},
})
// 全部 @计算属性
const allComNum = computed(() => {
  let num = 0
  cartData.comList.forEach((item) => {
    num += item.num
  })
  return num
})
// 结算-被选中 @计算属性
const selectComNum = computed(() => {
  let num = 0
  cartData.comList.forEach((item) => {
    if (item.checked == true) {
      num += item.num
    }
  })
  return num
})
// 合计 @计算属性
const allPrice = computed(() => {
  let price = 0
  cartData.comList.forEach((item) => {
    if (item.checked) {
      price += item.cPrice * item.num
    }
  })
  return price.toFixed(2)
})
// *--------------------------- selectCartAll
const selectCartAll = () => {
  cartData.comList.length = 0
  proxy.$req({ url: '/mall/selectCartAll', method: 'GET' }).then((res) => {
    if (res.data.code == 200) {
      res.data.result.forEach((item) => {
        cartData.comList.push({ ...item, checked: false })
      })
    } else {
      uni.$u.toast(res.data.msg)
    }
  })
}
</script>

<style lang="scss" scoped>
.BLANK {
  width: 75rpx;
  height: 110rpx;
  // background-color: red;
}
.empty_tip {
  width: 750rpx;
  height: 500rpx;
  position: fixed;
  top: 380rpx;
  left: -100rpx;
  background-image: url('../../../common/img/cartEmpty.png');
}
.empty_toMall {
  width: 250rpx;
  height: 70rpx;
  font-size: 30rpx;
  line-height: 70rpx;
  border-radius: 70rpx;
  position: fixed;
  top: 920rpx;
  left: 250rpx;
  background-color: red;
  color: #fff;
}
.cart_title {
  width: 700rpx;
  height: auto;
  color: red;
  font-weight: 700;
  font-size: 28rpx;
  padding: 30rpx 25rpx 0 25rpx;
}
.cartCom_list {
  width: 700rpx;
  height: auto;
  padding: 30rpx 25rpx 0 25rpx;
  .cartCom_item {
    width: 650rpx;
    height: auto;
    padding: 25rpx;
    border-radius: 12rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 25rpx;
    .cart_img {
      padding-left: 14rpx;
    }
    .cart_com {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .cart_com_name {
        font-size: 20rpx;
        padding-left: 20rpx;
      }
      .cart_com_price {
        width: 420rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20rpx;
        .cart_com_price_p {
          font-size: 32rpx;
          color: red;
          padding-left: 20rpx;
        }
        .cart_com_price_n {
        }
      }
    }
  }
}

.bottom_submit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 700rpx;
  height: 80rpx;
  padding: 15rpx 25rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  .allPrice {
    display: flex;
    align-items: center;
    .allPrice_text {
      font-size: 30rpx;
      font-weight: 700;
      padding: 0 0 11rpx 20rpx;
    }
  }
  .submit_button {
    display: flex;
    align-items: center;
    .del_button {
      height: 70rpx;
      background-color: red;
      font-size: 28rpx;
      color: #fff;
      margin-right: 20rpx;
      border-radius: 70rpx;
    }
    .pay_button {
      height: 70rpx;
      font-size: 28rpx;
      background-color: $theme_back;
      color: #fff;
      border-radius: 70rpx;
    }
  }
}
</style>
