<template>
  <div class="sidebar">
    <div class="m-card">
      <header>
        <el-avatar
          class="avatar"
          shape="square"
          @click.native="handleEditUser"
          :size="36"
          :src="user.avatar"
        />
        <p class="name ell1" :title="user.email">
          {{ user.uname || user.email }}
        </p>
      </header>
      <footer>
        <input
          class="search"
          v-model="search"
          type="text"
          placeholder="搜索好友..."
        />
        <i @click="handleAddFriend" class="add el-icon-circle-plus" />
      </footer>
    </div>
    <div class="m-list">
      <p class="m-list-title">我的好友</p>
      <ul class="anser">
        <li
          :class="{
            active: friend.user.email == (chat.obj.user && chat.obj.user.email),
          }"
          v-for="friend of list"
          @click="handleClickFriendList(friend, CMD.SINGLE_MSG)"
          :key="friend.user.email"
          :title="friend.user.email"
        >
          <el-avatar
            class="avatar"
            :class="{ gray: friend.user.online == 0 }"
            shape="square"
            :size="36"
            :src="friend.user.avatar"
          />
          <div class="user">
            <p class="user-name ell1">
              {{ friend.user.uname || friend.user.email }}
            </p>
            <p
              v-if="lastMsg(friend.message)"
              class="user-msg ell1"
              v-html="
                renewHtml(
                  lastMsg(friend.message).content,
                  emojiCategory,
                  emojis,
                  baseUrl
                )
              "
            ></p>
          </div>
          <!-- <p class="msg-time">
            {{
              lastMsg(friend.message) &&
              formatTime(lastMsg(friend.message).createAt)
            }}
          </p> -->
          <el-badge v-if="friend.unread" :value="friend.unread" :max="99" />
        </li>
      </ul>
      <p class="m-list-title">群组</p>
      <ul class="anser">
        <li
          :class="{
            active: comm.info.id == (chat.obj.info && chat.obj.info.id),
          }"
          v-for="comm of commList"
          @click="handleClickFriendList(comm, CMD.ROOM_MSG)"
          :key="comm.info.id"
          :title="comm.info.id"
        >
          <el-avatar
            class="avatar"
            shape="square"
            :size="36"
            :src="comm.info.icon"
          />
          <div class="user">
            <p class="user-name ell1">
              {{ comm.info.name || comm.info.id }}
            </p>
            <div v-if="lastMsg(comm.message)" class="user-msg ell1">
              <span style="color: #c9c9c9"
                >[{{ lastMsg(comm.message).userEmail }}]
              </span>
              <span
                v-html="
                  renewHtml(
                    lastMsg(comm.message).content,
                    emojiCategory,
                    emojis,
                    baseUrl
                  )
                "
              ></span>
            </div>
          </div>
          <el-badge v-if="comm.unread" :value="comm.unread" :max="99" />
        </li>
      </ul>
    </div>
    <!-- <p class="user-total">{{ onlineFriendTotal }} / {{ friend.total }}</p> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CMD } from '@/utils/websocket'
import { formatTime } from '@/utils/func'
import mixin from '../mixin'
import axios from 'axios'

