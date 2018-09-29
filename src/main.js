// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import Vuex from 'vuex'
import VueLazyload from "vue-lazyload"
import http from '@/common/js/http'
import '@/common/js/base'
Vue.use(Vuex)
    // 图片懒加载
Vue.use(VueLazyload, {
    error: 'static/img/errorH5.jpg', //这个是请求失败后显示的图片
    loading: 'static/img/loading.gif', //这个是加载的loading过渡效果
    try: 2 // 这个是加载图片数量
})

//import './common/stylus/index.styl'

Vue.config.productionTip = false

let publicPath = 'http://localhost:9090' // 异步请求公共路
//let publicPath = '' // 异步请求公共路径
    /* eslint-disable no-new */

new Vue({
    el: '#app',   
    router, 
    template: '<App/>', 
    components: { App },
    data: {
        eventHub: new Vue(),
        publicPath: publicPath,
        loading: false,
        bool: false, //公共弹框显示隐藏
        http: http, //异步请求
        subNav: true // 订单列表也子导航显示隐藏
    },
    watch: {
        '$route' (to, from) {
            this.bool = false
        }
    }
})