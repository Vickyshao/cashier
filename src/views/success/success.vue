  <template>
    <div class="success">
      <!--移动-->
      <div class="success_h5" :class="{'success_PC':isPC()}" >
          <!--头部信息-->
          <v-checkstand :title='title' :goList= 1></v-checkstand>
          <div class="content">
            <!--支付头部信息-->
            <div class="pay_head" v-show="orderText.State === 2">
              <div class="text">
                <i class="iconfont" :class="{'icon-chenggong': orderText.State === 2}"></i><span :class="{'sp1':orderText.State === 2}">支付成功</span>
              </div>
            </div>
            <!--支付info-->
            <div class="info">
              <ul class="main" v-if="orderText.State === 2">
                <li v-if="false">商户名：某某某超市</li>
                <li>支付订单号：<span class="Arial">{{orderText.OrderNo}}</span></li>
                <li>商户订单号：<span class="Arial">{{orderText.ThirdOrderNo}}</span></li>
                <li>商品名称：{{orderText.ProductName}}</li>
                <li>订单总金额：<span>{{orderText.TotalMoney}}</span>元</li>
                <li v-if="IsAnonymous === 0">钱包支付：<span>{{orderText.WalletMoney}}</span>元</li>
                <li v-if="IsAnonymous === 0">积分支付：<span>{{orderText.IntegralMoney}}</span>积分 ( {{orderText.IntegralToCashMoney}}元 )</li>
                <li v-if="orderText.CarbonScore > 0">碳积分支付：<span>{{orderText.CarbonScore}}</span>碳积分</li>
                
                <li>{{orderText.PayTypeText === '' ? '在线支付':orderText.PayTypeText }}：<span>{{orderText.OnlinePayMoney}}</span>元 <span ></span></li>
                <li v-show="false" v-if="orderText.TotalMoney - orderText.WalletMoney - orderText.IntegralMoney / balance > 0">待支付：<span>{{orderText.TotalMoney - orderText.WalletMoney - orderText.IntegralMoney / balance}}</span></li>
              </ul>
              <div class="paying" v-if="orderText.State !== 2">
                <img src="./loadingSmall.gif" alt=""><br/>
                <span class="sp1">正在支付中...</span><br/>
                <span class="sp2">{{n}} </span><span>秒</span>
              </div>
              <!--按钮集合-->
              <div class="btn_box" v-if="orderText.State === 2">
                <div class="goPage" v-if="orderText.ThirdOrderUrl != ''">页面将在<span>{{goPage}}秒</span>后自动跳转…</div>  
                <a href="javascript:;" class="btn1" @click="original">查看原订单</a> 
              </div>                          
            </div>
          </div>
          <!--版权-->
          <!--<v-copyright :bottom="true"></v-copyright>-->
          <!--公共错误弹框-->
          <v-modal :prom="prom" ></v-modal>
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
        paymentMdel: {
          wallet: '钱包',
          integral: '积分'
        },
        orderText: {}, // 存放订单信息
        balance: null, // 积分比例
        prom: null, // 错误提示信息
        orderNo: null, // 订单编号
        n: 5, // 倒计时
        iNow: 0 ,// 支付状态的 次数大于1
        timer:null,
        timerUrl:null,
        IsAnonymous:0, //判断是否是散客
        goPage:5,
      }
    },
    created () {
      // 订单详情页接口
      this.orderNo = this.getCookie('CashierInfoId')
      
      if (this.$route.query.orderNo) {
        this.orderNo = this.$route.query.orderNo
      }else {
        this.orderNo = this.getCookie('CashierInfoId')
        if(this.orderNo === null ||this.orderNo === ''){
          this.$router.push({'path':'/err',query:{'Msg':encodeURIComponent('必须要有订单编号')}})
        }
      }
      this.ajaxFn()
      this.balance = this.getCookie('Balance')
      this.$root.loading = true
    },
    beforeDestroy() {
      clearInterval(this.timer);
      clearInterval(this.timerUrl)
    },
    mounted() {
      //document.getElementById('app').className = "active"
    },
    methods: {
      ajaxFn: async function () {
        let params = {
           'orderNo': this.orderNo
        }
        const res = await this.$root.http.post('/mvc/pay/QueryOrderPayDetail', params,this)
        if (res.data.Flag === 1) {
            this.orderText = res.data.Data;
              let This = this
              this.IsAnonymous =res.data.Data.IsAnonymous
              if(this.orderText.State !==2){
                This.iNow ++
                if (This.iNow > 1) {
                  clearInterval(this.timer);
                  clearInterval(This.timerUrl);
                   This.$router.push({path: '/err',query:{'Msg':encodeURIComponent('支付异常')}})
                }
                this.timer = setInterval(function(){
                  This.n --
                  if(This.n === 0 ){
                    This.ajaxFn();
                    clearInterval(This.timerUrl);
                    clearInterval(This.timer)
                    This.n = 5
                  }
                },1000)
              };
            //判断如果订单编号存在，说明请求成功，然后倒计时，5s后跳走
            if(this.orderText.OrderNo){
              this.timerUrl = setInterval(function(){
                This.goPage --
                  if(This.goPage === 0 ){
                    clearInterval(This.timerUrl);
                    if (This.orderText.ThirdOrderUrl !== '') {
                        window.location.href = This.orderText.ThirdOrderUrl
                     }
                    
                  }
              },1000)
            }
        } else if (res.data.Flag === 0 ){
           this.$root.bool = true
           this.prom = res.data.Msg
        } 
      },
      // 查看原订单
      original () {
        if (this.orderText.ThirdOrderUrl === '') {
            return
         }
        window.location.href = this.orderText.ThirdOrderUrl
      },
      // 订单编号
      getQueryString (name) {
          let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
          let r = window.location.search.substr(1).match(reg)
          if (r != null) return unescape(r[2])
          return null
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
  .success 
    .success_h5
      .content
        position:relative
        .pay_head
          background: #F7F7F7
          text-align:center
          .text
            padding:27px 0 30px
            i
              display:inline-block
              font-size:28px
              margin-right:8px
              color:#7ED321
            span
              display:inline-block
              font-size: 18px
              color: #7EBC40
              line-height:28px
              vertical-align:top
            .sp2
               color:#90704D
        .info
          background:#fff
          .main
            padding:13px 28px 0px 
            li
              font-size: 15px
              color: #535353
              line-height: 30px 
              span
                color:#B00018
                font-family:Arial
              .Arial
                color:#535353
          .paying
            text-align:center
            padding:210px 0px
            color: #979797
            span
              display:inline-block
              color:#535353
              font-size:16px
              line-height:21px
            .sp2
              font-family:Arial
          
          .btn_box
            width:100%
            text-align:center
            cursor:pointer
            margin-top:85px
            .goPage
              width:100%
              text-align:center
              color:#535353
              font-size:16px
              line-height:33px
              font-weight:bold
              span
                color:#C0191F
                font-weight:bold
            a
              margin-top:13px
              display:inline-block
              outline:none
              border:none
              background:#C0191F
              color:#FFFFFF
              border: 1px solid #C0191F
              border-radius: 58px
              font-size: 18px
              line-height:23px
              padding:10px 57px
              cursor:pointer
              text-align:center
    .success_PC
      .content
        margin-top:10px
        box-shadow: 0 0 10px rgba(0,0,0,0.20)
        .pay_head
          .text
            padding:61px 0 57px 0px
            i
              font-size:40px
              margin-right:14px
              &:before
                color:#7ED321
            .icon-errinfo:before
              color:#90704D
            span
              display:inline-block
              font-size: 26px
              color: #7EBC40
              line-height:35px
              vertical-align:top
            .sp2
               color:#90704D
        .info
          .main
            padding:31px 80px 0px
            li
              font-size: 16px
              color: #535353
              line-height: 35px
              span
                display:inline-block
                font-size: 16px
                color:#C0191F
                line-height: 35px
          .paying
            text-align:center
            padding:260px 0px
            color: #979797
          .btn_box
            position:relative
            padding-bottom:60px
            margin-top:85px
            a
              margin-top:13px
              height:48px
              line-height:48px
              font-size:20px
              background:#C0191F
              color:#FFFFFF
              padding-top:0px
              padding-bottom:0px
            a:hover
              background: #FFF0F1 
              border-radius: 29px
              background:#CD474C
              color:#FFFFFF 
              transition: all .3s ease
</style>
