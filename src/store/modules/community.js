import { validCommunity } from '@/utils/validate'

const state = {
    list: {},
    total: 0
}

const mutations = {
    // push群消息
    PUSH_MSG: (state, { msg, id }) => {
        if (!validCommunity(state.list, id)) return
        state.list[id].message.push(msg)
    },
    // 初始化群信息
    SET_COMMUNITY: (state, list) => {
        list.forEach(info => {
            if (info.id) {
                state.list[info.id] = { info, message: [], unread: 0 }
                state.total++
            }
        })
    },
    // 添加群
    ADD_COMMUNITY: (state, id) => {
        state.list[id] = { info: { id }, message: [], unread: 0 }
    },
    // push群消息列表
    PUSH_MSG_LIST: (state, { id, list }) => {
        if (!validCommunity(state.list, id)) return
        state.list[id].message = list
    },
    // 更新群未读消息
    UPDATE_UNREAD: (state, { id, unread }) => {
        if (!validCommunity(state.list, id)) return
        state.list[id].unread = unread
    },
    // 自增 1
    UPDATE_UNREAD_AUTO: (state, id) => {
        if (!validCommunity(state.list, id)) return
        state.list[id].unread++
    }
}

const actions = {
    pushMsg({ commit }, { msg, id }) {
        commit('PUSH_MSG', { msg, id })
        commit('UPDATE_UNREAD_AUTO', id)
    },
    setCommunity({ commit }, list) {
        commit('SET_COMMUNITY', list)
    },
    addCommunity({ commit }, id) {
        commit('ADD_COMMUNITY', id)
    },
    pushMsgList({ commit }, { id, list }) {
        commit('PUSH_MSG_LIST', { id, list })
        commit('UPDATE_UNREAD', { id, unread: list.length })
    },
    updateUnread({ commit }, { id, unread }) {
        commit('UPDATE_UNREAD', { id, unread })
    },
    updateUnreadAuto({ commit }, id) {
        commit('UPDATE_UNREAD_AUTO', id)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}