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
      <view class="collectContent" v-if="searchData.list.length">
        <view
          class="collect_item"
          v-for="item in searchData.list"
          :key="item.cId"
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
            </view>
          </view>
        </view>
      </view>
      <!-- 无数据 -->
      <view class="emptyView" v-else>
        <u-empty
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
const searchData = reactive({ list: [] })
// *--------------------------- req searchAll
const searchAll = async (value) => {
  searchData.list.length = 0
  await proxy
    .$req({
      url: '/userA/searchAll',
      method: 'GET',
      data: { searchValue: value },
    })
    .then((res) => {
      uni.$u.toast(res.data.msg)
      if (res.data.code == 200) {
        searchData.list = [...res.data.list]
        console.log(searchData.list)
      }
    })
}
// *--------------------------- toComIntro
const toComIntro = (cId) => {
  proxy.$uri.navigateTo({
    url: '/pages/mallChild/comIntro/comIntro?cId=' + cId,
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
.collectContent {
  width: 700rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25rpx;
}
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
</style>
