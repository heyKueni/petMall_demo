<template>
  <view class="post">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>我的帖子</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content">
      <!-- BLANK -->
      <view class="blank"></view>
      <!-- 分段器 -->
      <view class="currentPicker">
        <u-subsection
          :list="postContent.postContentList"
          :current="postContent.current"
          activeColor="#79a186"
          inactiveColor="#ffffff"
          bgColor="#79a186"
          @change="sectionChange"
        ></u-subsection>
      </view>
      <!-- 内容 -->
      <view class="postAdoptView">
        <!-- 帖子 -->
        <view class="postView" v-if="postContent.current == 0">
          <view
            class="postView"
            v-for="item in postData.list"
            :key="item.poId"
            @tap="toIntroPost(item.poId)"
          >
            <view class="pTitle">{{ item.poTitle }}</view>
            <view class="pIntro">
              <view class="iAuthor">
                <view class="iImg">
                  <u--image
                    :showLoading="true"
                    :src="item.uAvatar"
                    width="50rpx"
                    height="50rpx"
                    @click="click"
                    shape="circle"
                  ></u--image>
                </view>
                <view class="iName">{{ item.uName }}</view>
              </view>
              <view class="iText">
                <view class="tTime">{{ item.poCreateTime.split('T')[0] }}</view>
              </view>
            </view>
          </view>
        </view>
        <!-- 领养贴 -->
        <view class="adoptView" v-else>
          <view
            class="postView"
            v-for="item in postData.list"
            :key="item.adId"
            @tap="toIntroAdopt(item.adId, item.isAdopted)"
          >
            <view class="pAdopt">领养贴</view>
            <view class="pTitle">{{ item.aTitle }}</view>
            <view class="pContent">{{ item.aIntro }}</view>
            <view class="pIntro">
              <view class="iAuthor">
                <view class="iImg">
                  <u--image
                    :showLoading="true"
                    :src="item.uAvatar"
                    width="50rpx"
                    height="50rpx"
                    @click="click"
                    shape="circle"
                  ></u--image>
                </view>
                <view class="iName">{{ item.uName }}</view>
              </view>
              <view class="iText">
                <!-- <view class="tLike">
                  <u-icon name="heart"></u-icon>
                  {{ item.lNum }}
                </view> -->
                <view class="tComment">
                  <u-icon name="chat"></u-icon>
                  {{ item.cNum === null ? 0 : item.cNum }}
                </view>
                <view class="tTime">{{ item.aCreateTime.split('T')[0] }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="empty">
      <u-empty
        v-if="!postData.list.length"
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
  postRes()
})
// *--------------------------- 分段器
const postContent = reactive({
  current: 0,
  postContentList: [{ name: '帖子' }, { name: '领养' }],
})
const sectionChange = (index) => {
  if (index != postContent.current) {
    postContent.current = index
    postRes()
  }
}
// *--------------------------- toComIntro
const toIntroAdopt = (id, check) => {
  if (!check) {
    proxy.$uri.navigateTo({ url: '/pages/forumChild/adopt?adId=' + id })
  } else {
    uni.$u.toast('已结束')
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const postData = reactive({
  list: [],
})
// *--------------------------- postRes
const postRes = () => {
  postData.list.length = 0
  if (postContent.current == 1) {
    proxy.$req({ url: '/petA/adoptSelectAll', method: 'GET' }).then((res) => {
      console.log(res)
      if (res.data.code == 200 && res.data.dbData.length) {
        res.data.dbData.forEach((item) => {
          if (item.uName == user.userInfo.uName) {
            postData.list.push(item)
          }
        })
        console.log(postData.list)
      }
    })
  } else {
    proxy.$req({ url: '/petA/postSelectOwner', method: 'GET' }).then((res) => {
      console.log(res)
      if (res.data.code == 200 && res.data.list.length) {
        res.data.list.forEach((item) => {
          if (item.uName == user.userInfo.uName) {
            postData.list.push(item)
          }
        })
        console.log(postData.list)
      }
    })
  }
}
// *--------------------------- toIntroPost
const toIntroPost = (id) => {
  proxy.$uri.navigateTo({ url: '/pages/forumChild/post?poId=' + id })
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
.postAdoptView {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 710rpx;
  height: auto;
  padding: 20rpx;
  //   background-color: #fff;
}
.postView {
  width: 700rpx;
  height: auto;
  padding: 12rpx 0 30rpx 0;
  position: relative;
  border-bottom: 1rpx solid #eee;
}
.pAdopt {
  position: absolute;
  top: 10rpx;
  right: 20rpx;
  color: red;
  font-size: 28rpx;
  font-weight: 700;
}
.pTitle {
  width: 700rpx;
  height: auto;
  padding: 28rpx 0;
  font-size: 54rpx;
  font-weight: 100;
}
.pContent {
  width: 700rpx;
  height: auto;
  padding-bottom: 28rpx;
}
.pIntro {
  padding-top: 12rpx;
  width: 700rpx;
  height: auto;
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  font-weight: 300;
}
.iAuthor {
  display: flex;
  align-items: center;
}
.iName {
  padding-left: 20rpx;
}
.iText {
  display: flex;
  align-items: center;
  .tComment {
    display: flex;
    align-items: center;
    padding-left: 24rpx;
  }
  .tTime {
    padding-left: 24rpx;
  }
}
</style>
