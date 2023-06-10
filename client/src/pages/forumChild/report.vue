<template>
  <view class="report">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>{{ collectContent.current ? '发表领养' : '发布帖子' }}</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content">
      <!-- BLANK -->
      <view class="blank"></view>
      <!-- 分段器 -->
      <view class="currentPicker">
        <u-subsection
          :list="collectContent.collectContentList"
          :current="collectContent.current"
          activeColor="#79a186"
          inactiveColor="#ffffff"
          bgColor="#79a186"
          @change="sectionChange"
        ></u-subsection>
      </view>
      <!-- 发表帖子 -->
      <view class="postView" v-if="collectContent.current == 0">
        <view class="labelView">标题</view>
        <input
          class="iTitle"
          type="text"
          placeholder="请输入标题"
          v-model="reportData.form.title"
        />
        <view class="labelView">内容</view>
        <a-webEdit v-model="reportData.form.content" ids="content"></a-webEdit>
      </view>
      <!-- 发表领养 -->
      <view class="postView" v-if="collectContent.current == 1">
        <u--form
          labelPosition="top"
          :model="reportData.adopt"
          :rules="reportData.rules"
          ref="rForm"
        >
          <u-form-item
            label="标题"
            prop="reportData.adopt.aTitle"
            borderBottom
            ref="item1"
          >
            <u--input
              placeholder="请输入标题"
              border="surround"
              v-model="reportData.adopt.aTitle"
            ></u--input>
          </u-form-item>
          <u-form-item
            label="预览"
            prop="reportData.adopt.aImg"
            borderBottom
            ref="item2"
          >
            <view class="aImgView" @tap="chooseImg">
              <u-empty
                mode="data"
                icon="http://cdn.uviewui.com/uview/empty/data.png"
                v-show="!reportData.adopt.aImg"
                text="点击此处选择图片"
              ></u-empty>
              <image
                :src="reportData.adopt.aImg"
                v-show="reportData.adopt.aImg"
              />
            </view>
          </u-form-item>
          <u-form-item
            label="说明"
            prop="reportData.adopt.aIntro"
            borderBottom
            ref="item1"
          >
            <u--input
              placeholder="请输入领养介绍"
              border="surround"
              v-model="reportData.adopt.aIntro"
            ></u--input>
          </u-form-item>
          <u-form-item
            label="宠物"
            prop="reportData.adopt.ad_pId"
            borderBottom
            ref="item1"
          >
            <view class="petInfoView">
              <view v-if="reportData.petList.length" @tap="open">
                <view class="flexRow">
                  <view>
                    {{ reportData.pet.pName }}#{{ reportData.pet.pId }}
                  </view>
                </view>
              </view>
              <view v-else @tap="toPetPage">
                前往注册宠物信息
              </view>
            </view>
          </u-form-item>
        </u--form>
      </view>
    </view>
    <!-- BLANK -->
    <view class="BLANK"></view>
    <!-- popup -->
    <u-popup :show="reportData.show" @close="close" @open="open" :round="10">
      <view class="popupTitle">选择待领养的宠物</view>
      <view class="popupContent">
        <view
          class="popupItem"
          v-for="item in reportData.petList"
          :key="item.pId"
          @tap="choosePet(item)"
        >
          {{ item.pName }}#{{ item.pId }}
        </view>
      </view>
    </u-popup>
    <!-- 发表按钮 -->
    <view class="reportButton" @tap="submitReport(collectContent.current)">
      确 认 发 表
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useStore from '../../store'

