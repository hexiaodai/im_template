<template>
  <div class="chat" v-if="Object.keys(chat.obj).length">
    <cmsg-header :comm="chat.obj" />
    <cmsg :comm="chat.obj" />
  </div>
</template>

<script>
import cmsgHeader from './cmsgHeader'
import cmsg from './cmsg'
import { mapGetters } from 'vuex'

export default {
  name: 'cchat',
  components: { cmsgHeader, cmsg },
  computed: {
    ...mapGetters(['chat']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/chat.scss';
</style>