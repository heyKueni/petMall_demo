<template>
  <div class="title">
    <h2>帖子管理</h2>
  </div>
  <div class="tableView">
    <el-table :data="tableData.array" height="700" style="width: 100%;">
      <el-table-column prop="poId" label="编号" />
      <el-table-column prop="poTitle" label="标题" />
      <el-table-column prop="poContent" label="内容" />
      <el-table-column prop="uName" label="作者" />
      <el-table-column prop="poCreateTime" label="发帖时间" />
      <el-table-column label="封禁状态">
        <template #default="scope">
          {{ scope.row.isBanned ? '已封禁' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            text
            :bg="false"
            type="danger"
            @click="change(scope.row.poId, scope.row.isBanned)"
          >
            {{ scope.row.isBanned ? '解封' : '封禁' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

onMounted(() => {
  adminGetPost()
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ data
const pageState = reactive({
  editorState: 0,
  isAdd: 0,
})
const tableData = reactive({
  array: [],
})
// ?+++++++++++++++++++++++++++++++++++++++++++++++ change
const change = (poId, isBanned) => {
  proxy.$axios.post('/changePostState', { poId, isBanned }).then((res) => {
    alert(res.data.msg)
    if (res.data.code == 200) {
      adminGetPost()
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++
const adminGetPost = () => {
  proxy.$axios.get('/adminGetPost').then((res) => {
    if (res.data.code == 200) {
      tableData.array = [...res.data.list]
    }
  })
}
</script>
<style scoped>
.title {
  width: calc(100% - 20px);
  margin: 10px 10px 0 10px;
  background-color: #fff;
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tableView {
  width: calc(100% - 20px);
  /* padding: 20px; */
  margin: 0 10px;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.table {
  flex: 1;
  position: relative;
}
/deep/.el-table {
  position: absolute;
}
/deep/.el-table__inner-wrapper {
  height: 100%;
}
.img {
  width: 60px;
  /* height: 60px; */
}
.editorView {
  background-color: rgba(0, 0, 0, 0.3);
  width: calc(100% - 200px);
  height: calc(100% - 100px);
  position: fixed;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}
.editorWindow {
  width: 350px;
  height: auto;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.editorTitle {
  width: calc(100% - 12px);
  padding: 0 12px 10px 0;
}
.el-form {
  width: 100%;
}
.el-input {
  width: 100%;
}
</style>
