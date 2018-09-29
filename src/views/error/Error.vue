<template>
    <div class="abnormal">
      <!--移动-->
      <div class="abnormal_h5" :class="{'abnormal_PC':isPC()}" >
          <!--头部信息-->
          <v-checkstand :title='title'></v-checkstand>
          <div class="content">
            <!--支付头部信息-->
            <div class="pay_head">
              <div class="text">
                <i class="icon-shibai iconfont"></i><span>{{mask === 4 ? '积分' : '钱包'}}支付异常，请重新尝试支付</span>
              </div>
              <div class="order_num">
                <span class="sp1">订单号：</span><span class="sp2 Arial">{{orderText.OrderNo}}</span>
              </div>
            </div>
            <!--没有查询结果-->
            <div class="no_result" v-show="this.mask === 3 || (this.mask === 4 && orderText.WalletMoney === 0)">
                <span class="icon-error iconfont"></span>
                <p>{{mask === 4 ? '积分' : '钱包'}}支付异常</p>
            </div>
            <!--支付info-->
            <div class="info">
              <div class="main" v-show="this.mask === 4 && orderText.WalletMoney > 0">
                <h3><span>钱包支付成功</span></h3>
                <div class="use">本次使用：<span class="sp1">{{orderText.WalletMoney}}</span>元</div>
                <div class="surplus">剩余金额：<span class="sp1">{{WalletMoney - orderText.WalletMoney}}</span>元</div>
              </div>
              <!--剩余待支付金额-->
              <div class="paid">剩余待支付金额：<span class="sp1">{{orderText.TotalMoney - orderText.WalletMoney}}</span><span class="sp2">元</span></div> 
              <!--按钮集合-->
              <div class="btn_box">
                <a href="javascript:;" class="btn1" @click="goPay()">重新发起支付</a>
                <a href="javascript:;" class="btn2" @click="original()">查看原订单</a>
              </div>
            </div>
          </div>
         
          <!--公共错误弹框-->
          <v-modal :prom="prom" ></v-modal>
      </div>
       <!--版权-->
          <div class="copy" v-if="isPC()">
            <!--<v-copyright :bottom="true"></v-copyright>-->
          </div> 
    </div>
