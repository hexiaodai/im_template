<template>
  <div id="msgBox" class="message">
    <ul>
      <li v-for="(msg, i) of friend.message" :key="i">
        <p v-if="showMsgTime(msg.createAt)" class="time">
          <span>{{ formatTime(msg.createAt) }}</span>
        </p>
        <div class="main" :class="{ self: self(msg) }">
          <el-avatar
            class="avatar"
            shape="square"
            :size="33"
            :src="friend.user.avatar"
          />
          <div
            v-if="msg.msgType == MSG_TYPE.TEXT"
            class="text"
            v-html="renewHtml(msg.content, emojiCategory, emojis, baseUrl)"
          ></div>
          <div
            class="img-msg"
            :class="{ pt3: !self(msg) }"
            v-if="msg.msgType == MSG_TYPE.IMG"
          >
            <el-image
              v-if="msg.content"
              :src="msg.content"
              style="max-width: 200px; border-radius: 4px"
              fit="cover"
              :preview-src-list="[msg.content]"
            />
          </div>
          <div
            class="video-msg"
            :class="{ pt3: !self(msg) }"
            v-if="msg.msgType == MSG_TYPE.VIDEO"
          >
            <video
              controls
              controlsList="nodownload"
              v-if="msg.content"
              :src="msg.content"
            ></video>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { MSG_TYPE } from '@/utils/websocket'
import mixin from '../mixin'

export default {
  mixins: [mixin],
  name: 'fmsg',
  data() {
    return {
      MSG_TYPE,
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  props: {
    friend: Object,
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/message.scss';
</style>