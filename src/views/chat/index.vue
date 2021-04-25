<template>
  <div class="chat-page">
    <!-- 好友列表 | 群列表 -->
    <sidebar
      ref="sidebar"
      @add="openAddfriend = true"
      @editUser="openEditUser = true"
      @clickFriend="toMsgFooter"
    />
    <!-- 聊天区域 -->
    <div class="main" v-if="Object.keys(chat.obj).length">
      <!-- 聊天区域 - 好友 -->
      <fchat v-if="chat.cmd == CMD.SINGLE_MSG" />
      <!-- 聊天区域 - 群 -->
      <cchat v-if="chat.cmd == CMD.ROOM_MSG" />
      <!-- 发送消息区域 -->
      <div class="m-text">
        <!-- tools bar -->
        <msg-tools
          @selectEmoji="handleEmoji"
          @file="handleFile"
          @sendMsg="handleSendMsg"
          @syncMsg="refreshList"
        />
        <!-- 消息 input -->
        <textarea
          id="emojoText"
          ref="msgInput"
          class="scroll"
          wrap="hard"
          v-model="message.content"
          @keyup.ctrl.enter="handleSendMsg"
          placeholder=" ctrl + enter 发送..."
        ></textarea>
      </div>
    </div>
    <addcontact :open="openAddfriend" @close="openAddfriend = false" />
    <edit-user :open="openEditUser" @close="openEditUser = false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CMD, MSG_TYPE, WS_URL, LINE } from '@/utils/websocket'
import sidebar from './components/sidebar'
import addcontact from './components/addcontact'
import msgTools from './components/msgTools'
import editUser from './components/deitUser'
import cchat from './components/cchat.vue'
import fchat from './components/fchat.vue'
import Message from './message'
import mixin from './mixin'

export default {
  name: 'chat',
  mixins: [mixin],
  components: { sidebar, addcontact, msgTools, editUser, cchat, fchat },
  data() {
    return {
      CMD,
      LINE,
      message: {},
      cmd: CMD.SINGLE_MSG,
      msgType: MSG_TYPE.TEXT,
      openAddfriend: false,
      openEditUser: false,
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'websockEvent',
      'websock',
      'friend',
      'community',
      'chat',
    ]),
    listenChange() {
      const { user, friend, community } = this
      return { user, friend, community }
    },
  },
  watch: {
    // 监听webSocket消息
    async websockEvent(newMsg) {
      const msg = JSON.parse(newMsg)
      switch (msg.cmd) {
        // 点对点消息
        case this.CMD.SINGLE_MSG: {
          Message.singleMsg(msg)
          break
        }
        // 群消息
        case this.CMD.ROOM_MSG: {
          Message.roomMsg(msg)
          break
        }
        // 上线消息
        case this.CMD.ONLINE_MSG: {
          Message.onlineMsg(msg)
          break
        }
        // 下线消息
        case this.CMD.OFFLINE_MSG: {
          Message.offlineMsg(msg)
          break
        }
        // 添加联系人消息（群|好友）
        case this.CMD.ADD_CONTACT_MSG: {
          await Message.addContactMsg(msg)
          break
        }
        // 无法识别的消息
        default: {
          console.error(msg)
          this.$notify.error({
            title: '错误',
            message: '无法识别的消息',
          })
          return
        }
      }
      // 刷新好友列表
      this.refreshList()
      // 初始化消息结构
      this.initMsg()
      // 聊天窗口跳转至底部
      this.toMsgFooter()
    },
  },
  methods: {
    // 初始化消息结构
    initMsg() {
      this.msgType = MSG_TYPE.TEXT
      this.message = {}
    },
    // 刷新好友列表
    refreshList() {
      this.$refs.sidebar.refreshFriend()
      this.$refs.sidebar.refreshComm()
    },
    // 发送文件消息（图片、视频）
    handleFile(file) {
      const { url, type } = file
      this.msgType = type
      this.message.content = url
      this.handleSendMsg()
    },
    // 聊天窗口滚动到底部
    toMsgFooter() {
      // 等待DOM全部加装完毕
      this.$nextTick().then(() => {
        const msgDOM = window.document.getElementById('msgBox')
        if (msgDOM) msgDOM.scrollTo(0, msgDOM.scrollHeight)
      })
    },
    // 选择emoji触发该事件
    handleEmoji(content) {
      this.message.content = content
      this.$refs.msgInput.focus()
    },
    // 发送消息
    handleSendMsg() {
      if (!this.checkChat) return

      this.message.userEmail = this.user.email
      this.message.cmd = this.chat.cmd
      this.message.msgType = this.msgType
      this.message.createAt = Date.now()
      if (!this.message.content) {
        return this.$notify.warning({
          title: '警告',
          message: '笨蛋！消息是空的',
        })
      }

      switch (this.chat.cmd) {
        case this.CMD.SINGLE_MSG: {
          this.message.dstObj = this.chat.obj.user.email
          break
        }
        case this.CMD.ROOM_MSG: {
          this.message.dstObj = this.chat.obj.info.id
          break
        }
        default: {
          return console.error('无法识别的消息')
        }
      }
      this.$store.dispatch('websock/websocketReive', this.message)
      this.toMsgFooter()
    },
  },
}
</script>

<style lang="scss" scoped>
.chat-page {
  margin: 20px auto;
  width: 900px;
  height: 600px;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .main {
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: #eee;

    .m-text {
      position: absolute;
      width: 100%;
      height: 10pc;
      bottom: 0;
      left: 0;
      right: 0;

      textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: 0;
        font-family: Micrsofot Yahei;
        resize: none;
      }

      .send-btn {
        position: absolute;
        margin: 20px;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>