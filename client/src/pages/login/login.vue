<template>
  <view class="content">
    <a-headerNormal>
      <template v-slot:left>
        <text>
          {{ pageState.emailLogin ? '邮箱登录注册' : '密码登录' }}
        </text>
      </template>
      <template v-slot:right>
        <text @tap="loginTypeChange">
          {{ pageState.emailLogin ? '密码登录' : '邮箱登录' }}
        </text>
      </template>
    </a-headerNormal>
    <view class="login-header">
      <view class="left-paw">
        <view
          class="paw"
          :class="[pageState.emailLogin ? 'cat-paw' : 'dog-paw']"
        ></view>
        <view
          class="paw"
          :class="[pageState.emailLogin ? 'cat-paw' : 'dog-paw']"
        ></view>
      </view>
      <view class="right-paw">
        <view
          class="paw"
          :class="[pageState.emailLogin ? 'mouse-paw' : 'rabbit-paw']"
        ></view>
        <view
          class="paw"
          :class="[pageState.emailLogin ? 'mouse-paw' : 'rabbit-paw']"
        ></view>
      </view>
      <view class="login-title">
        <text class="login-title-text">arlanzon</text>
        <image
          class="login-title-img animal-left"
          :src="leftAnimal"
          mode="aspectFit"
        />
        <image
          class="login-title-img animal-right"
          :src="rightAnimal"
          mode="aspectFit"
        />
      </view>
    </view>
    <view class="login-window">
      <view v-if="pageState.emailLogin">
        <view class="login-input">
          <label class="login-input-label" for="checkCode">
            邮箱
          </label>
          <input
            class="input-common input-email"
            type="text"
            placeholder="请输入邮箱"
            v-model="loginEForm.email"
          />
        </view>
        <view class="login-input">
          <label class="login-input-label" for="checkCode">
            验证码
          </label>
          <input
            class="input-common input-checkCode"
            type="text"
            placeholder="请输入验证码"
            name="checkCode"
            v-model="loginEForm.checkCode"
          />
          <u-toast ref="ecToast"></u-toast>
          <u-code
            :seconds="emailCode.seconds"
            ref="ecCode"
            @change="codeChange"
          ></u-code>
          <button
            class="check-button"
            @tap="getCode"
            :disabled="emailCodeDisabled"
          >
            {{ emailCode.tips }}
          </button>
        </view>
      </view>
      <view v-if="!pageState.emailLogin">
        <view class="login-input">
          <label class="login-input-label" for="account">账号</label>
          <input
            class="input-common input-account"
            type="text"
            placeholder="请输入账号或邮箱"
            name="account"
            v-model="loginAForm.account"
          />
        </view>
        <view class="login-input">
          <label class="login-input-label" for="password">密码</label>
          <input
            class="input-common input-account"
            type="password"
            placeholder="请输入密码"
            name="password"
            v-model="loginAForm.password"
          />
        </view>
      </view>
      <u-button
        class="login-button-loginIn"
        :disabled="submitDisabled"
        @tap="submit"
      >
        <text v-if="pageState.emailLogin">验 证 登 录</text>
        <text v-if="!pageState.emailLogin">登 录</text>
      </u-button>
      <view class="loginA-tips">
        <u-checkbox-group>
          <u-checkbox
            class="loginA-tips-check"
            shape="square"
            size="26rpx"
            @change="
              () => {
                pageState.checked = !pageState.checked
              }
            "
            activeColor="#79a186"
            :checked="pageState.checked"
          ></u-checkbox>
        </u-checkbox-group>
        <view class="loginA-tips-text">
          <text v-if="pageState.emailLogin">
            我已阅读并同意阿尔蓝松用户协议，未注册绑定的邮箱验证成功后将自动注册
          </text>
          <text v-if="!pageState.emailLogin">
            我已阅读并同意阿尔蓝松用户协议
          </text>
        </view>
      </view>
    </view>
    <view class="login-bottom" v-if="!pageState.emailLogin">
      <navigator
        url="/pages/"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        没有账号？前往注册
      </navigator>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useStore from '@/store/index'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const { page, user } = useStore()
