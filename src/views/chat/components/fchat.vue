<template>
  <div class="chat" v-if="Object.keys(chat.obj).length">
    <fmsg-header :friend="chat.obj" />
    <fmsg :friend="chat.obj" />
  </div>
</template>

<script>
import fmsgHeader from './fmsgHeader'
import fmsg from './fmsg'
import { mapGetters } from 'vuex'

export default {
  name: 'fchat',
  components: { fmsgHeader, fmsg },
  computed: {
    ...mapGetters(['chat']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/chat.scss';
</style>