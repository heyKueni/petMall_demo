<template>
  <div class="title">
    <h2>商品管理</h2>
    <el-button text :bg="false" type="primary" @click="add">
      添加商品
    </el-button>
  </div>
  <div class="tableView">
    <el-table :data="tableData.array" height="700" style="width: 100%;">
      <el-table-column prop="cId" label="编号" />
      <el-table-column prop="cImg" label="预览图">
        <template #default="scope">
          <img class="img" :src="scope.row.cImg" mode="scaleToFill" />
        </template>
      </el-table-column>
      <el-table-column prop="cName" label="名称" />
      <el-table-column prop="cCase" label="库存" />
      <el-table-column prop="cPrice" label="价格" />
      <el-table-column prop="ccName" label="分类" />
      <el-table-column prop="isGround" label="上架状态">
        <template #default="scope">
          {{ scope.row.isGround ? '已上架' : '未上架' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            text
            :bg="false"
            type="danger"
            @click="change(scope.row.cId, scope.row.isGround)"
          >
            {{ scope.row.isGround ? '下架' : '上架' }}
          </el-button>
          <el-button
            text
            :bg="false"
            type="primary"
            @click="editor(scope.row.cId)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 模态框 -->
  <div class="editorView" v-if="pageState.editorState == 1">
    <div class="editorWindow">
      <h2 class="editorTitle">
        {{ pageState.isAdd ? '添加商品' : '修改商品' }}
      </h2>
      <el-form
        ref="ruleFormRef"
        :model="tableData.editorForm"
        label-position="top"
        label-width="100px"
        style="max-width: 460px;"
      >
        <el-form-item label="预览图">
          <el-input
            v-model="tableData.editorForm.cImg"
            placeholder="请输入图片地址"
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            v-model="tableData.editorForm.cName"
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="tableData.editorForm.cIntro_text"
            placeholder="请输入商品简介"
          />
        </el-form-item>
        <el-form-item label="库存">
          <el-input
            v-model="tableData.editorForm.cCase"
            placeholder="请输入库存"
          />
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            v-model="tableData.editorForm.cPrice"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-input
            v-model="tableData.editorForm.cClass"
            placeholder="1饲料2零食3营养品4服装5玩具6床窝7洗浴8外出"
          />
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="submit">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue'

const pageState = reactive({
  editorState: 0,
  isAdd: 0,
  pageNum: 1,
})
const tableData = reactive({
  array: [],
  editorForm: {
    cName: '',
    cPrice: '',
    cCase: '',
    cClass: '',
    cIntro_text: '',
    cImg: '',
  },
  cId: 0,
})

const { proxy } = getCurrentInstance()

// ?+++++++++++++++++++++++++++++++++++++++++++++++ page init
onMounted(() => {
  adminSelectCom()
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ change
const change = (cId, isGround) => {
  proxy.$axios.post('/changeGround', { cId, isGround }).then((res) => {
    alert(res.data.msg)
    if (res.data.code == 200) {
      adminSelectCom()
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ editor
const editor = (cId) => {
  pageState.isAdd = 0
  pageState.editorState = 1
  proxy.$axios.get('/beforeChangeCom', { params: { cId } }).then((res) => {
    console.log(res)
    if (res.data.code == 200) {
      tableData.cId = res.data.data.cId
      tableData.editorForm.cName = res.data.data.cName
      tableData.editorForm.cPrice = res.data.data.cPrice
      tableData.editorForm.cCase = res.data.data.cCase
      tableData.editorForm.cClass = res.data.data.cClass
      tableData.editorForm.cIntro_text = res.data.data.cIntro_text
      tableData.editorForm.cImg = res.data.data.cImg
    } else {
      alert(res.data.msg)
    }
  })
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ add
const add = () => {
  pageState.isAdd = 1
  pageState.editorState = 1
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ submit
const submit = () => {
  if (pageState.isAdd) {
    proxy.$axios.post('/addCom', { ...tableData.editorForm }).then((res) => {
      alert(res.data.msg)
      if (res.data.code == 200) {
        pageState.editorState = 0
        adminSelectCom()
      }
    })
  } else {
    proxy.$axios
      .post('/changeCom', { cId: tableData.cId, ...tableData.editorForm })
      .then((res) => {
        alert(res.data.msg)
        if (res.data.code == 200) {
          pageState.editorState = 0
          adminSelectCom()
        }
      })
  }
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ cancel
const cancel = () => {
  pageState.editorState = 0
}
// ?+++++++++++++++++++++++++++++++++++++++++++++++ req allCom
const adminSelectCom = () => {
  tableData.array.length = 0
  proxy.$axios.get('/adminSelectCom').then((res) => {
    console.log(res)
    tableData.array = [...res.data.list]
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
  height: auto;
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
.pageOpera {
  margin: 15px 0;
  position: fixed;
  bottom: 0;
  left: 200px;
  width: calc(100vw - 200px);
  height: auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
