<template>
  <view class="collection">
    <view class="header">
      <a-headerNormal>
        <template v-slot:right>
          <text>我的收藏</text>
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
      <!-- 收藏内容 -->
      <view class="collectContent" v-if="!collectContent.current">
        <view
          class="collect_item"
          v-for="item in collectData.list"
          :key="item.collectCId"
        >
          <u--image
            :showLoading="true"
            :src="item.cImg"
            radius="12rpx"
            width="80px"
            height="80px"
            @tap="toComIntro(item.cId)"
          ></u--image>
          <view class="collect_item_right">
            <view class="collect_item_name" @tap="toComIntro(item.cId)">
              {{ item.cIntro_text }}
            </view>
            <view class="collect_item_bottom">
              <view class="collect_item_price">
                ¥ {{ item.cPrice.toFixed(2) }}
              </view>
              <button
                class="collect_item_button"
                @tap="delCollectCom(item.collectCId)"
              >
                删除
              </button>
            </view>
          </view>
        </view>
      </view>
      <view class="adoptView" v-else>
        <view
          class="postView"
          v-for="item in collectData.list"
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
    </view>
    <view class="empty">
      <u-empty
        v-if="!collectData.list.length"
        mode="list"
        icon="http://cdn.uviewui.com/uview/empty/list.png"
      ></u-empty>
    </view>
  </view>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()
// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
onShow(() => {
  collectRes()
})
// *--------------------------- 分段器
const collectContent = reactive({
  current: 0,
  collectContentList: [{ name: '商品' }, { name: '帖子' }],
})
const sectionChange = (index) => {
  if (index != collectContent.current) {
    collectContent.current = index
    collectRes()
  }
}
// *--------------------------- toComIntro
const toComIntro = (cId) => {
  proxy.$uri.navigateTo({
    url: '/pages/mallChild/comIntro/comIntro?cId=' + cId,
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
const collectData = reactive({
  list: [],
})
// *--------------------------- collectRes
const collectRes = () => {
  collectData.list.length = 0
  if (collectContent.current == 0) {
    proxy
      .$req({
        url: '/userA/collectRes',
        method: 'GET',
        data: { current: collectContent.current },
      })
      .then((res) => {
        if (res.data.code == 200 && res.data.result.length) {
          collectData.list = [...res.data.result]
          console.log(collectData.list)
        }
      })
  } else {
    proxy
      .$req({ url: '/userA/collectPostSelect', method: 'GET' })
      .then((res) => {
        console.log(res)
        if (res.data.code == 200 && res.data.result.length) {
          collectData.list = [...res.data.result]
          console.log(collectData.list)
        }
      })
  }
}
// *--------------------------- delCollectCom
const delCollectCom = (collectCId) => {
  proxy
    .$req({ url: '/userA/delCollectCom', method: 'POST', data: { collectCId } })
    .then((res) => {
      if (res.data.code == 200) collectRes()
      uni.$u.toast(res.data.msg)
    })
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
.collectContent {
  width: 700rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25rpx;
  .collect_item {
    width: 660rpx;
    height: auto;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2px 15rpx #eeeeee;
    display: flex;
    align-items: center;
    margin-bottom: 25rpx;
  }
  .collect_item_right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 20rpx;
    .collect_item_name {
      font-size: 24rpx;
      padding-bottom: 20rpx;
    }
  }
  .collect_item_bottom {
    width: 500rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .collect_item_price {
      color: red;
    }
    .collect_item_button {
      width: 130rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 50rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: red;
      margin: 0 20rpx 0 0;
    }
  }
}
.postView {
  width: 700rpx;
  height: auto;
  padding: 12rpx 25rpx 30rpx 25rpx;
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
  .tLike {
    display: flex;
    align-items: center;
  }
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
