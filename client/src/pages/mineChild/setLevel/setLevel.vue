<template>
  <view class="content">
    <a-headerNormal>
      <template v-slot:right>
        <text>等级介绍</text>
      </template>
    </a-headerNormal>
    <view class="levelFrame">
      <view class="levelNormal">
        <view class="lnHead">一、什么是养宠等级？</view>
        <view class="lnHead lnIntro">
          用户在阿尔蓝松在线社区的虚拟等级,活跃度越高，等级越高。只有获得足够的经验值才能提升养宠等级。
        </view>
        <view class="lnHead" v-for="item in levelList" :key="item.id">
          <text class="lnColor">&nbsp;LV&nbsp;{{ item.id }}&nbsp;</text>
          <text>&nbsp;{{ item.name }}</text>
          <view class="lnContent">{{ item.intro }}</view>
        </view>
      </view>
      <view class="levelSpecial">
        <view class="lnHead slHead">
          二、什么是认证官、铲屎官、志愿者、医生？
        </view>
        <view class="lnHead lnIntro">
          用户在阿尔蓝松在线社区的虚拟等级，拥有特殊权限。在不同养宠等级可以申请向社区申请认证。
        </view>
      </view>
      <view class="lnHead" v-for="item in specialLevel" :key="item.id">
        <text class="lnColor">&nbsp;{{ item.sign }}&nbsp;</text>
        <text>&nbsp;{{ item.name }}</text>
        <view class="lnContent">{{ item.intro }}</view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, reactive } from 'vue'

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
const levelList = reactive([
  {
    id: 1,
    name: '养宠小白',
    intro:
      '初入社区的新人，通过签到、领养、回帖等方式可以快速获取活跃度，足够的活跃度即可脱离小白身份。',
  },
  {
    id: 2,
    name: '养宠达人',
    intro:
      '养宠经验upup，拥有足够的活跃度。相应的，回帖、签到获取的活跃度对升级来说很少。可以申请"志愿者"认证。',
  },
  {
    id: 3,
    name: '养宠专家',
    intro:
      '超高的活跃度，有资格申请"铲屎官"认证。能够达到这个等级的用户在阿尔蓝松社区已经是非常令人尊敬的养宠专家了。',
  },
  {
    id: 4,
    name: '养宠宗师',
    intro:
      '传说中存在的等级，达到这个阶段，可以说是阿尔蓝松元老级别的宗师人物。可以申请"认证官"。',
  },
])
const specialLevel = reactive([
  {
    id: 1,
    name: '铲屎官',
    intro: '成为“铲屎官意味着能够申请版主，在社区论坛开辟属于自己的宠圈。”',
    sign: 'A',
  },
  {
    id: 2,
    name: '认证官',
    intro: '成为社区管理员，对用户进行管理和引导。',
    sign: 'S',
  },
  {
    id: 3,
    name: '医生',
    intro: '由认证官审核，对养宠等级没有要求。',
    sign: 'E',
  },
  {
    id: 4,
    name: '志愿者',
    intro:
      '宠物社区志愿者，提供领养、看病、溜宠等协助和服务，社区可返给志愿者一定收益。',
    sign: 'H',
  },
])
</script>
<style lang="scss">
.levelFrame {
  width: 750rpx;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 120rpx;
  .lnHead {
    width: 700rpx;
    padding: 30rpx 0 10rpx 30rpx;
    .lnColor {
      font-weight: 600;
      color: yellow;
      background-color: $theme_back;
    }
    .lnContent {
      padding-top: 10rpx;
      color: gray;
    }
  }
  .slHead {
    padding-top: 60rpx;
  }
  .lnIntro {
    width: 700rpx;
    padding: 0 0 20rpx 30rpx;
    color: gray;
  }
}
</style>
