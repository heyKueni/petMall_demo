<template>
  <view>
    <view class="header">
      <a-headerNormal>
        <template v-slot:right><text>我的宠物</text></template>
      </a-headerNormal>
    </view>
    <view class="content">
      <view><u-loading-page loadingText="加载中……"></u-loading-page></view>
      <!-- 地址为空 -->
      <view class="emptyArea" v-if="!petList.length">
        <u-empty
          mode="list"
          icon="http://cdn.uviewui.com/uview/empty/list.png"
          width="220"
          height="220"
          text="还未注册宠物信息"
          textColor="#79a186"
        ></u-empty>
      </view>
      <!-- 地址数据 @删除 @修改 -->
      <view class="listArea" v-if="petList.length">
        <u-swipe-action :autoClose="true">
          <view v-for="item in petList" :key="item.pId">
            <u-swipe-action-item :options="options" @tap="del(item.pId)">
              <view class="swipe-action u-border-top u-border-bottom">
                <view class="swipe-action__content">
                  <view class="petItem">
                    <view class="itemInfo">
                      <view class="infoName">{{ item.pName }}</view>
                      <view class="infoTel">
                        {{ item.pSex ? '公' : '母' }}{{ item.ptType }}
                        {{ item.pBirth }}
                      </view>
                      <view class="infoPet">
                        {{ item.pBear ? '未绝育' : '已绝育' }}
                      </view>
                    </view>
                    <view class="itemButton">
                      <u-icon
                        name="edit-pen"
                        color="#79a186"
                        size="28"
                        data-tag="item.aId"
                        @tap="changePet(item.pId)"
                      ></u-icon>
                    </view>
                  </view>
                </view>
              </view>
            </u-swipe-action-item>
          </view>
        </u-swipe-action>
      </view>
      <!-- 添加地址 -->
      <view class="buttonArea">
        <u-button class="addPet" @tap="addPet">添加宠物</u-button>
      </view>
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
const petList = reactive([])
onShow(() => {
  petSelect()
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ pet select
const petSelect = () => {
  petList.length = 0
  proxy
    .$req({
      url: '/petA/checkPetExist',
      methods: 'GET',
      data: {
        uId: user.userInfo.uId,
      },
    })
    .then((res) => {
      if (res.data.code == 200) {
        res.data.data.forEach((item) => {
          petList.push(item)
        })
        console.log(petList)
      }
    })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ pet delete
const options = reactive([
  { text: '删除', style: { backgroundColor: '#ef3473' } },
])
const del = (pId) => {
  console.log(pId)
  let data = { pId }
  proxy.$req({ url: '/petA/delPet', method: 'POST', data }).then((res) => {
    if (res.data.code == 200) {
      uni.showToast({
        title: res.data.msg,
        icon: 'success',
      })
      petSelect()
    } else {
      uni.showToast({
        title: res.data.msg,
        icon: 'error',
      })
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ pet editor
// *--------------------------- add
const addPet = () => {
  proxy.$uri.navigateTo({
    url: '/pages/mineChild/petEditor/petEditor',
  })
}
// *--------------------------- change
const changePet = (pId) => {
  // console.log('修改');
  proxy.$uri.navigateTo({
    url: '/pages/mineChild/petEditor/petEditor?pId=' + pId,
  })
}
</script>
<style lang="scss">
.emptyArea {
  width: 750rpx;
  height: auto;
  top: 240rpx;
  position: fixed;
}
.petItem {
  width: 725rpx;
  height: 120rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 30rpx 0 20rpx 25rpx;
  .itemButton {
    width: 80rpx;
    height: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .infoTel {
    font-size: 24rpx;
    padding: 5rpx 0 3rpx 0;
  }
  .infoPet {
    font-size: 26rpx;
    color: #84b595;
    padding-top: 5rpx;
    background-color: #fff;
  }
  &:before {
    content: '';
    display: block;
    width: 720rpx;
    position: absolute;
    left: 15rpx;
    top: 0;
    border-top: 1px solid rgb(199, 199, 199);
  }
  &:first-child:before {
    display: none;
  }
}
.u-swipe-action-item {
  width: 750rpx;
  height: 170rpx;
}
.buttonArea {
  width: 750rpx;
  height: 100rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 30rpx;
  .addPet {
    width: 700rpx;
    height: 80rpx;
    border: none;
    border-radius: 80rpx;
    background-color: $theme_back;
    color: #fff;
    font-size: 28rpx;
  }
}
</style>