export default {
  name: 'Sidebar',
  mixins: [mixin],
  data() {
    return {
      CMD,
      search: null,
      activeId: null,
      list: [],
      commList: [],
    }
  },
  watch: {
    // 监听搜索本地好友
    search(newVal) {
      this.list = {}
      for (let key in this.friend.list) {
        const u = this.friend.list[key] && this.friend.list[key].user
        if (u.email.includes(newVal) || (u.uname && u.uname.includes(newVal))) {
          this.list[key] = this.friend.list[key]
        }
      }
      if (Object.keys(this.list).length == 0) {
        this.$notify.error({
          title: '搜索好友失败',
          message: `您似乎没有添加“${newVal}”为好友`,
        })
      }
    },
  },
  computed: {
    ...mapGetters(['user', 'friend', 'community', 'chat']),
    // 统计在线好友数量
    // onlineFriendTotal() {
    //   let total = 0
    //   if (Object.keys(this.list).length > 0) {
    //     Object.keys(this.list).forEach((key) => {
    //       if (this.list[key].user.online != 0) total++
    //     })
    //   }
    //   return total
    // },
  },
  methods: {
    // 刷新好友列表
    refreshFriend() {
      // 先将list赋值为null数组，不然view视图不会被刷新
      this.list = []
      this.list = this.$store.getters.friend.list
    },
    // 刷新群列表
    refreshComm() {
      // 先将commList赋值为null数组，不然view视图不会被刷新
      this.commList = []
      this.commList = this.community.list
    },
    handleEditUser() {
      this.$emit('editUser')
    },
    handleAddFriend() {
      this.$emit('add')
    },
    // 设置当前聊天对象
    setChatObj(chatObj, cmd) {
      this.$store.dispatch('chat/setObj', chatObj)
      this.$store.dispatch('chat/setCmd', cmd)
    },
    // 点击好友列表
    handleClickFriendList(chatObj, cmd) {
      this.$emit('clickFriend')
      this.setChatObj(chatObj, cmd)
      // 设置未读消息为 0
      // 更新好友列表
      switch (cmd) {
        case CMD.SINGLE_MSG: {
          this.$store.dispatch('friend/updateUnread', {
            email: chatObj.user.email,
            unread: 0,
          })
          this.refreshFriend()
          break
        }
        case CMD.ROOM_MSG: {
          this.$store.dispatch('community/updateUnread', {
            id: chatObj.info.id,
            unread: 0,
          })
          this.refreshComm()
          break
        }
        default: {
          console.error('无法识别的消息')
        }
      }
    },
    // 好友最近一条消息
    lastMsg(list) {
      if (list && list.length > 0) {
        return list[list.length - 1]
      }
    },
    formatTime(time) {
      return formatTime(time)
    },
  },
  async created() {
    // 加载好友列表
    if (this.friend.total == 0) {
      const { data } = await this.$http.friendList()
      await this.$store.dispatch('friend/setFriend', data)
    }
    this.list = this.friend.list

    // 加载群列表
    if (this.community.total == 0) {
      const { data } = await this.$http.communityList()
      await this.$store.dispatch('community/setCommunity', data)
    }
    this.commList = this.community.list
  },
}
</script>

<style lang="scss" scoped>
.gray {
  @include gray();
}

.ell1 {
  @include ellipsis(1);
}

ul,
li {
  padding: 0;
  margin: 0;
}

.sidebar {
  height: 100%;
  float: left;
  width: 260px;
  // width: 230px;
  color: #f4f4f4;
  background-color: #2e3238;

  .m-card {
    padding: 9pt;
    border-bottom: 1px solid #24272c;

    header {
      display: flex;
      align-items: center;
    }
    footer {
      margin-top: 13px;
      display: flex;
      align-items: center;

      .search {
        padding: 0 10px;
        width: 100%;
        font-size: 9pt;
        height: 25px;
        line-height: 30px;
        border: 1px solid #eeeeee;
        border-radius: 4px;
        outline: 0;
        background-color: #eeeeee;
      }

      .add {
        padding-left: 12px;
        font-size: 25px;
        color: #eeeeee;
        cursor: pointer;
      }
    }
    .avatar,
    .name {
      vertical-align: middle;
    }

    .avatar {
      border-radius: 2px;
      cursor: pointer;
      object-fit: cover;
      flex-shrink: 0;
    }

    .name {
      margin-left: 12px;
      font-size: 1pc;
    }
  }

  .m-list {
    // height: 100%;
    // overflow: scroll;
    &-title {
      padding: 15px;
    }
    ul {
      // height: 100%;

      li {
        padding: 9pt 12px;
        border-bottom: 1px solid #292c33;
        -webkit-transition: background-color 0.1s;
        transition: background-color 0.1s;
        position: relative;

        display: flex;
        align-items: center;
        cursor: pointer;

        // .user-name,
        // .user-msg {
        //   @include ellipsis(1);
        // }

        .user {
          padding-left: 12px;
          &-name {
            font-size: 14px;
          }
          &-msg {
            font-size: 12px;
            color: #999;
            // padding-top: 2px;
            /deep/ img {
              max-height: 15px;
            }
          }
        }

        // .msg-time {
        //   font-size: 12px;
        //   color: #888888;
        //   position: absolute;
        //   top: 14px;
        //   right: 46px;
        // }

        .avatar,
        .name {
          vertical-align: middle;
          flex-shrink: 0;
        }

        .avatar {
          border-radius: 2px;
        }

        /deep/ .el-badge {
          position: absolute;
          right: 10px;
          display: flex;
          transform: scale(0.8);
          .el-badge__content {
            border: none;
          }
        }
      }

      li:hover {
        background-color: hsla(0, 0%, 100%, 0.03);
      }

      li.active {
        background-color: hsla(0, 0%, 100%, 0.1);
      }
    }
  }

  .user-total {
    margin: 5px;
    text-align: center;
    font-size: 12px;
  }
}
</style>