<template>
  <view class="content">
    <u-notice-bar :text="text"></u-notice-bar>
    <text>市集</text>
  </view>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '../../store'

const { page } = useStore()
const { text } = storeToRefs(page)
</script>
<style lang="scss"></style>
