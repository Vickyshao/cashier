'use strict'
import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use(config => {
    // loading
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.resolve(error.response)
})

function checkStatus(response, This) {
    This.$root.loading = true
        // loading
        // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        This.$root.loading = false
        return response
            // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        msg: '网络异常'
    }
}

function checkCode(res, This) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {
        This.$root.loading = false
            //请求超时
        This.$router.push({ path: '/err', query: { 'Msg': encodeURIComponent('请求超时') } })
        return
    }
    if (res.data && (res.data.Flag === -1)) {
        window.location.href = 'https://login.bthhotels.com/login/index?returnUrl=' + encodeURIComponent(window.location.href)
    } else if (res.data && (res.data.Flag === -2)) {
        This.$router.push({ path: '/err', query: { 'Msg': encodeURIComponent(res.data.Msg) } })
        return
    }

    return res
}

export default {
    post(url, data, This) {
        return axios({
            method: 'post',
            baseURL: 'http://localhost:9090',
            //baseURL: '',
            url,
            data: qs.stringify(data),
            timeout: 40000,
            headers: {
                //'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return checkStatus(response, This)
            }
        ).then(
            (res) => {
                return checkCode(res, This)
            }
        )
    },
    get(url, params) {
        return axios({
            method: 'get',
            baseURL: '',
            url,
            params, // get 请求时带的参数
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    }
}