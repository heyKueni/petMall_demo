<template>
  <view class="post">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>帖子</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content myFlex" v-if="postData.post != '{}'">
      <!-- 帖子内容 -->
      <view class="cHeader">
        <view class="cAvatar">
          <u--image
            :showLoading="true"
            :src="postData.post.uAvatar"
            width="120rpx"
            height="120rpx"
            shape="circle"
          ></u--image>
        </view>
        <view class="author">
          <view class="aName">{{ postData.post.uName }}</view>
          <view class="aTime" v-if="postData.post.poCreateTime">
            {{ postData.post.poCreateTime.split('T')[0] }}
          </view>
        </view>
        <view class="star" @tap="changePostCollect">
          <!-- 未收藏样式 -->
          <u-icon
            name="star"
            color="#ffb34b"
            size="38"
            v-show="!postData.isCollect"
          ></u-icon>
          <!-- 已收藏样式 -->
          <u-icon
            name="star-fill"
            color="#ffb34b"
            size="38"
            v-show="postData.isCollect"
          ></u-icon>
        </view>
      </view>
      <view class="aTitle">{{ postData.post.poTitle }}</view>
      <view class="aContent">
        <rich-text :nodes="postData.post.poContent"></rich-text>
      </view>
    </view>
    <!-- 全部评论 -->
    <view class="cTitle">全部评论</view>
    <view v-if="postData.commentList.length">
      <view
        class="comment"
        v-for="(res, index) in postData.commentList"
        :key="res.id"
        @tap="chooseReply(res)"
      >
        <view class="left">
          <image :src="res.uAvatar" mode="aspectFill"></image>
        </view>
        <view class="right">
          <view class="top">
            <view class="name">{{ res.uName }}</view>
          </view>
          <view class="reply-box" v-if="res.pro_reply">
            <view class="item">
              <view class="username">{{ res.pro_reply_name }}</view>
              <view class="text">{{ res.pro_reply }}</view>
            </view>
          </view>
          <view class="content">{{ res.proContent }}</view>
          <view class="bottom">
            {{ res.proCreateTime.split('T')[0] }}
          </view>
        </view>
      </view>
    </view>

    <!-- 空内容提示 -->
    <view class="myEmpty" v-else>
      <u-empty
        mode="message"
        icon="http://cdn.uviewui.com/uview/empty/message.png"
        text="暂时没有留言"
      ></u-empty>
    </view>
    <!-- BLANK -->
    <view class="BLANK"></view>
    <!-- 回复窗口 -->
    <view class="reply">
      <input
        class="reply_input"
        type="text"
        :placeholder="postData.placeholder"
        v-model="postData.replyText"
      />
      <button class="reply_button" @tap="reply">发送</button>
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import useStore from '../../store'

const { proxy } = getCurrentInstance()
const { user } = useStore()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
onLoad((options) => {
  postData.poId = options.poId
  selectPostIntro()
  checkPostCollect()
})

// *--------------------------- 判断收藏状态
const checkPostCollect = () => {
  proxy
    .$req({
      url: '/petA/checkPostCollect',
      method: 'GET',
      data: { poId: postData.poId },
    })
    .then((res) => {
      console.log(res)
      if (res.data.code == 200) {
        postData.isCollect = res.data.result
        console.log(postData.isCollect)
      }
    })
}
// *--------------------------- changePostCollect
const changePostCollect = () => {
  proxy
    .$req({
      url: '/petA/changePostCollect',
      method: 'POST',
      data: { poId: postData.poId, isCollect: postData.isCollect },
    })
    .then((res) => {
      console.log(res)
      if (res.data.code == 200) {
        postData.isCollect = !postData.isCollect
      }
    })
}

