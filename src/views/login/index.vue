<template>
  <div class="page-bg">
    <div class="page-login">
      <img class="login-bg" src="../../assets/img/login_bg.jpg" />
      <div class="panel">
        <div class="content login">
          <div class="switch">
            <span :class="{ active: active === 'login' }" @click="go('login')"
              >登录</span
            >
            <span>/</span>
            <span
              :class="{ active: active === 'register' }"
              @click="go('register')"
              >注册</span
            >
          </div>
          <div class="form">
            <register v-if="active === 'register'" @changeInput="handleInput" />
            <login v-if="active === 'login'" @changeInput="handleInput" />
            <button type="submit" @click="onSubmit">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import login from './components/login'
import register from './components/register'

export default {
  name: 'Login',
  data() {
    return {
      active: 'login',
      user: {},
    }
  },
  components: { login, register },
  methods: {
    go(type) {
      this.active = type
    },
    handleInput(user) {
      this.user = user
    },
    async onSubmit() {
      const submit =
        this.active == 'login' ? this.$http.login : this.$http.register

      if (!this.user.email || !this.user.password) {
        this.$notify({
          title: '警告',
          message: '表单填写不完整',
          type: 'warning',
        })
        return
      }
      const { data, code } = await submit(this.user)
      if (code == 0) {
        this.$notify.success({
          title: '欢迎回来',
          message: data.uname || data.email,
        })

        localStorage.clear()
        this.saveUser(data)
        this.$router.push('/chat')
      }
    },

    // clearCache() {
    //   const user = {
    //     email: null,
    //     uname: null,
    //     avatar: null,
    //     online: null,
    //     token: null,
    //     createAt: null,
    //   }
    //   this.saveUser(user)
    //   localStorage.clear()
    // },

    saveUser(user) {
      for (let key in user) {
        this.$store.dispatch('user/setUser', {
          key: key,
          value: user[key],
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page-bg {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: miaowu;
  background: linear-gradient(45deg, rgb(181, 154, 254), rgb(245, 189, 253))
    fixed;
}

.page-login {
  margin: 0 auto;
  position: relative;
  width: 70rem;
  .login-bg {
    width: 70rem;
  }

  .switch span {
    color: #ccc;
    font-size: 1.4rem;
    cursor: pointer;
  }

  .switch span.active {
    color: rgb(181, 154, 254);
  }

  .panel {
    width: 30%;
    margin: 10rem 0 0;
    position: absolute;
    right: 0;
    top: 0;

    display: flex;
    justify-content: center;
  }

  .form {
    width: 12rem;
    margin: 3rem 0 0;

    button {
      font-size: 16px;
      border: none;
      outline: none;
      margin: 2.5rem 0 0;
      width: 100%;
      height: 3rem;
      border-radius: 3rem;
      background: linear-gradient(
        90deg,
        rgb(181, 154, 254),
        rgb(245, 189, 253)
      );
      box-shadow: 0 0 8px rgb(181, 154, 254);
      cursor: pointer;
      color: white;
      font-family: miaowu;
    }
    span {
      display: block;
      color: rgb(110, 89, 167);
      font-size: 0.8rem;
      cursor: pointer;
    }
  }
  #live2dcanvas {
    border: 0 !important;
  }
}
</style>