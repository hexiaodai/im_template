import { heartCheck, reconnect } from '@/utils/websocket'

const state = {
    // websock变量
    websock: null,
    // onmessage （监听websocket返回数据的事件）
    websockEvent: null,
    // 存放用户未及时接收到的消息（服务端推送离线消息时，前端好友列表还没有被初始化，无法将消息赋值给对应好友）
    unprocessedMsg: []
}

const mutations = {
    //申明并连接websocket，
    //在mutation也能定义websocket的一些方法，但是在vuex严格模式下，异步处理数据浏览器会抛出错误。所以只是申明了websocket
    WEBSOCKET_INIT: (state, url) => {
        state.websock = new WebSocket(url)
    },
    //将接收到的数据赋值
    WEBSOCKET_REIVE: (state, data) => {
        state.websockEvent = data
    },
    UNPROCESSED_MSG: (state, msg) => {
        state.unprocessedMsg.push(msg)
    }
}

// actions 改变状态的操作
const actions = {
    websocketInit({ commit }, url) {
        commit('WEBSOCKET_INIT', url)
        state.websock.onopen = () => {
            console.log("连接成功！")
            heartCheck.start()
        }
        state.websock.οnerrοr = (err) => {
            console.log("ws错误!")
            console.log(err)
            reconnect()
        }
        state.websock.onmessage = res => {
            commit('WEBSOCKET_REIVE', res.data)
            heartCheck.start()
        }
        state.websock.onclose = () => {
            reconnect()
        }
    },
    //发送消息
    websocketReive({ commit }, data) {
        let _msg = JSON.stringify(data)
        // console.log('send: ' + _msg)
        state.websock.send(_msg);
    },
    // 接收未被处理的websocket消息
    unprocessedMsg({ commit }, msg) {
        commit('UNPROCESSED_MSG', msg)
    }
}
export default {
    namespaced: true,
    state,
    actions,
    mutations
}