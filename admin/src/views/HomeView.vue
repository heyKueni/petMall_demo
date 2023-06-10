<template>
  <div class="home">
    <div class="navigator">
      <el-col :span="34">
        <h5 class="mb-2">阿尔蓝松</h5>
        <el-menu default-active="1" class="el-menu-vertical-demo" router>
          <el-menu-item index="com">
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="post">
            <span>帖子管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <div class="rightView">
      <div class="header">
        <button class="exit" @click="exit">退出登录</button>
      </div>
      <div class="routerView">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
const router = useRouter()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
onMounted(() => {
  router.push({ name: 'com' })
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ exit
const exit = () => {
  sessionStorage.removeItem('token')
  router.push({ name: 'login' })
}
</script>
<style scoped>
.home {
  width: 100%;
  height: 100vh;
  background-color: #fbfbfb;
  display: flex;
}
.navigator {
  height: 100vh;
}
.el-menu {
  width: 200px;
  height: calc(100vh - 60px);
}
.mb-2 {
  height: 60px;
  line-height: 60px;
  background-color: aquamarine;
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}
.rightView {
  width: calc(100% - 200px);
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
}
.exit {
  background-color: #fff;
  border: none;
  font-size: 24px;
  padding-right: 20px;
  cursor: pointer;
  color: aquamarine;
  font-weight: 600;
}
.routerView {
  width: 100%;
  height: auto;
}
</style>
