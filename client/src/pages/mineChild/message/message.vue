<template>
  <view class="message">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>通知消息</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content">
      <!-- BLANK -->
      <view class="blank"></view>
      <!-- 分段器 -->
      <view class="currentPicker">
        <u-subsection
          :list="messageContent.messageContentList"
          :current="messageContent.current"
          activeColor="#79a186"
          inactiveColor="#ffffff"
          bgColor="#79a186"
          @change="sectionChange"
        ></u-subsection>
      </view>
      <!-- 消息内容 -->
      <view class="messageAdoptView" v-if="messageContent.current">
        <view
          class="adoptM_item"
          v-for="item in messageData.list"
          :key="item.amId"
          @tap="toAdoptIntro(item.adId, item.isAdopted)"
        >
          <view class="am_header">
            <u--image
              :showLoading="true"
              :src="item.uAvatar"
              width="120rpx"
              height="120rpx"
              shape="circle"
            ></u--image>
            <view class="am_title">{{ item.aTitle }}</view>
          </view>
          <view class="am_lw">
            <view class="lw">留言：{{ item.amContent }}</view>
            <view class="lw">电话：{{ item.amTel }}</view>
          </view>
        </view>
      </view>
      <view class="messageAdoptView" v-else>
        <view
          v-for="item in messageData.list"
          :key="item.proId"
          @tap="toPostIntro(item.pro_poId)"
        >
          <view class="itemCard">
            <view class="itemTitle">{{ item.proCreateTime }}</view>
            <view class="itemContent">
              <view class="itemCText">{{ item.proContent }}</view>
              <view class="itemCUser">{{ item.uName }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="empty">
      <u-empty
        v-if="!messageData.list.length"
        mode="list"
        icon="http://cdn.uviewui.com/uview/empty/list.png"
      ></u-empty>
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useStore from '../../../store'

const { proxy } = getCurrentInstance()
const { user } = useStore()
// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
onShow(() => {
  messageRes()
})
// *--------------------------- 分段器
const messageContent = reactive({
  current: 0,
  messageContentList: [{ name: '帖子回复' }, { name: '参与领养' }],
})
const sectionChange = (index) => {
  if (index != messageContent.current) {
    messageContent.current = index
    messageRes()
  }
}
// *--------------------------- toComIntro
const toAdoptIntro = (adId, check) => {
  if (!check) {
    proxy.$uri.navigateTo({
      url: '/pages/forumChild/adopt?adId=' + adId,
    })
  } else {
    uni.$u.toast('已结束')
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const messageData = reactive({
  list: [],
})
// *--------------------------- messageRes
const messageRes = () => {
  messageData.list.length = 0
  if (messageContent.current) {
    proxy.$req({ url: '/petA/selectMyLW' }).then((res) => {
      if (res.data.code == 200 && res.data.list.length) {
        res.data.list.forEach((item) => {
          if (item.uId) {
            messageData.list.push(item)
          }
        })
        // messageData.list = [...res.data.list]
        console.log(messageData.list)
      }
    })
  } else {
    proxy
      .$req({
        url: '/petA/selectMyReply',
        method: 'POST',
        data: { pro_reply_name: user.userInfo.uName },
      })
      .then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          messageData.list = [...res.data.list]
          // console.log(messageData.list)
        }
      })
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ toPostIntro
const toPostIntro = (poId) => {
  proxy.$uri.navigateTo({ url: '/pages/forumChild/post?poId=' + poId })
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
.messageAdoptView {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 710rpx;
  height: auto;
  padding: 20rpx;
  .adoptM_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: inherit;
    height: auto;
    .am_header {
      display: flex;
      align-items: center;
      width: 660rpx;
      height: 150rpx;
      padding: 15rpx 25rpx;
      background-color: $theme_back;
      border-radius: 10rpx;
    }
    .am_title {
      padding-left: 40rpx;
      font-size: 40rpx;
      font-weight: 100;
      color: #fff;
    }
    .am_lw {
      width: 660rpx;
      height: 100rpx;
      padding: 15rpx 25rpx;
      background-color: #fff;
      border-radius: 0 0 10rpx 10rpx;
      .lw {
        padding-bottom: 10rpx;
      }
    }
  }
}
.itemCard {
  width: 710rpx;
  height: auto;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .itemTitle {
    font-size: 28rpx;
  }
  .itemCText {
    font-size: 40rpx;
    font-weight: 100;
    padding-top: 10rpx;
  }
  .itemCUser {
    font-size: 28rpx;
    font-weight: 700;
    padding-top: 10rpx;
  }
}
</style>
