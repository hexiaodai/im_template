<template>
  <div class="msg-header">
    <span>{{ comm.info.name || comm.info.id }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'cmsgHeader',
  props: {
    comm: Object,
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