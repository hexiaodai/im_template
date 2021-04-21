<template>
  <div class="register">
    <div class="input">
      <myInput label="邮箱" v-model="user.email" />
    </div>
    <div class="input">
      <myInput label="昵称" v-model="user.uname" />
    </div>
    <div class="input">
      <myInput label="密码" v-model="user.password" />
    </div>
    <div class="input">
      <myInput label="确认密码" v-model="user.password2" />
    </div>
  </div>
</template>

<script>
import myInput from '@/components/myInput'

export default {
  name: 'register',
  components: { myInput },
  data() {
    return {
      user: {
        email: null,
        uname: null,
        password: null,
        password2: null,
      },
    }
  },
  watch: {
    user: {
      handler() {
        this.$emit('changeInput', this.user)
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.register {
  .input {
    position: relative;
    opacity: 1;
    height: 2rem;
    width: 100%;
    margin: 2rem 0;
    transition: 0.4s;
  }
}
</style>