<template>
    <div class="orderDetail">
      <!--移动-->
      <div class="orderDetail_h5" :class="{'orderDetail_PC':isPC()}" >
          <!--头部信息-->
          <v-checkstand :title='title'></v-checkstand>
          <div class="borderTop"></div>
          <div class="content" :class="{'borderTopa':isPC()}">
            <!--支付金额-->
            <div class="amount">
              <div class="money" >
                <p :class="{'active':statusArr[orderNumArr.State] === '已部分退款'}">¥ {{orderNumArr.TotalMoney}}</p>
                <h4>{{statusArr[orderNumArr.State]}}</h4>
              </div>
              <div class="back" v-show="isPC()" @click="backList()">
                <i class="icon-back iconfont"></i><span>返回所有支付</span>
              </div>
              <div style="clear:both"></div>
            </div>
            <div class="scroll" ref="orderDetail">
              <div class="scroll_box" v-if="orderNumArr.OrderRefundDetail">
                <!--退款信息-->
               <div class="info refund" v-if="orderNumArr.OrderRefundDetail.RefundItems.length > 0">
               
                  <h3>退款信息</h3>
                  <ul>
                    <li class="fix">
                      <span class="sp1 fl">退款名称</span>
                      <span class="sp2 fr">{{orderNumArr.ProductName}}</span>
                    </li>
                    <li class="fix" v-if="false">
                      <span class="sp1 fl">退单编号</span>
                      <span class="sp2 Arial fr">{{orderNumArr.OrderRefundDetail[0].PayPalDataID}}</span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">{{orderNumArr.OrderRefundDetail.RefundPayTypeText}}</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.OrderRefundDetail.RefundOnlinePayMoney === 0}"><span v-if="orderNumArr.OrderRefundDetail.RefundOnlinePayMoney !==0">￥</span>{{orderNumArr.OrderRefundDetail.RefundOnlinePayMoney === 0 ? '-' : orderNumArr.OrderRefundDetail.RefundOnlinePayMoney}}</i></span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">退积分</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.OrderRefundDetail.RefundIntegralMoney === 0}">{{orderNumArr.OrderRefundDetail.RefundIntegralMoney === 0 ? '-' : orderNumArr.OrderRefundDetail.RefundIntegralMoney}}</i><span v-if="orderNumArr.OrderRefundDetail.RefundIntegralMoney !== 0 ">积分</span></span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">退钱包金额</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.OrderRefundDetail.RefundWalletMoney === 0}">{{orderNumArr.OrderRefundDetail.RefundWalletMoney === 0 ? '-' : orderNumArr.OrderRefundDetail.RefundWalletMoney}}</i><span v-if="orderNumArr.OrderRefundDetail.RefundWalletMoney !== 0">元</span></span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">退碳积分</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.OrderRefundDetail.RefundCarbonScore === 0}">{{orderNumArr.OrderRefundDetail.RefundCarbonScore === 0 ? '-' : orderNumArr.OrderRefundDetail.RefundCarbonScore}}</i><span v-if="orderNumArr.OrderRefundDetail.RefundCarbonScore !== 0 ">积分</span></span>
                    </li>
                    <li class="fix" v-if="false">
                      <span class="sp1 fl">退款状态</span>
                      <span class="sp2 color fr">暂时没有</span>
                    </li>
                  </ul>
                </div>
                <!--支付信息-->
                <div class="info">
                  <h3>支付信息</h3>
                  <ul>
                    <li class="fix">
                      <span class="sp1 fl">产品名称</span>
                      <span class="sp2 fr">{{orderNumArr.ProductName}}</span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl ">支付订单编号</span>
                      <span class="sp2 Arial spanPub fr">{{orderNumArr.OrderNo}}</span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">商户订单号</span>
                      <span class="sp2 Arial fr">{{orderNumArr.ThirdOrderNo}}</span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">订单时间</span>
                      <span class="sp2 Arial fr">{{orderNumArr.CreateTime}}</span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">积分</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.IntegralMoney === 0}">{{orderNumArr.IntegralMoney === 0 ? '-' : orderNumArr.IntegralMoney}}</i><span v-if="orderNumArr.IntegralMoney !==0">积分</span></span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">钱包金额</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.WalletMoney === 0}">{{orderNumArr.WalletMoney === 0 ? '-' : orderNumArr.WalletMoney}}</i><span v-if="orderNumArr.WalletMoney !== 0">元</span></span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">碳积分</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.CarbonScore === 0}">{{orderNumArr.CarbonScore === 0 ? '-' : orderNumArr.CarbonScore}}</i><span v-if="orderNumArr.CarbonScore !==0">碳积分</span></span>
                    </li>
                    <li class="fix">
                      <span class="sp1 fl">{{orderNumArr.PayTypeText === '' ? '在线支付' : orderNumArr.PayTypeText}}</span>
                      <span class="sp2 fr"><i :class="{'active':orderNumArr.OnlinePayMoney === 0}">{{orderNumArr.OnlinePayMoney === 0 ? '-' : orderNumArr.OnlinePayMoney}}</i><span v-if="orderNumArr.OnlinePayMoney !== 0">元</span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!--按钮-->
            <div class="btn_box" :class="{'active':orderNumArr.OrderRefundDetail.RefundItems.length > 0}" v-if="orderNumArr.OrderRefundDetail">
              <a herf="javascript:;" class="btn1" v-show="payStatus === 2" @click="original" :class="{'active':payStatus === 2 && isPC()}">查看原订单{{statusCode}}</a>
              <a herf="javascript:;" class="btn2" @click="goPay" v-show="payStatus === 1">重新发起支付</a>
            </div>
          </div>
          
          <!--公共错误弹框-->
          <v-modal :prom="prom"></v-modal>
      </div>
      <!--版权-->
          <!--<v-copyright :bottom = 'true'></v-copyright> -->
    </div>
