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
          :list="searchContent.searchContentList"
          :current="searchContent.current"
          activeColor="#79a186"
          inactiveColor="#ffffff"
          bgColor="#79a186"
          @change="sectionChange"
        ></u-subsection>
      </view>
      <!-- 无数据 -->
      <view class="emptyView">
        <u-empty
          v-if="searchResult.length == 0"
          icon="http://cdn.uviewui.com/uview/empty/search.png"
          text="没有查询到相关内容"
          textSize="16"
        ></u-empty>
      </view>
    </view>
    <!-- 回到顶部 -->
    <view class="wrap">
      <u-back-top :scroll-top="scrollTop"></u-back-top>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { onLoad, onPageScroll } from '@dcloudio/uni-app'

const { proxy } = getCurrentInstance()
// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const searchValue = ref('')

onLoad((options) => {
  searchValue.value = options.tag
  searchAll(searchValue.value)
})

// *--------------------------- wrap to top
const scrollTop = ref(0)

onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ cpn fun
// *--------------------------- f_search
const search = () => {
  if (searchValue.value) {
    searchContent.current = 0
    searchAll(searchValue.value)
  } else {
    uni.$u.toast('搜索内容为空，喵~')
  }
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
// ?+++++++++++++++++++++++++++++++++++++++++++++++ search content
// *--------------------------- 搜索结果 数据
const searchResult = reactive([])
// *--------------------------- 分段器
const searchContent = reactive({
  current: 0,
  searchContentList: [{ name: '商品' }, { name: '帖子' }, { name: '用户' }],
})
const sectionChange = (index) => {
  searchContent.current = index
}
// *--------------------------- req searchAll
const searchAll = async (value) => {
  // console.log('触发搜索请求')
  let data = { searchValue: value }
  searchResult.length = 0
  await proxy
    .$req({ url: '/userA/searchAll', method: 'GET', data })
    .then((res) => {
      if (res.data.code == 200) {
        uni.$u.toast(res.data.msg)
      } else {
        uni.$u.toast(res.data.msg)
      }
    })
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
}
::v-deep.u-subsection--button[data-v-297fcc41] {
  height: 32px px;
  background-color: rgb(238, 238, 239);
  padding: 7rpx 3px;
  border-radius: 0;
  align-items: stretch;
}
.emptyView {
  margin-top: 320rpx;
}
</style>
