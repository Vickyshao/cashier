import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main' // 支付页
import Order from '@/views/order/Order' // 筛选页
import Error from '@/views/error/Error' // 支付异常
import Success from '@/views/success/Success' // 支付成功
import OrderDetail from '@/views/orderDetail/OrderDetail' // 订单详情页
import Search from '@/views/search/Search' // 订单详情页
import BankCard from '@/views/bankCard/BankCard' // 银行卡校验页
import BindBank from '@/views/bindBank/BindBank' // 绑定银行卡页
import Banked from '@/views/bank/Banked' // 已绑定银行卡页
import Err from '@/views/err/Err' // 公共错误页
import Browser from '@/views/browser/Browser' // 公共错误页
import Identity from '@/views/identity/Identity' // 挂房账
import Middle from '@/views/middle/Middle' // 微信支付中间页

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/main'
    },
    {// 主页
      path: '/main',
      name: 'Main',
      component: Main
    },
    {// 搜索内容页
      path: '/order',
      name: 'Order',
      component: Order
    },
    {// 支付失败页
      path: '/error',
      name: 'Error',
      component: Error
    },
    {// 支付成功页
      path: '/success',
      name: 'Success',
      component: Success
    },
    {// 订单详情页
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {// 搜索页
      path: '/search',
      name: 'Search',
      component: Search
    },
    {// 银行卡校验页
      path: '/bankCard',
      name: 'BankCard',
      component: BankCard
    },
    {// 绑定银行卡页
      path: '/bindBank',
      name: 'BindBank',
      component: BindBank
    },
    {// 已绑定银行卡页
      path: '/bank',
      name: 'Bank',
      component: Banked
    },
    {// 公共错误页
      path: '/err',
      name: 'Err',
      component: Err
    },
    {// 公共错误页
      path: '/browser',
      name: 'Browser',
      component: Browser
    },
    {// 挂房账
      path: '/identity',
      name: 'Identity',
      component: Identity
    },
    {// 微信支付中间页
      path: '/middle',
      name: 'Middle',
      component: Middle
    }
  ]
})
