<template>
  <div class="login">
    <div class="input">
      <myInput label="邮箱" v-model="user.email" />
    </div>
    <div class="input">
      <myInput label="密码" v-model="user.password" />
    </div>
  </div>
</template>

<script>
import myInput from '@/components/myInput'

export default {
  name: 'login',
  components: { myInput },
  data() {
    return {
      user: {
        email: null,
        password: null,
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
.login {
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