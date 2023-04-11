<template>
  <view class="header">
    <a-headerSearch></a-headerSearch>
  </view>
  <view class="content"></view>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '../../store'
</script>
<style lang="scss"></style>