</template>
<script type="text/ecmascript-6" scope>
  import CheckStand from '@/components/checkstand/CheckStand'
  import Copyright from '@/components/copyright/Copyright'
  import Modal from '@/components/modal/Modal'
  export default {
    name: 'abnormal',
    data () {
      return {
        title: '如家收银台',
        mask: '', // 值为3时钱包支付失败 ，值为4时积分支付失败，钱包支付成功
        orderText: {}, // 存放订单信息
        balance: null, // 积分折扣比例
        prom: null, // 错误提示信息
        WalletMoney: null // 用户钱包总金额
      }
    },
    created () {
      // 订单详情页接口
      this.ajaxFn()
      this.balance = this.getCookie('Balance')
    },
    mounted () {
      if (this.isPC()){
        document.getElementById('app').className = "active"
      }
      this.WalletMoney = parseInt(this.getCookie('WalletMoney'))
     // document.getElementById('app').className = "active"
    },
    methods: {
      ajaxFn:async function () {
        let params = {}
        if (this.$route.query.CashierInfoId) {
          params = {
             'orderNo': this.$route.query.CashierInfoId
          }
        } else {
          this.$router.push({'path':'/err',query:{'Msg':encodeURIComponent('必须要有订单编号')}})
          return
        }
         const res = await this.$root.http.post('/mvc/pay/QueryOrderPayDetail', params,this)
         this.mask =parseInt(this.$route.query.Mask)
         if (res.data.Flag === 1) {
              this.orderText = res.data.Data
         } else if (res.data.Flag === 0 ){
            this.$root.bool = true
            this.prom = res.data.Msg
         }
       },
       // 跳转重新支付页
       goPay () {
         let code = this.orderText.ThirdId + '_' + this.orderText.ThirdOrderNo
         this.$router.push({path: '/main', query: {'code': code}})
       },
       // 查看原订单
       original () {
         if (this.orderText.ThirdOrderUrl === '') {
            return
         }
         window.location.href = this.orderText.ThirdOrderUrl
       }
    },
    components: {
      'v-checkstand': CheckStand,
      'v-copyright': Copyright,
      'v-modal': Modal
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
  .abnormal 
    position:relative
    height:100%
    .abnormal_h5
      .content
        .pay_head
          background: #F7F7F7
          text-align:center
          .text
            padding:28px 0 10px
            i
              display:inline-block
              font-size:28px
              margin-right:14px
              color:#C0191F
            span
              display:inline-block
              font-size: 18px
              color: #C0191F
              line-height:28px
              vertical-align:top
          .order_num
            span
              display:inline-block
              font-size: 12px
              color: #535353
              line-height:16px
              margin-bottom:28px
            .sp2
              font-family:Arial
        .no_result
          margin-top:60px
          text-align:center
          margin-bottom:60px
          span
            display:inline-block
            font-size:50px
            color:#D3D3D3
          p
            margin-top:8px
            font-size: 14px
            color: #535353
            line-height: 20px
        .info
          background:#fff
          text-align:center
          .main
            padding:28px 0px 91px
            h3
              span
                display:inline-block
                font-size: 15px
                color: #7ED321
                line-height: 35px

            div
              font-size: 15px
              color: #535353
              line-height: 30px
            .use
              .sp1
                color:#C0191F
                font-family:Arial
              &.deduction
                .sp1
                  color:#B00018
            .surplus
              .sp1
                font-family:Arial
          .paid
            width:100%
            font-size: 15px
            color: #535353
            line-height:22px
            .sp1
              font-size: 20px
              color:#C0191F
              line-height: 20px
              font-weight:bold
              font-family:Arial
          .btn_box
            margin-top:16px
            a
              display:inline-block
              outline:none
              border:none
              background: #FFFFFF
              border: 1px solid #C0191F
              border-radius: 58px
              font-size: 18px
              color: #C0191F
              line-height:23px
              cursor:pointer
            .btn1
              color: #fff
              padding:10px 56px
              background:#C0191F
            .btn2
              padding:10px 66px
              margin-top:48px
    .abnormal_PC
      position:relative
      .content
        box-shadow: 0 0 10px rgba(0,0,0,0.20)
        margin-top:10px
        .pay_head
          .text
            padding:61px 0 20px 0px
            i
              font-size:40px
            span
              font-size:26px
              color:rgba(192,25,31,1)
              line-height:35px
          .order_num
            span
              display:inline-block
              font-size: 18px
              color: #535353
              line-height:24px
              margin-bottom:16px
        .no_result
          p          
            font-size: 20px
        .info
          .main
            padding 34px 0px 0px
            h3
              span
                font-size: 16px
                line-height: 35px
          .paid
            position:relative
            font-size:20px
            line-height:33px
            bottom:50px
            margin-top:145px
            .sp1
              font-size:30px
              font-family:Arial
              font-weight:bold
            div
              font-size: 16px
              color: #535353
              line-height: 30px
            .use
              .sp1
                font-size: 16px
                color:#C0191F
          .btn_box
            position:relative
            text-align:center
            bottom:55px
            font-size:20px
            a
              line-height:48px
              
            .btn1
              background: #C0191F
              margin-right:30px
              color:#fff
              height:48px
              padding-top:0px
              padding-bottom:0px
            .btn1:hover
              background: #CD474C
              transition: all .3s ease
            .btn2
              background: #fff
              color:#C0191F 
              height:48px
              padding-top:0px
              padding-bottom:0px
            .btn2:hover
              background: #FFF0F1
              transition: all .3s ease
      .copy
        position:absolute
        bottom:0px
        width:100%
</style>