<template>
  <view class="content">
    <text>首页</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'
const { page } = useStore()

const { text } = storeToRefs(page)
</script>

<style lang="scss"></style>
