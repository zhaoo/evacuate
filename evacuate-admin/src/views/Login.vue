<template>
  <div class="container">
    <div v-width="400" class="form">
      <h3>疏散与救援系统 - 后台管理</h3>
      <Form
        ref="loginForm"
        :labelWidth="110"
        :model="user"
      >
        <FormItem label="用户名" prop="username">
          <template v-slot:label><i class="h-icon-user"></i> 用户名</template>
          <input type="text" v-model="user.username">
        </FormItem>
        <FormItem label="密码" icon="h-icon-complete" prop="password">
          <input type="password" v-model="user.password">
        </FormItem>
        <FormItem>
          <Button color="primary" @click="submit">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submit () {
      login(this.user).then(res => {
        if (res.code === 20000) {
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  padding-top: 15%;
  .form {
    margin: 0 auto;
    h3 {
      font-size: 18px;
      margin-bottom: 30px;
    }
  }
}
</style>
