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
      <!-- 轮播图 -->
      <view class="map">
        <view class="u-demo-block">
          <u-swiper
            :list="indexData.mapList"
            previousMargin="30"
            nextMargin="30"
            circular
            :autoplay="false"
            radius="5"
            bgColor="#ffffff"
            autoplay
          ></u-swiper>
        </view>
      </view>
      <!-- 链接 -->
      <view class="routerList">
        <view class="routerItem rItem1" @tap="routerTo('/pages/mall/mall')">
          <view class="routerItemFont">市集</view>
        </view>
        <view class="routerItem rItem2" @tap="routerTo('/pages/forum/forum')">
          <view class="routerItemFont">宠圈</view>
        </view>
        <view class="routerItem rItem3" @tap="routerTo('/pages/mine/mine')">
          <view class="routerItemFont">我的</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, getCurrentInstance, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const searchValue = ref('')
const indexData = reactive({
  mapList: [
    'https://cdn.uviewui.com/uview/swiper/swiper3.png',
    'https://cdn.uviewui.com/uview/swiper/swiper2.png',
    'https://cdn.uviewui.com/uview/swiper/swiper1.png',
  ],
})

onShow(() => {
  searchValue.value = ''
  // mapSelect()
})

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
// ?+++++++++++++++++++++++++++++++++++++++++++++++ routerTo
const routerTo = (u) => {
  uni.switchTab({ url: u })
}
</script>

<style lang="scss" scoped>
.map {
  padding: 20rpx 0;
  width: 750rpx;
  height: auto;
}
.routerList {
  padding: 20rpx 20rpx;
  width: 700rpx;
  height: auto;
  .routerItem {
    width: 710rpx;
    height: 240rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    position: relative;
    .routerItemFont {
      position: absolute;
      color: #fff;
      font-size: 70rpx;
      font-weight: 700;
      top: 80rpx;
      right: 40rpx;
    }
  }
}
.rItem1 {
  background-image: url('https://ts1.cn.mm.bing.net/th/id/R-C.bbc6fe46a02930c9fbea11366f9a32f3?rik=H9lADvAKaK%2b%2fcA&riu=http%3a%2f%2fi.zgjm.org%2fuploads%2fallimg%2f140118%2f1334551250-0.jpg&ehk=6RFf4rJi0vqWKGNBuj8%2fB1yvIrR3djm4d%2fN5TrSbFjY%3d&risl=&pid=ImgRaw&r=0');
  background-size: cover;
}
.rItem2 {
  background-image: url('https://img.zcool.cn/community/012e285a1ea496a8012171323c6bf1.jpg@3000w_1l_0o_100sh.jpg');
  background-size: cover;
}
.rItem3 {
  background-image: url('https://ts1.cn.mm.bing.net/th/id/R-C.f023a5aeced5d6efd73accf871d8346e?rik=%2bup0IEMPEw%2fq3A&riu=http%3a%2f%2fp9.qhimg.com%2ft017869715910fe650e.jpg&ehk=5A4w2mRLZMbmAzNiqmvmkOFEG6eQPvby7RPn6QYxJZI%3d&risl=&pid=ImgRaw&r=0');
  background-size: cover;
}
</style>
