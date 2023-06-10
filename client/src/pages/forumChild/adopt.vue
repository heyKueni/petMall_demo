<template>
  <view class="adopt">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>领养</text>
        </template>
      </a-headerNormal>
    </view>
    <view class="content myFlex">
      <!-- 帖子内容 -->
      <view class="cHeader">
        <view class="cAvatar">
          <u--image
            :showLoading="true"
            :src="adoptData.post.uAvatar"
            width="120rpx"
            height="120rpx"
            shape="circle"
          ></u--image>
        </view>
        <view class="author">
          <view class="aName">{{ adoptData.post.uName }}</view>
          <view class="aTime">
            {{ adoptData.post.aCreateTime }}
          </view>
        </view>
      </view>
      <view class="aTitle">{{ adoptData.post.aTitle }}</view>
      <view class="aContent">{{ adoptData.post.aIntro }}</view>
      <view class="aImg">
        <u--image
          :showLoading="true"
          :src="adoptData.post.aImg"
          width="710rpx"
          height="710rpx"
        ></u--image>
      </view>
      <view class="petInfo">
        <view class="infoName">宠物昵称：{{ adoptData.post.pName }}</view>
        <view class="infoTel">
          {{ adoptData.post.pSex ? '公' : '母'
          }}{{ adoptData.post.ptType }} 宠物生日：{{ adoptData.post.pBirth }}
        </view>
        <view class="infoPet">
          绝育状态：{{ adoptData.post.pBear ? '未绝育' : '已绝育' }}
        </view>
      </view>
    </view>
    <!-- 全部留言 -->
    <view class="cTitle">全部留言</view>
    <view class="comment">
      <view
        class="comment_item"
        v-for="item in adoptData.comments"
        :key="item.amId"
        v-if="adoptData.comments.length"
        @tap="lookTel(item)"
      >
        <view class="ciHeader">
          <view class="ciUser">
            <view class="ciAvatar">
              <u--image
                :showLoading="true"
                :src="item.uAvatar"
                width="60rpx"
                height="60rpx"
                shape="circle"
              ></u--image>
            </view>
            <view class="ciName">{{ item.uName }}</view>
          </view>
          <view class="ciTime">{{ item.amCreateTime.split('T')[0] }}</view>
        </view>
        <view class="ciComment">{{ item.amContent }}</view>
      </view>
    </view>
    <!-- 空内容提示 -->
    <view class="myEmpty" v-if="!adoptData.comments.length">
      <u-empty
        mode="message"
        icon="http://cdn.uviewui.com/uview/empty/message.png"
        text="暂时没有留言"
      ></u-empty>
    </view>
    <!-- 回复窗口 -->
    <view class="reply">
      <button class="reply_button" @tap="leaveWord">
        留言
      </button>
    </view>
    <!-- 模态框 @发布人查看 -->
    <view class="modelView" v-if="adoptData.isOpen">
      <view class="modelBox">
        <view class="mvHeader">
          <view class="mvAvatar paddingB">
            <u--image
              :showLoading="true"
              :src="adoptData.modelObj.uAvatar"
              width="120rpx"
              height="120rpx"
              shape="circle"
            ></u--image>
          </view>
          <view class="mvName paddingB">
            {{ adoptData.modelObj.uName }}
          </view>
        </view>
        <view class="mvTel paddingB">
          联系电话： {{ adoptData.modelObj.amTel }}
        </view>
        <button class="modelButton" @tap="finishAdopt(adoptData.modelObj.uId)">
          确认选择
        </button>
        <button class="modelButton" @tap="cancel">取消</button>
      </view>
    </view>
    <!-- 模态框 @留言人查看 -->
    <view class="modelView" v-if="adoptData.isLWOpen">
      <view class="modelBox">
        <view class="lwLabel">留言</view>
        <input
          type="text"
          class="lwInput"
          v-model="adoptData.lwForm.content"
          placeholder="请输入留言"
        />
        <view class="lwLabel">电话</view>
        <input
          type="text"
          class="lwInput"
          v-model="adoptData.lwForm.tel"
          placeholder="请输入联系电话"
        />
        <button class="modelButton" @tap="lwSend">发送</button>
        <button class="modelButton" @tap="lwCancel">取消</button>
      </view>
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
  adoptIntroSelect(options.adId)
  adoptData.adId = options.adId
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ adoptData
const adoptData = reactive({
  adId: 0,
  isAuthor: false,
  isLWOpen: false,
  isOpen: false,
  post: {},
  comments: [],
  modelObj: {},
  lwForm: {
    content: '',
    tel: '',
  },
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ lookTel
const lookTel = (item) => {
  if (adoptData.isAuthor) {
    adoptData.modelObj = { ...item }
    adoptData.isOpen = true
  } else {
    console.log('不是发布人')
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ finishAdopt
const finishAdopt = (id) => {
  console.log(id)
  proxy
    .$req({
      url: '/petA/finishAdopt',
      method: 'POST',
      data: { uId: id, adId: adoptData.adId, pId: adoptData.post.pId },
    })
    .then((res) => {
      uni.$u.toast(res.data.msg)
      if (res.data.code == 200) {
        uni.switchTab({ url: '/pages/forum/forum' })
      }
    })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ cancel
const cancel = () => {
  adoptData.isOpen = false
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ leaveWord
const leaveWord = async () => {
  if (adoptData.isAuthor) {
    uni.$u.toast('发布人无需留言')
  } else {
    if (uni.getStorageSync('token') == '') {
      proxy.$uri.navigateTo({ url: '/pages/login/login' })
    } else {
      adoptData.isLWOpen = true
    }
  }
}
// *--------------------------- 发送
const lwSend = () => {
  if (!adoptData.lwForm.content || !adoptData.lwForm.tel) {
    uni.$u.toast('留言内容为空')
  } else {
    proxy
      .$req({
        url: '/petA/leaveWords',
        method: 'POST',
        data: {
          amContent: adoptData.lwForm.content,
          amTel: adoptData.lwForm.tel,
          am_adId: adoptData.post.adId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          adoptIntroSelect(adoptData.adId)
        }
        uni.$u.toast(res.data.msg)
        lwCancel()
      })
  }
}
// *--------------------------- 取消
const lwCancel = () => {
  adoptData.lwForm.content = ''
  adoptData.lwForm.tel = ''
  adoptData.isLWOpen = false
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ 数据请求
const adoptIntroSelect = (id) => {
  adoptData.comments.length = 0
  proxy
    .$req({ url: '/petA/adoptIntroSelect', data: { adId: id } })
    .then((res) => {
      if (res.data.code == 200) {
        adoptData.post = { ...res.data.post }
        adoptData.isAuthor = user.userInfo.uId == adoptData.post.uId
        res.data.messageList.forEach((item) => {
          if (item.am_adId == adoptData.adId) {
            adoptData.comments.push(item)
          }
        })
      }
    })
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
.petInfo {
  padding: 20rpx 20rpx 40rpx 20rpx;
  background-color: #fff;
  width: 710rpx;
  height: auto;
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
.comment {
  width: 710rpx;
  height: auto;
  padding: 0 20rpx;
  background-color: #fff;
  .comment_item {
    width: inherit;
    height: auto;
    padding: 20rpx 0;
    .ciHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 100;
      font-size: 28rpx;
      .ciUser {
        display: flex;
        align-items: center;
        .ciName {
          padding-left: 15rpx;
          font-weight: 100;
          font-size: 28rpx;
        }
      }
    }
    .ciComment {
      width: 710rpx;
      height: auto;
      padding: 15rpx 0;
      font-weight: 100;
    }
  }
  &::after {
    content: '';
    display: block;
    width: 700rpx;
    height: 120rpx;
  }
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
    width: 750rpx;
    height: 60rpx;
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 60rpx;
  }
}
.modelView {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.4);
  width: 750rpx;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .modelBox {
    width: 500rpx;
    height: 500rpx;
    border-radius: 10rpx;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;
    .paddingB {
      padding-bottom: 25rpx;
    }
  }
}
.modelButton {
  background-color: $theme_back;
  color: #fff;
  font-size: 30rpx;
  width: 240rpx;
  margin-top: 30rpx;
}
.lwInput {
  border: 1px solid rgb(195, 195, 195);
  margin-bottom: 20rpx;
  width: 400rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  padding: 10rpx;
}
.lwLabel {
  width: 420rpx;
  padding-bottom: 20rpx;
  font-size: 28rpx;
}
</style>
