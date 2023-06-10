<template>
  <view>
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
        <u--form
          :model="petInfo"
          :rules="rules"
          ref="addressForm"
          labelPosition="top"
        >
          <!-- 宠物昵称 -->
          <u-form-item label="昵称" prop="pName" ref="item1">
            <u--input
              class="formInput"
              v-model="petInfo.pName"
              border="bottom"
              clearable
              placeholder="请输入宠物昵称"
            ></u--input>
          </u-form-item>
          <u-form-item label="生日" prop="pBirth" ref="item2">
            <u--input
              class="formInput"
              v-model="petInfo.pBirth"
              border="bottom"
              clearable
              placeholder="请输入宠物生日 格式：2023-01-01"
            ></u--input>
          </u-form-item>
          <!-- 宠物 -->
          <u-form-item label="性别" prop="pSex" ref="item3">
            <u--input
              class="formInput"
              v-model="petInfo.pSex"
              border="bottom"
              clearable
              placeholder="请选择宠物性别 1公 0母"
            ></u--input>
          </u-form-item>
          <u-form-item label="种类" prop="pType" ref="item4">
            <u--input
              class="formInput"
              v-model="petInfo.pType"
              border="bottom"
              clearable
              placeholder="请选择宠物种类 1鼠2猪3兔4鸟5猫6狗"
            ></u--input>
          </u-form-item>
          <u-form-item label="绝育" prop="pBear" ref="item5">
            <u--input
              class="formInput"
              v-model="petInfo.pBear"
              border="bottom"
              clearable
              placeholder="宠物是否绝育 1未绝育 0已绝育"
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
  </view>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const navigatorTitle = ref('')
const url_pId = ref(0)
const petInfo = reactive({
  pName: '',
  pBirth: '',
  pSex: '',
  pBear: '',
  pType: '',
})

onLoad((options) => {
  if (JSON.stringify(options) != '{}') {
    navigatorTitle.value = '修改宠物信息'
    url_pId.value = options.pId
    // 请求被修改宠物数据
    proxy
      .$req({
        url: '/petA/petEditorSelect',
        method: 'POST',
        data: { pId: options.pId },
      })
      .then((res) => {
        if (res.data.code == 200) {
          petInfo.pName = res.data.result.pName
          petInfo.pBirth = res.data.result.pBirth
          petInfo.pSex = res.data.result.pSex
          petInfo.pBear = res.data.result.pBear
          petInfo.pType = res.data.result.pType
        } else {
          uni.showToast({
            title: res.data.msg,
            icon: 'error',
          })
        }
      })
  } else {
    navigatorTitle.value = '添加宠物'
  }
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ form
const rules = reactive({
  pName: {
    required: true,
    message: '昵称不能为空',
    trigger: ['blur'],
  },
  pBirth: {
    required: true,
    message: '生日不能为空',
    trigger: ['blur'],
  },
  pSex: {
    required: true,
    message: '性别不能为空',
    trigger: ['blur'],
  },
  pBear: {
    required: true,
    message: '绝育状态不能为空',
    trigger: ['blur'],
  },
  pType: {
    required: true,
    message: '种类不能为空',
    trigger: ['blur'],
  },
})

const sendRequest = () => {
  proxy.$refs.addressForm
    .validate()
    .then((res) => {
      // 添加宠物
      if (navigatorTitle.value == '添加宠物') {
        proxy
          .$req({ url: '/petA/addPet', method: 'POST', data: { ...petInfo } })
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
        // 修改宠物信息
        proxy
          .$req({
            url: '/petA/changePet',
            method: 'POST',
            data: { pId: url_pId.value, ...petInfo },
          })
          .then((res) => {
            uni.showToast({
              title: res.data.msg,
              icon: res.data.code == 200 ? 'success' : 'error',
            })
            if (res.data.code == 200) {
              uni.navigateBack({ delta: 1 })
            }
          })
      }
    })
    .catch((errors) => {
      console.log(errors)
      uni.showToast({
        title: '宠物信息有误',
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