</template>
<script type="text/ecmascript-6">
  import CheckStand from '@/components/checkstand/CheckStand'
  import Copyright from '@/components/copyright/Copyright'
  // import BScroll from 'better-scroll'
  import Modal from '@/components/modal/Modal'
  export default {
    name: 'orderDetail',
    data () {
      return {
        title: '订单详情',
        orderNumArr: {},
        statusArr: ['', '待支付', '已支付', '已退款', '已部分退款', '已关闭'],
        payWay: ['', '支付宝支付', '银联支付', '微信支付', 'ApplyPay', '积分支付', '钱包支付'],
        payStatus: 1,
        prom: null // 错误提示信息
      }
    },
    computed: {
      statusCode () {
        if (this.orderNumArr.State === 1) {
          this.payStatus = 1
        } else {
          this.payStatus = 2
        }
      }
    },
    created () {
      // 订单详情页接口
      // this.$root.eventHub.$on('orderNuma', this.ajaxFn)
      this.ajaxFn()
    },
    mounted () {
      if(this.isPC()){
        document.getElementById('app').className = ""
        let select_box = document.getElementsByClassName('orderDetail')[0]
        select_box.style.maxWidth = '1000px'
        select_box.style.margin = 'auto'
      }

    },
    methods: {
      ajaxFn: async function () {
        let params = {
           'orderNo': this.getCookie('CashierInfoId')
        }
        const res = await this.$root.http.post('/mvc/pay/QueryOrderPayDetail', params,this)
        if (res.data.Flag === 1) {
             this.orderNumArr = res.data.Data
        } else if (res.data.Flag === 0 ){
           this.$root.bool = true
           this.prom = res.data.Msg
        }
      },
      // 跳转重新支付页
      goPay () {
        let code = this.orderNumArr.ThirdId + '_' + this.orderNumArr.ThirdOrderNo
        this.$router.push({path: '/main', query: {'code': code}})
      },
      // 查看原订单
      original () {
        if (this.orderNumArr.ThirdOrderUrl === '') {
            return
         }
        window.location.href = this.orderNumArr.ThirdOrderUrl
      },
      // 返回所有支付列表
      backList () {
        // this.$router.push({path:'/order'})
        this.$router.go(-1)
      }
    },
    components: {
      'v-checkstand': CheckStand,
      'v-copyright': Copyright,
      'v-modal': Modal
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .orderDetail 
    position:relative
    .orderDetail_h5
      .content
        border-top:1px solid #EBEBEB
        .amount
          text-align:center
          padding:23px 0px
          padding-bottom:0px
          p
            font-size: 30px
            color: #C0191F
            line-height: 34px
            font-weight:700
            font-family:Arial
          h4
            font-size: 15px
            color: #BA9765
            line-height: 34px
        .info
          padding-left:15px
          padding-bottom:30px
          h3
            font-size: 15px
            color: #535353
            line-height: 20px
            padding-bottom:9px
            padding-top:15px
            border-bottom:1px solid #EBEBEB
          ul
            margin-top:7px
            li
              span
                display:inline-block
              .sp1
                width:80px
                font-size: 15px
                color: #979797
                line-height: 35px
                width:30.0144%
              .sp2
                font-size: 15px
                color: #535353
                line-height: 35px
                text-align:right
                margin-right:3%
                width:66.3623%
                span
                  font-size:15px
                i
                  font-style:normal
                  color: #B00018
                  font-family:Arial
                  span
                    color:#B00018 
                i.active
                  color:#535353 
              .spanPub
                color:#535353
              &:first-child
                .sp2
                  line-height: 35px
        .refund
          background:#F8F8F8
          padding-bottom:20px
          margin-top:15px
          ul
            li
              .color
                color: #BA9765
        .btn_box
          position:relative
          bottom:30px
          width:100%
          text-align:center
          margin-top:97px
          a
            display:inline-block
            outline:none
            border:none
            background: #FFFFFF
            border: 1px solid #C0191F
            border-radius: 58px
            font-size: 18px
            color: #C0191F
            width:222px
            height:43px
            text-align:center
            line-height:43px
            background:#C0191F
            color:#fff
          .btn2
            border:none
            background:#C0191F
            color:#fff
        &.active
          margin-top:36px
    .orderDetail_PC
      .content
        border-top:none
        padding-bottom:113px
        .amount
          padding:34px 0px 34px 0px
          .money
            float:left
            position:relative
            p
              margin-left:85px
              font-size:30px
              line-height:34px
              position:relative
              top:2px
              display:inline-block
              text-align:right
              font-weight:bold
              &.active
                margin-left:125px
            h4
              position:absolute
              top:0px
              left:0px
              font-size: 24px
              color: #BA9765
              line-height: 34px
              display:inline-block

          .back
            float:right
            cursor:pointer
            i
              display:inline-block
              font-size:14px
              line-height:34px
              right:4px
              color:#C4A958
              position:relative
              top:-1px
            span
              display:inline-block
              font-size:18px
              color: #BA9765
              line-height:34px
        .info
          padding-left:0px
          border:1px solid #EBEBEB
          padding-bottom:0px
          h3
            font-size: 18px
            line-height: 40px
            padding-left:30px
            padding-bottom:0px
            padding-top:0px
            color:#535353 
          ul
            margin-top:0px
            li
              .sp1
                width:145px
                line-height:40px
                text-align:center
                border-right:1px solid #EBEBEB
                font-size:14px
              .sp2
                float:left
                font-size: 14px
                line-height: 40px
                padding-left:30px
                width:785px
                text-align:left
              &:first-child
                .sp1
                  line-height:40px
                .sp2
                  line-height: 40px
              &:last-child
                .sp1
                  padding-bottom:23px
        .refund
          margin-bottom:30px
          margin-top:0px
        .btn_box
          position:relative
          height:50px
          line-height:50px
          a
            height:48px
            border-radius: 29px
            font-size:20px
            cursor:pointer
            background:#C0191F
            color:#fff
            line-height:48px
          .btn1:hover
            background: #CD474C
            color:#fff
            transition: all .3s ease
          .active
              margin-right:0px
          .btn2:hover
            background: #CD474C
            color:#fff
            transition: all .3s ease
      .borderTopa
        max-width:1000px
        min-width:1000px
        margin:0 auto 
      .borderTop
         border-top:1px solid #EBEBEB     
</style>