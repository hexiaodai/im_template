import { Notification } from 'element-ui'
import store from '@/store'
import { validFriend, validCommunity } from '@/utils/validate'
import { renewHtml } from 'vue-emoji-box'
import { emojiCategory, emojis } from '@/utils/emoji'
import { MSG_TYPE, LINE } from '@/utils/websocket'
import Http from '@/utils/http'

const baseUrl = '/emoji'

const Message = {
    // 点对点消息
    singleMsg: (msg) => {
        /* 判断消息是否自己发送的；
         * 给某个好友发送消息，websocket会把自己发送的消息发回给自己；
         * 防止消息发送失败造成两端消息不一致
         */
        let femail =
            store.getters.user.email == msg.userEmail ? msg.dstObj : msg.userEmail
        // 这里有bug，若好友列表未被加载，此条消息会被忽略
        // 解决方案1：将此条消息存入vuex store.dispatch('websock/unprocessedMsg', msg)
        // 解决方案2：等待好友和群列表加载完毕在发起websocket请求
        if (!validFriend(store.getters.friend.list, femail)) return
        store.dispatch('friend/pushMsg', { msg, email: femail })
        const fuser = store.getters.friend.list[femail].user
        Notification.success({
            title: '好友消息',
            dangerouslyUseHTMLString: true,
            customClass: 'notify-msg-emoji',
            message: `【${fuser.uname || fuser.email}】${renewHtml(
                msg.content,
                emojiCategory,
                emojis,
                baseUrl
            )}`,
        })
    },
    // 群消息
    roomMsg: (msg) => {
        // 这里有bug，若好友列表未被加载，此条消息会被忽略
        // 解决方案：将此条消息存入vuex store.dispatch('websock/unprocessedMsg', msg)
        // 解决方案2：等待好友和群列表加载完毕在发起websocket请求
        if (!validCommunity(store.getters.community.list, msg.dstObj)) return
        const info = store.getters.community.list[msg.dstObj].info
        Notification.success({
            title: '群消息',
            dangerouslyUseHTMLString: true,
            customClass: 'notify-msg-emoji',
            message: `【${info.name || info.id}】${renewHtml(
                msg.content,
                emojiCategory,
                emojis,
                baseUrl
            )}`,
        })
        store.dispatch('community/pushMsg', { msg, id: msg.dstObj })
    },
    // 上线消息
    onlineMsg: (msg) => {
        const fuser = store.getters.friend.list[msg.userEmail].user
        Notification.success({
            title: '上线消息',
            message: fuser.uname || fuser.email,
            position: 'top-left',
        })
        store.dispatch('friend/updateOnline', {
            email: msg.userEmail,
            online: LINE.ON,
        })
    },
    // 下线消息
    offlineMsg: (msg) => {
        const fuser = store.getters.friend.list[msg.userEmail].user
        Notification.info({
            title: '下线消息',
            message: fuser.uname || fuser.email,
            position: 'top-left',
        })
        store.dispatch('friend/updateOnline', {
            email: msg.userEmail,
            online: LINE.OFF,
        })
    },
    // 添加联系人消息（群|好友）
    addContactMsg: async (msg) => {
        console.log(msg)
        switch (msg.msgType) {
            case MSG_TYPE.ADD_FRIEND: {
                let femail =
                    store.getters.user.email == msg.userEmail ? msg.dstObj : msg.userEmail

                const { data, code } = await Http.userInfo({ email: femail })
                if (code == 0) {
                    store.dispatch('friend/addFriend', data)
                }
                break
            }
            case MSG_TYPE.ADD_COMUNITY: {
                store.dispatch('community/addCommunity', msg.dstObj)
                break
            }
            default: {
                console.error('无法识别的消息类型')
                return
            }
        }

        Notification.success({
            title: '添加联系人',
            message: msg.content,
            position: 'top-left',
        })
    }
}

export default Message