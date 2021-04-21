<template>
  <div class="msg-tools">
    <upload
      title="图片"
      v-model="fileUrl"
      @click.native="fileType = msgType.IMG"
    />
    <upload
      title="视频"
      icon="el-icon-video-camera"
      v-model="fileUrl"
      uploadType="video"
      @click.native="fileType = msgType.VIDEO"
    />
    <VueEmojiBox
      targetId="emojoText"
      :customEmojis="emojis"
      :customCategories="emojiCategory"
      :baseUrl="baseUrl"
      @change="bindChange"
      :visible="true"
      v-model="emojiVal"
    >
      <i slot="label" class="icon el-icon-chat-line-round" title="表情包" />
    </VueEmojiBox>
    <i @click="handleSyncMsg" class="icon el-icon-refresh-left" />
    <i
      class="icon el-icon-s-promotion"
      title="发送消息"
      @click="handleSendMsg"
    />
  </div>
</template>

<script>
import VueEmojiBox from 'vue-emoji-box'
import { MSG_TYPE, CMD } from '@/utils/websocket'
import upload from './upload'
import { mapGetters } from 'vuex'
import mixin from '../mixin'

export default {
  mixins: [mixin],
  name: 'msgTools',
  components: { VueEmojiBox, upload },
  data() {
    return {
      msgType: MSG_TYPE,
      fileType: null,
      emojiVal: null,
      fileUrl: null,
    }
  },
  watch: {
    fileUrl() {
      this.$emit('file', { url: this.fileUrl, type: this.fileType })
    },
  },
  computed: {
    ...mapGetters(['user', 'chat']),
  },
  methods: {
    bindChange(item) {
      this.$emit('selectEmoji', item.html)
    },
    handleSendMsg() {
      this.$emit('sendMsg')
    },
    // 同步一下消息
    handleSyncMsg() {
      this.$emit('syncMsg')
      switch (this.chat.cmd) {
        case CMD.SINGLE_MSG: {
          this.handleSyncFriendMsg()
          break
        }
        case CMD.ROOM_MSG: {
          this.handleSyncCommunityMsg()
          break
        }
        default: {
          console.error('无法识别的聊天对象')
          break
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.msg-tools {
  display: flex;
  align-items: center;
  justify-items: center;
  background-color: #fff;
  /deep/ .icon {
    margin: 5px 10px;
    font-size: 20px;
    color: #555;
    cursor: pointer;
  }
  /deep/ .vemoji-main {
    .vemoji-main--content {
      bottom: 32px;
    }
  }
}
</style>