const { proxy } = getCurrentInstance()
const { user } = useStore()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
onShow(() => {
  selectPetOfUser()
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ 分段器
const collectContent = reactive({
  current: 0,
  collectContentList: [{ name: '帖子' }, { name: '领养' }],
})
const sectionChange = (index) => {
  if (index != collectContent.current) {
    collectContent.current = index
    reportData.form.title = ''
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ 选择图片
function chooseImg() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      reportData.adopt.aImg = res.tempFilePaths[0] // 用于更新视图
      console.log(reportData.adopt.aImg)
    },
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ 发表内容
const reportData = reactive({
  form: {
    title: '',
    content: '',
  },
  adopt: {
    aTitle: '',
    aImg: '',
    aIntro: '',
    ad_pId: 0,
  },
  pet: {},
  petList: [],
  rules: {},
  show: false,
})
const submitReport = (current) => {
  if (current == 0) {
    let check = reportData.form.title == '' || reportData.form.content == ''
    check
      ? uni.$u.toast('发表内容不能为空')
      : proxy
          .$req({
            url: '/petA/sendPost',
            method: 'POST',
            data: { ...reportData.form },
          })
          .then((res) => {
            uni.$u.toast(res.data.msg)
            if (res.data.code == 200) {
              uni.navigateBack({
                delta: 1,
              })
            }
          })
  } else {
    let haveNull = false
    for (let key in reportData.adopt) {
      if (reportData.adopt[key] == '' || reportData.adopt[key] == 0) {
        haveNull = true
      }
    }
    if (!haveNull) {
      uni.uploadFile({
        url: '/arlanzon/petA/sendAdoptPost', // 请求地址
        filePath: reportData.adopt.aImg, // 临时文件路径
        name: 'adopt', // 文件对应的key值
        header: {
          Authorization: uni.getStorageSync('token'),
        },
        formData: {
          aTitle: reportData.adopt.aTitle,
          aIntro: reportData.adopt.aIntro,
          ad_pId: reportData.adopt.ad_pId,
        },
        success: (res) => {
          // 离开页面
          const data = JSON.parse(res.data)
          uni.$u.toast(data.msg)
          uni.navigateBack({
            delta: 1,
          })
        },
      })
    } else {
      uni.$u.toast('内容不能为空')
    }
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ 请求宠物数据
const selectPetOfUser = () => {
  reportData.petList.length = 0
  proxy
    .$req({
      url: '/petA/checkPetExist',
      methods: 'GET',
      data: {
        uId: user.userInfo.uId,
      },
    })
    .then((res) => {
      if (res.data.code == 200) {
        reportData.petList = [...res.data.data]
        if (reportData.petList.length) {
          reportData.adopt.ad_pId = reportData.petList[0].pId
        }
        reportData.petList.forEach((item) => {
          if (item.pId == reportData.adopt.ad_pId) {
            reportData.pet = { ...item }
          }
        })
      }
    })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ toPetPage
const toPetPage = () => {
  proxy.$uri.navigateTo({
    url: '/pages/mineChild/pet/pet?uId=' + user.userInfo.uId,
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ popup
const open = () => {
  reportData.show = true
}
const close = () => {
  reportData.show = false
}
const choosePet = (item) => {
  reportData.pet = { ...item }
  reportData.adopt.ad_pId = item.pId
  close()
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
.reportButton {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 60rpx;
  padding: 20rpx 0;
  background-color: $theme_back;
  color: #fff;
  font-size: 40rpx;
  text-align: center;
}
.labelView {
  width: 710rpx;
  height: auto;
  padding: 10rpx 0;
}
.postView {
  width: 710rpx;
  padding: 0 20rpx;
}
.iTitle {
  width: 690rpx;
  height: 30px;
  padding: 0 10rpx;
  background-color: #fff;
  border: 1px solid #ccc;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}
.BLANK {
  width: 750rpx;
  height: 100rpx;
}
.aImgView {
  width: 710rpx;
  height: auto;
  padding: 20rpx 0;
  display: flex;
  justify-content: center;
}
.petInfoView {
  width: 670rpx;
  height: auto;
  padding: 20rpx;
  background-color: #fff;
  font-size: 28rpx;
  font-weight: 700;
  border-radius: 10rpx;
}
.flexRow {
  display: flex;
  align-items: center;
}
.popupTitle {
  width: 710rpx;
  height: auto;
  padding: 20rpx;
  font-size: 29rpx;
  font-weight: 700;
}
.popupContent {
  display: flex;
  width: 710rpx;
  height: auto;
  padding: 0 20rpx 20rpx 20rpx;
  flex-direction: column;
  align-items: center;
}
.popupItem {
  width: 680rpx;
  height: auto;
  padding: 15rpx;
  background-color: $theme_back;
  color: #fff;
  border-radius: 10rpx;
  margin-bottom: 10rpx;
}
</style>
