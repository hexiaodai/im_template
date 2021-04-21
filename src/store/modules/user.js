const state = {
    email: null,
    uname: null,
    avatar: null,
    online: null,
    token: null,
    createAt: null
}

const mutations = {
    SET_USER: (state, { key, value }) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    setUser({ commit }, data) {
        commit('SET_USER', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}