const { proxy } = getCurrentInstance()
const pageState = reactive({
  emailLogin: true,
  loginAnimal: {
    A_left: '../../static/icon/q-cat.png',
    A_right: '../../static/icon/q-rabbit.png',
    E_left: '../../static/icon/q-dog.png',
    E_right: '../../static/icon/q-mouse.png',
  },
  checked: false,
  submitChecked: false,
})
const leftAnimal = computed(() => {
  return pageState.emailLogin
    ? pageState.loginAnimal.E_left
    : pageState.loginAnimal.A_left
})
const rightAnimal = computed(() => {
  return pageState.emailLogin
    ? pageState.loginAnimal.E_right
    : pageState.loginAnimal.A_right
})
// *--------------------------- loginTypeChange
function loginTypeChange() {
  if (pageState.emailLogin) {
    pageState.emailLogin = false
    loginEForm.email = ''
    loginEForm.checkCode = ''
    pageState.checked = false
  } else {
    pageState.emailLogin = true
    loginAForm.account = ''
    loginAForm.password = ''
    pageState.checked = false
  }
}
// *--------------------------- onShow - back
onShow(() => {
  page.deltaChange(getCurrentPages().length)
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ login
const loginEForm = reactive({
  email: 'm18054725121@outlook.com',
  checkCode: '',
})
const loginAForm = reactive({
  account: 'm18054725121@outlook.com',
  password: '111111',
})
const submitDisabled = computed(() => {
  let state = true
  if (pageState.emailLogin && pageState.checked) {
    Object.values(loginEForm).filter((item) => {
      return item !== ''
    }).length == 2
      ? (state = false)
      : (state = true)
  } else if (!pageState.emailLogin && pageState.checked) {
    Object.values(loginAForm).filter((item) => {
      return item !== ''
    }).length == 2
      ? (state = false)
      : (state = true)
  }
  return state
})
// *--------------------------- submit - login A or E
function submit() {
  if (pageState.emailLogin) {
    // 邮箱登录注册
    let data = { ...loginEForm }
    proxy
      .$req({
        url: '/userA/loginE',
        method: 'POST',
        data,
      })
      .then((res) => {
        user.addLoginState(res.data)
        uni.$u.toast(res.data.msg)
        if (res.data.code == 200) {
          // 登录 - 前往首页
          uni.switchTab({
            url: '/pages/index/index',
          })
        } else if (res.data.code == 203) {
          // 注册 - 前往注册引导
        }
      })
  } else {
    // 密码登录
    let data = { ...loginAForm }
    uni.showLoading({
      title: '正在登录',
    })
    proxy
      .$req({
        url: '/userA/loginA',
        method: 'POST',
        data,
      })
      .then((res) => {
        console.log(res)
        uni.hideLoading()
        uni.$u.toast(res.data.msg)
        if (res.data.code == 200) {
          user.addLoginState(res.data)
          uni.switchTab({ url: '/pages/index/index' })
        }
      })
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ emailCode
const emailCode = reactive({
  tips: '获取验证码',
  seconds: 60,
})
const ecCode = ref()
const emailCodeDisabled = computed(() => {
  let emailStr = loginEForm.email
  let checkStr = /^\w+\@[A-Za-z0-9]+\.[a-z]+$/g
  if (emailStr && checkStr.test(emailStr)) {
    return false
  }
  return true
})
// *--------------------------- codeChange
function codeChange(text) {
  emailCode.tips = text
}
// *--------------------------- getCode
function getCode() {
  if (ecCode.value.canGetCode) {
    uni.showLoading({
      title: '正在获取验证码',
    })
    proxy
      .$req({
        url: '/userA/loginCode',
        method: 'POST',
        data: {
          email: loginEForm.email,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          uni.hideLoading()
          uni.$u.toast('验证码已发送')
          ecCode.value.start()
        } else {
          uni.hideLoading()
          uni.$u.toast('服务器请求异常')
        }
      })
  } else {
    uni.$u.toast('邮箱很累，冷却中...')
  }
}
</script>
<style lang="scss">
.content {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-header {
  width: inherit;
  position: relative;
  @mixin headerPaw {
    width: 220rpx;
    height: 50rpx;
    position: absolute;
    bottom: -18rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .paw {
    width: 50rpx;
    height: 30rpx;
    border-radius: 50%;
    z-index: 10;
    border: 3px solid #000;
  }
  .left-paw {
    @include headerPaw;
    padding-left: 8rpx;
    left: 0;
  }
  .right-paw {
    @include headerPaw;
    padding-right: 8rpx;
    right: 0;
  }
  .cat-paw {
    background-color: #f1ca9c;
  }
  .rabbit-paw {
    background-color: #ffffff;
  }
  .mouse-paw {
    background-color: #bad4e5;
  }
  .dog-paw {
    background-color: #fee2bd;
  }
}
.login-title {
  width: inherit;
  height: 200rpx;
  font-size: 75rpx;
  font-weight: 700;
  color: $theme_back;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #cdcdcd;
  .login-title-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .login-title-img {
    width: 190rpx;
    height: 190rpx;
  }
  .animal-left {
    position: absolute;
    bottom: -90rpx;
    left: 25rpx;
    animation: animalOut 0.8s forwards;
  }
  .animal-right {
    position: absolute;
    bottom: -90rpx;
    right: 25rpx;
    animation: animalOut 0.8s forwards;
  }
}
.login-window {
  width: 700rpx;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding-top: 80rpx;
  &::before {
    content: '';
    display: block;
    width: 750rpx;
    height: 12rpx;
  }
  .login-input {
    width: 740rpx;
    height: 85rpx;
    padding-left: 10rpx;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    .login-input-label {
      width: 80rpx;
    }
    .input-common {
      font-size: 25rpx;
      padding-left: 30rpx;
    }
    .input-email {
      width: 500rpx;
    }
    .input-checkCode {
      width: 410rpx;
      border-right: 1px solid #cdcdcd;
    }
    .input-account {
      width: 500rpx;
    }
    .check-button {
      font-size: 25rpx;
      padding-left: 5rpx;
      text-align: right;
      color: #908090;
      background-color: #ffffff00;
      &::after {
        border: none;
      }
    }
  }
  .login-button-loginIn {
    $edge: 88rpx;
    width: 700rpx;
    height: $edge;
    line-height: $edge;
    border-radius: 4px;
    background-color: $theme_back;
    color: #fff;
    margin-top: 40rpx;
    font-size: 30rpx;
  }
  .loginA-tips {
    width: 700rpx;
    padding-top: 40rpx;
    display: flex;
    align-items: flex-start;
    font-size: 24rpx;
    position: relative;
    .loginA-tips-check {
      position: absolute;
      top: 35rpx;
    }
    .loginA-tips-text {
      padding-left: 40rpx;
      color: $theme_back;
    }
  }
}
.login-bottom {
  padding-top: 50rpx;
  font-size: 28rpx;
  color: $theme_back;
  border-bottom: 1px solid #cdcdcd;
}

@keyframes animalOut {
  from {
    bottom: -90rpx;
  }
  to {
    bottom: -60rpx;
  }
}
</style>
