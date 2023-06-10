<template>
  <view>
    <view class="header">
      <a-headerSearch
        :keyWord="searchValue"
        @f_search="search"
        @f_toMine="toMine"
      >
        <template v-slot:searchInput>
          <input
            class="searchInput"
            type="text"
            placeholder="百无禁忌，喵~"
            v-model="searchValue"
          />
        </template>
      </a-headerSearch>
    </view>
    <view class="content">
      <!-- BLANK -->
      <view class="blank"></view>
      <!-- 分段器 -->
      <view class="currentPicker">
        <u-subsection
          :list="forumContent.forumContentList"
          :current="forumContent.current"
          activeColor="#79a186"
          inactiveColor="#ffffff"
          bgColor="#79a186"
          @change="sectionChange"
        ></u-subsection>
      </view>
      <!-- 帖子列表 -->
      <view class="listView">
        <!-- 帖子 -->
        <view class="adoptView" v-if="forumContent.current == 0">
          <view
            class="postView"
            v-for="item in forumData.postList"
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
        <!-- 领养 -->
        <view class="adoptView" v-else>
          <view
            class="postView"
            v-for="item in forumData.adoptList"
            :key="item.adId"
            @tap="toIntroAdopt(item.adId)"
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
                <!-- <view class="tComment">
                  <u-icon name="chat"></u-icon>
                  {{ item.cNum === null ? 0 : item.cNum }}
                </view> -->
                <view class="tTime">{{ item.aCreateTime.split('T')[0] }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 发表按钮 -->
    <view class="bPost" @tap="toReport">
      <u-icon class="bIcon" name="edit-pen" color="#fff" size="70rpx"></u-icon>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const searchValue = ref('')

onShow(() => {
  searchValue.value = ''
  forumSelect()
})
// *--------------------------- 分段器
const forumContent = reactive({
  current: 0,
  forumContentList: [{ name: '帖子' }, { name: '领养' }],
})
const sectionChange = (index) => {
  if (index != forumContent.current) {
    forumContent.current = index
  }
  forumSelect()
}

// ?+++++++++++++++++++++++++++++++++++++++++++++++ cpn fun
// *--------------------------- f_search
const search = () => {
  searchValue.value
    ? proxy.$uri.navigateTo({
        url: '/pages/search/search?tag=' + searchValue.value,
      })
    : uni.$u.toast('请输入搜索内容，喵~')
}
// *--------------------------- f_toMine
const toMine = () => {
  uni
    .switchTab({
      url: '/pages/mine/mine',
    })
    .catch((err) => {
      console.log(err)
    })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ content
const forumData = reactive({
  postList: [],
  adoptList: [],
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ toReport
const toReport = () => {
  proxy.$uri.navigateTo({
    url: '/pages/forumChild/report',
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ toIntro
// *--------------------------- toIntroAdopt
const toIntroAdopt = (id) => {
  proxy.$uri.navigateTo({ url: '/pages/forumChild/adopt?adId=' + id })
}
// *--------------------------- toIntroPost
const toIntroPost = (id) => {
  proxy.$uri.navigateTo({ url: '/pages/forumChild/post?poId=' + id })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ 数据请求
const forumSelect = () => {
  forumData.adoptList.length = 0
  forumData.postList.length = 0
  if (forumContent.current == 1) {
    proxy.$req({ url: '/petA/adoptSelectAll', method: 'GET' }).then((res) => {
      console.log(res)
      if (res.data.code == 200 && res.data.dbData.length) {
        res.data.dbData.forEach((item) => {
          if (!item.isAdopted) {
            forumData.adoptList.push(item)
          }
        })
      }
    })
  } else {
    proxy.$req({ url: '/petA/postSelectAll', method: 'GET' }).then((res) => {
      console.log(res)
      if (res.data.code == 200 && res.data.list.length) {
        res.data.list.forEach((item) => {
          if (!item.isBanned) {
            forumData.postList.push(item)
          }
        })
      }
    })
  }
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
.listView {
  width: 700rpx;
  padding: 0 25rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
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
.bPost {
  width: 120rpx;
  height: 120rpx;
  border-radius: 120rpx;
  background-color: $theme_back;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 160rpx;
  right: 30rpx;
}
</style>
