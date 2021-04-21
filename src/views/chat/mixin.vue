<template></template>

<script>
import { mapGetters } from 'vuex'
import { CMD } from '@/utils/websocket'
import { renewHtml } from 'vue-emoji-box'
import { emojiCategory, emojis } from '@/utils/emoji'
import { formatTime } from '@/utils/func'

export default {
  data() {
    return {
      baseUrl: '/emoji',
      emojiCategory,
      emojis,
    }
  },
  computed: {
    ...mapGetters(['user', 'chat']),
    checkChat() {
      switch (this.chat.cmd) {
        case CMD.SINGLE_MSG: {
          return this.chat && this.chat.obj && this.chat.obj.user
        }
        case CMD.ROOM_MSG: {
          return this.chat && this.chat.obj && this.chat.obj.info
        }
      }
      return false
    },
  },
  methods: {
    // 渲染表情消息
    renewHtml,
    // 同步好友消息
    handleSyncFriendMsg() {
      if (!this.checkChat) return
      this.$http
        .friendMsgList({
          userEmail: this.user.email,
          dstObj: this.chat.obj.user.email,
        })
        .then(({ data }) => {
          this.$store.dispatch('friend/pushMsgList', {
            email: this.chat.obj.user.email,
            list: data,
          })
          this.$notify.success({
            title: '历史消息同步成功',
            message: `您与“${
              this.chat.obj.user.uname || this.chat.obj.user.email
            }”，共产生${data.length}条历史消息`,
          })
        })
    },
    // 同步群消息
    handleSyncCommunityMsg() {
      if (!this.checkChat) return
      this.$http
        .communityMsgList({
          dstObj: this.chat.obj.info.id,
        })
        .then(({ data }) => {
          this.$store.dispatch('community/pushMsgList', {
            id: this.chat.obj.info.id,
            list: data,
          })
          this.$notify.success({
            title: '历史消息同步成功',
            message: `您与“${
              this.chat.obj.info.name || this.chat.obj.info.id
            }”，共产生${data.length}条历史消息`,
          })
        })
    },
    self(msg) {
      return this.user.email == msg.userEmail
    },
    formatTime(time) {
      return formatTime(time)
    },
    // 消息在3分钟内返回true
    // time: 时间戳。3分钟内不显示消息发送的时间
    showMsgTime(time) {
      const nowTime = Date.now()
      const sec = (nowTime - time) / (1000 * 60)
      return !(sec < 3)
    },
  },
}
</script>