<template>
  <view class="register">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>注册</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content">
      <!-- 表单标题 -->
      <view class="register_title">
        <view class="register_logo">注 册</view>
        <view class="arlanzon">ARLANZON ···</view>
        <view class="cat">
          <u--image
            :src="pageData.animal.cat"
            width="160rpx"
            height="160rpx"
          ></u--image>
        </view>
        <view class="rabbit">
          <u--image
            :src="pageData.animal.rabbit"
            width="250rpx"
            height="250rpx"
          ></u--image>
        </view>
        <view class="pig">
          <u--image
            :src="pageData.animal.pig"
            width="80rpx"
            height="80rpx"
          ></u--image>
        </view>
      </view>
      <!-- 表单内容 -->
      <view class="register_form">
        <uni-forms
          :modelValue="registerData.form"
          ref="form"
          :rules="registerData.rules"
        >
          <uni-forms-item name="account">
            <input
              class="register_form_input"
              type="text"
              v-model="registerData.form.account"
              placeholder="请输入账号"
            />
          </uni-forms-item>
          <uni-forms-item name="pwd1">
            <input
              class="register_form_input"
              type="password"
              v-model="registerData.form.pwd1"
              placeholder="请输入密码"
            />
          </uni-forms-item>
          <uni-forms-item name="pwd2">
            <input
              class="register_form_input"
              type="password"
              v-model="registerData.form.pwd2"
              placeholder="再次输入密码"
            />
          </uni-forms-item>
          <uni-forms-item name="email">
            <input
              class="register_form_input"
              type="text"
              v-model="registerData.form.email"
              placeholder="请输入邮箱"
            />
          </uni-forms-item>
        </uni-forms>
        <view class="register_form_emailCode">
          <input
            class="register_form_emailCode_input"
            type="text"
            v-model="registerData.form.emailCode"
            placeholder="验证码"
          />
          <u-toast ref="uToast"></u-toast>
          <u-code
            :seconds="registerData.second"
            ref="uCode"
            @change="codeChange"
          ></u-code>
          <button class="register_form_emailCode_button" @tap="getCode">
            {{ registerData.tips }}
          </button>
        </view>
        <button class="register_form_button" @tap="submitForm">注 册</button>
      </view>
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import useStore from '../../store/index'

const { proxy } = getCurrentInstance()
const { user } = useStore()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const pageData = reactive({
  animal: {
    cat: '../../static/icon/q-cat.png',
    rabbit: '../../static/icon/q-rabbit.png',
    pig: '../../static/icon/q-pig.png',
  },
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ form
// *--------------------------- data
const registerData = reactive({
  form: {
    account: '19162800030',
    pwd1: '123456789',
    pwd2: '123456789',
    email: 'm19162800030@gmail.com',
    emailCode: '',
  },
  emailCode: '',
  rules: {
    account: {
      rules: [
        {
          required: true,
          errorMessage: '账号不能为空',
        },
        {
          minLength: 3,
          maxLength: 10,
          errorMessage: '长度在 3 到 10 个字符',
        },
      ],
    },
    pwd1: {
      rules: [
        {
          required: true,
          errorMessage: '密码不能为空',
        },
        {
          minLength: 9,
          maxLength: 18,
          errorMessage: '长度在 9 到 18 个字符',
        },
      ],
    },
    pwd2: {
      rules: [
        {
          required: true,
          errorMessage: '密码不能为空',
        },
        {
          validateFunction: function (rule, value, data, callback) {
            if (value != registerData.form.pwd1) {
              callback('前后密码输入不一致')
            }
            return true
          },
        },
      ],
    },
    email: {
      rules: [
        {
          required: true,
          errorMessage: '邮箱不能为空',
        },
        {
          format: 'email',
          errorMessage: '邮箱格式错误',
        },
      ],
    },
  },
  tips: '',
  second: 60,
})
// *--------------------------- emailCode
const codeChange = (text) => {
  registerData.tips = text
}
const getCode = () => {
  if (!registerData.form.email) {
    uni.$u.toast('邮箱为空')
  } else {
    if (proxy.$refs.uCode.canGetCode) {
      // 模拟向后端请求验证码
      uni.showLoading({
        title: '正在获取验证码',
      })
      setTimeout(() => {
        uni.hideLoading()
        // 这里此提示会被this.start()方法中的提示覆盖
        uni.$u.toast('验证码已发送')
        // 通知验证码组件内部开始倒计时
        proxy.$refs.uCode.start()
      }, 2000)
    } else {
      uni.$u.toast('倒计时结束后再发送')
    }
  }
}
// *--------------------------- submit
const submitForm = () => {
  proxy.$refs.form
    .validate()
    .then((res) => {
      proxy
        .$req({ url: '/userA/register', method: 'POST', data: res })
        .then((res) => {
          console.log(res)
          uni.$u.toast(res.data.msg)
          if (res.data.code == 200) {
            user.addLoginState(res.data.result)
            uni.switchTab({ url: 'pages/index/index' })
          }
        })
    })
    .catch((err) => {})
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
</script>
<style lang="scss" scoped>
.register_title {
  width: 750rpx;
  height: 350rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 160rpx;
  .register_logo {
    font-weight: 700;
    font-size: 120rpx;
    color: $theme_back;
    padding-top: 100rpx;
    z-index: 199;
  }
  .arlanzon {
    color: #c9c9c9;
    z-index: 199;
    font-weight: 700;
    padding: 10rpx 0 0 250rpx;
  }
}
.cat {
  position: absolute;
  top: 190rpx;
  left: 220rpx;
  transform: rotate(10deg);
  z-index: 101;
}
.rabbit {
  position: absolute;
  top: 100rpx;
  left: 70rpx;
  transform: rotate(-10deg);
  z-index: 100;
}
.pig {
  position: absolute;
  top: 100rpx;
  left: 540rpx;
  transform: rotate(7deg);
  z-index: 100;
}
.register_form {
  width: 700rpx;
  height: auto;
  padding: 0 25rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::after {
    content: '';
    display: block;
    width: 750rpx;
    height: 60rpx;
  }
  .register_form_input {
    width: 540rpx;
    padding: 10rpx 15rpx;
    border-bottom: 1rpx solid #dbdbdb;
    // text-align: center;
  }
  .register_form_emailCode {
    width: 590rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .register_form_emailCode_input {
      width: 270rpx;
      border-bottom: 1px solid #eeeeee;
      padding: 10rpx 20rpx;
      border-bottom: 1rpx solid #dbdbdb;
    }
    .register_form_emailCode_button {
      font-size: 28rpx;
      color: #939393;
    }
    uni-button {
      border-radius: 0;
      margin-left: 50rpx;
      &:after {
        border: none;
        border-left: 1px solid #b2b2b2;
        border-radius: 0;
      }
    }
  }

  .register_form_button {
    width: 200rpx;
    height: 70rpx;
    border-radius: 70rpx;
    line-height: 70rpx;
    color: #fff;
    background-color: $theme_back;
    margin: 0;
    font-size: 30rpx;
    margin-top: 150rpx;
  }
}
</style>
