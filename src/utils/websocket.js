import store from '@/store'

export const CMD = {
    // 点对对点单聊，dstObg是用户邮箱
    SINGLE_MSG: 10,
    // 群聊，dstObj是群id
    ROOM_MSG: 11,
    // 系统消息
    SYS_MSG: 12,
    // 上线消息
    ONLINE_MSG: 13,
    // 下线消息
    OFFLINE_MSG: 14,
    // 心跳消息
    HEART: 0,
    // 添加联系人消息
    ADD_CONTACT_MSG: 15,
}

export const LINE = {
    ON: 1,
    OFF: 0,
}

export const MSG_TYPE = {
    // 文本样式
    TEXT: 1,
    // 图片
    IMG: 2,
    // 视频
    VIDEO: 3,
    // 表情
    EMOJI: 4,
    // 超链接
    LIKE: 5,
    // 添加好友
    ADD_FRIEND: 6,
    // 添加群
    ADD_COMUNITY: 7
}

export const WS_URL = `ws://127.0.0.1:9000/chat`
// export const WS_URL = `ws://192.168.79.179:9000/chat`

let lockReconnect = false
let tt = null

//心跳检测
export let heartCheck = {
    timeout: 1000 * 60,
    timeoutObj: null,
    serverTimeoutObj: null,
    start() {
        console.log('开始心跳检测')
        this.timeoutObj && clearTimeout(this.timeoutObj)
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
        this.timeoutObj = setInterval(() => {
            console.log('💓')
            const heartMsg = { userEmail: store.getters.user.email, cmd: CMD.HEART, content: '💓' }
            store.getters.websock.send(JSON.stringify(heartMsg))
            this.serverTimeoutObj = setTimeout(() => {
                if (store.getters.websock.readyState != 1) {
                    store.getters.websock.close()
                }
            }, this.timeout)
        }, this.timeout)
    },
}

export function reconnect() {
    if (lockReconnect) {
        return
    }
    lockReconnect = true
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt)
    tt = setTimeout(() => {
        console.log("执行断线重连...")
        store.dispatch(
            'websock/websocketInit',
            `${WS_URL}?email=${store.getters.user.email}&token=${store.getters.user.token}`
        )
        lockReconnect = false
    }, 4000)
}
