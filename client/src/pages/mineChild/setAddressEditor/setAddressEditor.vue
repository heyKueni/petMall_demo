<template>
  <view class="header">
    <a-headerNormal>
      <template v-slot:right>
        <text>{{ navigatorTitle }}</text>
      </template>
    </a-headerNormal>
  </view>
  <view class="content">
    <!-- 表单 -->
    <view class="formAddress">
      <!-- model不能和ref重名############################################### -->
      <u--form :model="addressInfo" :rules="rules" ref="addressForm">
        <!-- 收件人 -->
        <u-form-item prop="receiver" ref="item1">
          <u--input
            class="formInput"
            v-model="addressInfo.receiver"
            border="bottom"
            clearable
            placeholder="请输入收货人"
          ></u--input>
        </u-form-item>
        <!-- 电话号码 -->
        <u-form-item prop="tel" ref="item2">
          <u--input
            class="formInput"
            v-model="addressInfo.tel"
            border="bottom"
            clearable
            placeholder="请输入电话号码"
          ></u--input>
        </u-form-item>
        <!-- 地址 -->
        <u-form-item prop="address" ref="item3">
          <u--input
            class="formInput"
            v-model="addressInfo.address"
            border="bottom"
            clearable
            placeholder="请输入详细地址"
          ></u--input>
        </u-form-item>
      </u--form>
    </view>
    <!-- 按钮 -->
    <view class="buttonArea">
      <u-button class="addAddress" @tap="sendRequest">
        确定
      </u-button>
    </view>
  </view>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const navigatorTitle = ref('')
const url_aId = ref(0)
const addressInfo = reactive({
  receiver: '',
  tel: '',
  address: '',
})

onLoad((options) => {
  if (JSON.stringify(options) != '{}') {
    navigatorTitle.value = '修改地址'
    let data = { aId: options.aId }
    // 请求被修改地址数据
    proxy
      .$req({ url: '/userA/addressEditorSelect', method: 'POST', data })
      .then((res) => {
        if (res.data.code == 200) {
          addressInfo.receiver = res.data.data.receiver
          addressInfo.tel = res.data.data.tel
          addressInfo.address = res.data.data.address
          url_aId.value = options.aId
        } else {
          uni.showToast({
            title: res.data.msg,
            icon: 'error',
          })
        }
      })
  } else {
    navigatorTitle.value = '添加地址'
  }
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ form
const rules = reactive({
  receiver: {
    required: true,
    message: '请输入收货人',
    trigger: ['blur'],
  },
  tel: [
    {
      required: true,
      max: 11,
      message: '请输入手机号',
      trigger: ['blur'],
    },
    {
      // 自定义验证
      validator: (rule, value, callback) => {
        return uni.$u.test.mobile(value)
      },
      message: '号码格式错误',
      trigger: ['blur'],
    },
  ],
  address: {
    required: true,
    message: '地址不能为空',
    trigger: ['blur'],
  },
})

const sendRequest = () => {
  proxy.$refs.addressForm
    .validate()
    .then((res) => {
      // 添加地址
      if (navigatorTitle.value == '添加地址') {
        let data = { ...addressInfo }
        proxy
          .$req({ url: '/userA/addAddress', method: 'POST', data })
          .then((res) => {
            if (res.data.code == 200) {
              uni.showToast({
                title: '添加成功',
                icon: 'success',
              })
              uni.navigateBack({ delta: 1 })
            }
          })
      } else {
        // 修改地址
        let data = { aId: url_aId.value, ...addressInfo }
        proxy
          .$req({ url: '/userA/changeAddress', method: 'POST', data })
          .then((res) => {
            if (res.data.code == 200) {
              uni.showToast({
                title: res.data.msg,
                icon: 'success',
              })
              uni.navigateBack({ delta: 1 })
            } else {
              uni.showToast({
                title: res.data.msg,
                icon: 'error',
              })
            }
          })
      }
    })
    .catch((errors) => {
      console.log(errors)
      uni.showToast({
        title: '地址信息有误',
        icon: 'error',
      })
    })
}
</script>
<style lang="scss" scoped>
.formAddress {
  width: 750rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::before {
    content: '';
    display: block;
    width: 750rpx;
    height: 32rpx;
  }
  .u-form-item {
    width: 710rpx;
    .formInput {
      padding: 0 20rpx;
    }
  }
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
  // background-color: $theme_back;
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
