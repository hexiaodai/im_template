import axios from 'axios'
import service from '@/api'
import {
    Notification
} from 'element-ui'
import Qs from 'qs'
import store from '@/store'
import router from '@/router'

// service 循环遍历输出不同的请求方法
let instance = axios.create({
    baseURL: "/api",
    timeout: 3000,
    withCredentials: true,
})

const Http = {}; // 包裹请求方法的容器

// 请求格式/参数的统一
for (let key in service) {
    let api = service[key]; // url method
    // async 作用：避免进入回调地狱
    Http[key] = async function (
        params, // 请求参数 get：url，put，post，patch（data），delete：url
        config = {}, // 配置参数
        isFormData = false, // 标识是否是form-data请求
    ) {
        let newParams = {}
        //  content-type是否是form-data的判断
        if (params && isFormData) {
            newParams = new FormData()
            for (let i in params) {
                newParams.append(i, params[i])
            }
        } else {
            newParams = params
        }
        // 不同请求的判断
        let response = {}; // 请求的返回值
        api.method = (api.method).toLowerCase()
        if (api.method === 'put' || api.method === 'post' || api.method === 'patch') {
            try {
                newParams = config['qs'] ? Qs.stringify(newParams) : newParams
                response = await instance[api.method](api.url, newParams, config)
            } catch (err) {
                response = err
            }
        } else if (api.method === 'delete' || api.method === 'get') {
            config.params = newParams
            try {
                response = await instance[api.method](api.url, config)
            } catch (err) {
                response = err
            }
        }
        return response; // 返回响应值
    }
}

// 请求拦截器
instance.interceptors.request.use(config => {
    // 发起请求前做些什么
    if (store.getters.user) {
        config.headers['token'] = store.getters.user.token
        config.headers['email'] = store.getters.user.email
    }
    return config
}, () => {
    // 请求错误
})

// 响应拦截器
instance.interceptors.response.use(res => {
    const { data } = res
    // 请求成功
    if (data.code !== 0) {
        Notification.error({
            title: `Error Code: ${data.code}`,
            message: data.msg
        })
        return Promise.reject(new Error(data.msg || 'Error'))
    } else {
        return data
    }
}, err => {
    const { data, status } = err.response
    // 请求错误
    Notification.error({
        title: status,
        message: data
    })
    // 对响应错误做点什么
    switch (status) {
        case 401: {
            router.replace('/login')
            break
        }
    }

    return Promise.reject(err)
})

export default Http
