const user = {
    login: {
        method: 'post',
        url: '/user/login'
    },
    register: {
        method: 'post',
        url: '/user/register'
    },
    searchFriend: {
        method: 'get',
        url: '/user/search_friend'
    },
    editUser: {
        method: 'put',
        url: '/user/edit_user'
    },
    userInfo: {
        method: 'get',
        url: '/user/user_info'
    }
}

export default user