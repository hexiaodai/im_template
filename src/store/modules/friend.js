import { validFriend } from '@/utils/validate'

const state = {
    list: {},
    total: 0
}

const mutations = {
    // push好友消息
    PUSH_MSG: (state, { msg, email }) => {
        if (!validFriend(state.list, email)) return
        state.list[email].message.push(msg)
    },
    // 初始化好友信息
    SET_FRIEND: (state, list) => {
        if (!list) return
        list.forEach(user => {
            if (user.email) {
                state.list[user.email] = { user, message: [], unread: 0 }
                state.total++
            }
        })
    },
    // 添加好友
    ADD_FRIEND: (state, user) => {
        state.list[user.email] = { user, message: [], unread: 0 }
    },
    // ADD_FRIEND: (state, feamil) => {
    //     state.list[feamil] = { user: { email: feamil }, message: [], unread: 0 }
    // },
    // push好友消息列表
    PUSH_MSG_LIST: (state, { email, list }) => {
        if (!validFriend(state.list, email)) return
        state.list[email].message = list
    },
    // 更新好友在线状态
    UPDATE_ONLINE: (state, { email, online }) => {
        if (!validFriend(state.list, email)) return
        state.list[email].user.online = online
    },
    // 更新好友未读消息
    UPDATE_UNREAD: (state, { email, unread }) => {
        if (!validFriend(state.list, email)) return
        state.list[email].unread = unread
    },
    // 自增 1
    UPDATE_UNREAD_AUTO: (state, email) => {
        if (!validFriend(state.list, email)) return
        state.list[email].unread++
    }
}

const actions = {
    pushMsg({ commit }, { msg, email }) {
        commit('PUSH_MSG', { msg, email })
        commit('UPDATE_UNREAD_AUTO', email)
    },
    setFriend({ commit }, list) {
        commit('SET_FRIEND', list)
    },
    addFriend({ commit }, user) {
        commit('ADD_FRIEND', user)
    },
    pushMsgList({ commit }, { email, list }) {
        commit('PUSH_MSG_LIST', { email, list })
        commit('UPDATE_UNREAD', { email, unread: list.length })
    },
    updateOnline({ commit }, { email, online }) {
        commit('UPDATE_ONLINE', { email, online })
    },
    updateUnread({ commit }, { email, unread }) {
        commit('UPDATE_UNREAD', { email, unread })
    },
    updateUnreadAuto({ commit }, email) {
        commit('UPDATE_UNREAD_AUTO', email)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}