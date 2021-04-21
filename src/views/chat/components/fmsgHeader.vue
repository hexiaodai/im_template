<template>
  <div class="msg-header">
    <span>{{ friend.user.uname || friend.user.email }}</span>
    <span>{{ friend.user.online == 1 ? '（在线）' : '（离线）' }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'fmsgHeader',
  props: {
    friend: Object,
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.msg-header {
  text-align: center;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background: #eeeeee;
}
</style>