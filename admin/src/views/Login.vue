<template>
  <div class="login">
    <div class="loginView">
      <p class="logo">阿尔蓝松 后台管理系统</p>
      <el-form
        ref="ruleFormRef"
        :model="loginData.form"
        :rules="rules"
        label-position="top"
        label-width="100px"
        style="max-width: 460px;"
      >
        <el-form-item label="账号">
          <el-input v-model="loginData.form.account" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginData.form.pwd" type="password" />
        </el-form-item>
      </el-form>
      <button class="submit" @click="login">登录</button>
    </div>
  </div>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()

const router = useRouter()

const loginData = reactive({
  form: {
    account: '',
    pwd: '',
  },
})

const rules = reactive({
  account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  pwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
})

// ?+++++++++++++++++++++++++++++++++++++++++++++++ submit
const login = () => {
  proxy.$axios.post('/aLogin', { ...loginData.form }).then((res) => {
    alert(res.data.msg)
    if (res.data.code == 200) {
      sessionStorage.setItem('admin_token', res.data.token)
      // 注意：axios并未定义拦截器，无法判断token（需要后续完善）
      router.push({ name: 'home' })
    }
  })
}
</script>
<style scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(254, 254, 254);
}
.loginView {
  width: 500px;
  height: auto;
  padding: 40px 0;
  border-radius: 8px;
  box-shadow: 0 5px 10px #d3d3d3;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo {
  padding: 30px 0;
  font-size: 30px;
  font-weight: 700;
  color: aquamarine;
}
.el-input {
  width: 400px;
}
.submit {
  width: 100px;
  height: 50px;
  background-color: aquamarine;
  color: white;
  border: none;
  border-radius: 3px;
  font-size: 20px;
  margin-top: 40px;
  cursor: pointer;
}
</style>
