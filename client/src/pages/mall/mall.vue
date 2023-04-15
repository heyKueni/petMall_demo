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
      <!-- 商店菜单 -->
      <view class="u-menu-wrap">
        <!-- 商品分类 -->
        <scroll-view
          scroll-y
          scroll-with-animation
          class="u-tab-view menu-scroll-view"
          :scroll-top="mallPageState.scrollTop"
        >
          <view
            v-for="(item, index) in reqData.classifyList"
            :key="index"
            class="u-tab-item"
            :class="[mallPageState.current == index ? 'u-tab-item-active' : '']"
            :data-current="index"
            @tap.stop="swichMenu(index)"
          >
            <text class="u-line-1">{{ item.ccName }}</text>
          </view>
        </scroll-view>
        <!-- 指定分类下的商品 -->
        <block v-for="(item, index) in reqData.classifyList" :key="index">
          <scroll-view
            scroll-y
            class="right-box"
            v-if="mallPageState.current == index"
          >
            <view class="page-view">
              <view class="class-item">
                <view class="item-title">
                  <text v-if="reqData.classifyList.length != 0">
                    {{ reqData.classifyList[mallPageState.current].ccName }}
                  </text>
                </view>
                <view class="item-container">
                  <view
                    class="thumb-box"
                    v-for="item1 in reqData.comList"
                    :key="item1.cId"
                    @tap="toComIntro(item1.cId)"
                  >
                    <image class="item-menu-image" :src="item1.cImg"></image>
                    <view class="item-menu-name">{{ item1.cName }}</view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </block>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
// 搜索关键词
const searchValue = ref('')
// 集市页面数据
const mallPageState = reactive({
  scrollTop: 0, //tab标题的滚动条位置
  current: 0, // 预设当前项的值
})
const reqData = reactive({
  classifyList: [],
  comList: [],
})

onShow(() => {
  searchValue.value = ''
  selectComClassify()
  selectCommodity()
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ mall template
// *--------------------------- swichMenu @切换商品分类
const swichMenu = async (index) => {
  if (index == mallPageState.current) return
  mallPageState.current = index
  selectCommodity()
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
// ?+++++++++++++++++++++++++++++++++++++++++++++++ page router
const toComIntro = (cId) => {
  cId
    ? proxy.$uri.navigateTo({
        url: '/pages/mallChild/comIntro/comIntro?cId=' + cId,
      })
    : uni.$u.toast('cId error')
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req
// *--------------------------- select classify
const selectComClassify = () => {
  proxy
    .$req({
      url: '/mall/selectClassify',
      method: 'GET',
    })
    .then((res) => {
      if (res.data.code == 200) {
        reqData.classifyList = [...res.data.result]
      } else {
        uni.$u.toast(res.data.msg)
      }
    })
}
// *--------------------------- select commodity
const selectCommodity = () => {
  const data = { current: mallPageState.current }
  proxy
    .$req({
      url: '/mall/selectCommodity',
      method: 'POST',
      data,
    })
    .then((res) => {
      if (res.data.code == 200) {
        reqData.comList = [...res.data.result]
      } else {
        uni.$u.toast(res.data.msg)
      }
    })
}
</script>

<style lang="scss" scoped>
.u-menu-wrap {
  width: inherit;
  height: calc(100vh - 230rpx);
  display: flex;
  overflow: hidden;
}
.u-search-inner {
  background-color: rgb(234, 234, 234);
  border-radius: 100rpx;
  display: flex;
  align-items: center;
  padding: 10rpx 16rpx;
}
.u-search-text {
  font-size: 26rpx;
  color: $u-tips-color;
  margin-left: 10rpx;
}
.u-tab-view {
  width: 200rpx;
  height: 100%;
}
.u-tab-item {
  height: 110rpx;
  background: #ffffff;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #79a186;
  font-weight: 400;
  line-height: 1;
}

.u-tab-item-active {
  position: relative;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  background: #79a186;
  &::before {
    content: '';
    position: absolute;
    border-left: 4px solid yellow;
    height: 32rpx;
    left: 0;
    top: 39rpx;
  }
}
.u-tab-view {
  height: 100%;
}

.right-box {
  background-color: rgb(250, 250, 250);
}

.page-view {
  padding: 16rpx;
}

.class-item {
  margin-bottom: 30rpx;
  background-color: #fff;
  padding: 16rpx;
  border-radius: 8rpx;
}

.item-title {
  font-size: 26rpx;
  color: $u-main-color;
  font-weight: bold;
}

.item-menu-name {
  font-weight: normal;
  font-size: 24rpx;
  color: $u-main-color;
}

.item-container {
  display: flex;
  flex-wrap: wrap;
}

.thumb-box {
  width: 33.333333%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20rpx;
}

.item-menu-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}
</style>