// ?+++++++++++++++++++++++++++++++++++++++++++++++ postData
const postData = reactive({
  isCollect: 0,
  isOpen: false,
  poId: 0,
  post: {
    poContent: '',
  },
  commentList: [],
  replyObj: {
    pro_reply: '',
    pro_reply_name: '',
  },
  placeholder: '回复帖子',
  replyText: '',
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const selectPostIntro = () => {
  postData.commentList.length = 0
  proxy
    .$req({
      url: '/petA/selectPostIntro',
      method: 'GET',
      data: { poId: postData.poId },
    })
    .then((res) => {
      console.log(res)
      if (res.data.code == 200) {
        postData.post = { ...res.data.post }
        postData.commentList = [...res.data.list]
        postData.commentList.sort((p1, p2) => {
          return p1.proId - p2.proId
        })
      }
    })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ chooseReply
const chooseReply = (item) => {
  if (uni.getStorageSync('token')) {
    if (user.userInfo.uId != item.uId) {
      postData.placeholder = '回复@' + item.uName
      postData.replyObj.pro_reply = item.proContent
      postData.replyObj.pro_reply_name = item.uName
      console.log(postData.replyObj)
    } else {
      postData.placeholder = '回复帖子'
      postData.replyObj.pro_reply = ''
      postData.replyObj.pro_reply_name = ''
      console.log(postData.replyObj)
    }
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ reply
const reply = () => {
  if (uni.getStorageSync('token')) {
    let data = {}
    if (
      postData.replyObj.pro_reply == '' &&
      postData.replyObj.pro_reply_name == ''
    ) {
      // 单独回复帖子
      data = {
        proContent: postData.replyText,
        pro_poId: postData.poId,
      }
    } else {
      // 回复他人
      data = {
        proContent: postData.replyText,
        pro_poId: postData.poId,
        ...postData.replyObj,
      }
    }
    console.log('data', data)
    proxy.$req({ url: '/petA/replyPost', method: 'POST', data }).then((res) => {
      uni.$u.toast(res.data.msg)
      if (res.data.code == 200) {
        selectPostIntro()
        postData.replyText = ''
      }
    })
  } else {
    proxy.$uri.navigateTo({ url: '/pages/login/login' })
  }
}
</script>
<style lang="scss" scoped>
.myFlex {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cHeader {
  width: 710rpx;
  height: auto;
  padding: 40rpx 20rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
}
.author {
  padding-left: 25rpx;
  font-weight: 100;
  .aName {
    padding-top: 20rpx;
  }
  .aTime {
    padding-top: 5rpx;
    font-size: 25rpx;
  }
}
.star {
  padding-left: 40rpx;
}
.aTitle {
  border-top: 1px solid #eee;
  width: 710rpx;
  height: auto;
  padding: 40rpx 20rpx 40rpx 40rpx;
  background-color: #fff;
  font-size: 50rpx;
  font-weight: 100;
}
.aContent {
  width: 710rpx;
  height: auto;
  padding: 0 20rpx 40rpx 40rpx;
  background-color: #fff;
  font-size: 32rpx;
  font-weight: 100;
}
.aImg {
  width: 710rpx;
  height: auto;
  padding: 0 20rpx 30rpx 20rpx;
  background-color: #fff;
}
.cTitle {
  width: 710rpx;
  height: auto;
  padding: 15rpx 20rpx;
  font-weight: 600;
  font-size: 30rpx;
  background-color: #fff;
  margin-top: 30rpx;
  border-bottom: 1px solid #eee;
}
.myEmpty {
  width: 750rpx;
  height: 750rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40rpx;
}
.BLANK {
  width: 750rpx;
  height: 100rpx;
}
.reply {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 710rpx;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15rpx 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  .reply_input {
    border: 1px solid #eee;
    width: 520rpx;
    height: 60rpx;
    padding: 0 20rpx;
    border-radius: 10rpx;
    font-size: 30rpx;
  }
  .reply_button {
    background-color: $theme_back;
    width: 120rpx;
    height: 60rpx;
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 60rpx;
  }
}

.comment {
  width: 710rpx;
  height: auto;
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  .left {
    image {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background-color: #f2f2f2;
    }
  }
  .right {
    width: 615rpx;
    padding-left: 20rpx;
    font-size: 30rpx;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      .name {
        color: #5677fc;
      }
      .like {
        display: flex;
        align-items: center;
        color: #9a9a9a;
        font-size: 26rpx;
        .num {
          margin-right: 4rpx;
          color: #9a9a9a;
        }
      }
      .highlight {
        color: #5677fc;
        .num {
          color: #5677fc;
        }
      }
    }
    .content {
      padding-top: 20rpx;
      margin-bottom: 10rpx;
      &::before {
        content: '';
        display: block;
        height: 0;
      }
    }
    .reply-box {
      background-color: rgb(242, 242, 242);
      border-radius: 12rpx;
      .item {
        padding: 20rpx;
        border-bottom: solid 2rpx $u-border-color;
        .username {
          font-size: 24rpx;
          color: #999999;
        }
      }
      .all-reply {
        padding: 20rpx;
        display: flex;
        color: #5677fc;
        align-items: center;
        .more {
          margin-left: 6rpx;
        }
      }
    }
    .bottom {
      margin-top: 20rpx;
      display: flex;
      font-size: 24rpx;
      color: #9a9a9a;
      .reply {
        color: #5677fc;
        margin-left: 10rpx;
      }
    }
  }
}
</style>
