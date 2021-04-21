const state = {
    // 当前聊天对象
    obj: {},
    // 聊天对象类型（好友、群）
    cmd: null
}

const mutations = {
    SET_OBJ: (state, obj) => {
        state.obj = obj
    },
    SET_CMD: (state, cmd) => {
        state.cmd = cmd
    }
}

const actions = {
    setObj({ commit }, data) {
        commit('SET_OBJ', data)
    },
    setCmd({ commit }, data) {
        commit('SET_CMD', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}