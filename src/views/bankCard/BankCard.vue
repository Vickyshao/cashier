<template>
    <div class="bankcard">
      <!--头部内容-->
      <v-checkstand :PC="isPC()" :title='title' :color="true"></v-checkstand>
      <div class="bank_h5" :class="{'bank_PC':isPC()}" >
        <h3 v-if="isPC()">您正在为订单尾号为<span ref="str" class="Arial"></span>的订单进行在线支付</h3>
        <div class="content">
          <div class="total" v-if="isPC()">
            <span class="text">支付总额：</span>
            <span class="number Arial">¥ {{PayMoney}}</span>
          </div>
          <div class="ipt_box" :class="{'active':errMsg}">
          <span>卡号</span>
          <input type="text" class="bank_number" placeholder="请输入银行卡号" v-model="val" @focus ='fnFocus()' @blur = "fnBlur()">{{checkLength}} 
          <router-link :to="{path:'/bank'}" class="bind" v-if="isPC() && bankFlag">使用已绑定的银联卡</router-link>
          </div>

          <p v-show="errMsg && isPC()">银行卡号格式错误</p>
          <a herf="javascript:;" class="next btn-hookd" :class="{'active': val.length > 17 && val.length < 25}" @click="check" id="btn-hookd">下一步 {{enterd}}</a>
          <div class="goBank" @click="goBank()" v-if="!isPC() && bankFlag">
            <router-link :to="{path:'/bank'}" class="bind" >使用已绑定的银联卡</router-link>
            <i class="iconfont icon-right-arrow"></i>
          </div>
        </div>
        <div class="bank_info fix" v-show="windowChange">
          <div class="img fl" v-if="!isPC()">
            <img src="./bank.jpg" alt="">
          </div>
          <div class="img2 fl" v-if="isPC()">
            <img src="./bankPC.jpg" alt="">
          </div>
          <ul class="fl">
            <li class="fix">
              <span class="fl"></span>
              <div class="fl"> 如家酒店集团不会记录你的任何信用卡信息， 所有信息均由加密通道传递给中国银联</div>
            </li>
            <li class="fix">
              <span class="fl"></span>
              <div class="fl"> 本服务由银联在线提供技术支持</div>
            </li>
          </ul>
        </div>
      </div> 
      <!--版权信息-->
      <!--<v-copyright :PC="isPC()" :bottom="true"></v-copyright>-->
      <div class="err_msg1" v-show="maskHide && !isPC()" ref="errMsg">错误信息</div>
      <div class="msgPC" v-show="maskHide && isPC()" >
        <span class="icon-PCclose iconfont" @click="maskshow"></span>
        <h3 ref="msgPC">错误信息</h3> 
        <a  herf="javascript:;" class="close_btn" @click="maskshow">关闭</a>
      </div>
      <transition name="moveMask">
        <div class="mask" v-if="maskHide" @click="maskshow()"></div>
      </transition>
      <!--公共错误弹框-->
      <v-modal :prom="prom"></v-modal>
    </div>
</template>
<script type="text/ecmascript-6">
  import CheckStand from '@/components/checkstand/CheckStand'
  import Copyright from '@/components/copyright/Copyright'
  import Modal from '@/components/modal/Modal'
  export default {
    name: 'bank',
    data () {
      return {
        title: '绑定银行卡',
        val: '',
        errMsg: false, // 错误信息显示隐藏
        maskHide: false, // 浮层隐藏
        PayMoney:null, // 银联支付总金额
        PayOrder: null, //银联支付订单编号 
        bankName: null, // 银行名称
        prom: null, // 错误提示信息
        windowChange: true, //软件盘出现底隐藏
        bankFlag: true //绑定银联卡显示隐藏
      }
    },
    computed: {
      checkLength () {
         this.val = this.val.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ")
        if ((this.val.length > 17 && this.val.length < 25) || this.val === '') {
          this.errMsg = false
        } else if(this.val.length > 25){
            this.errMsg = true
       }
      },
      enterd () {
          this.enterPublick('btn-hookd',this.val.length > 17 && this.val.length < 25)
        }
    },
    mounted () {
      this.$root.loading = false
      //this.PayMoney = window.localStorage.PayMoney
      //this.PayOrder = window.localStorage.CashierInfoId
      this.PayMoney = this.getCookie('PayMoney')
      this.PayOrder =this.getCookie('CashierInfoId') 
      this.PayOrder = this.PayOrder.substring(this.PayOrder.length-9)
      if (this.isPC()){
        this.$refs.str.innerHTML = this.PayOrder
      } 
      //document.getElementById('app').className = "active"
      let This = this
      if(!this.isPC()){
        let winHeight = $(window).height();  //获取当前页面高度
        window.onresize = function () {
            let thisHeight = $(this).height();
            if ( winHeight - thisHeight > 140 ) {
                This.windowChange = false
            } else {
                This.windowChange = true
            }
        }
      } 
      // 判断count是否大于一
      if (this.$route.query.count > 0) {
        this.bankFlag = true
      }else{
        this.bankFlag = false
      }
      if(this.isPC()){
          document.getElementById('app').className = "active"
      }
    },
    methods: {
      check () {
       // let pattern = /^([1-9]{1})(\d{14}|\d{15}|\d{18})$/ 
       // let str = this.val.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")  
       // if (!pattern.test(str)) { 
       //     this.errMsg = true
       // } else {
        //  this.errMsg = false
        //  this.fetchData()
        //}
        if ((this.val.length > 17 && this.val.length < 25)) {
          this.fetchData()
        }
        
      },
      // 异步请求
      fetchData: async function () {
        let params = {
           'bankNo':this.val.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")
        }
        const res = await this.$root.http.post('/mvc/union/VerifyBankCard', params,this)
        if (res.data.Flag === 1) {
            this.setCookie('bankNo',res.data.Data.BankNo) // 银行卡号绑定
            this.setCookie('bankName',res.data.Data.BankName) // 银行名称绑定
            
            if (res.data.Data.CardTp.indexOf('贷记') !== -1){
              this.$router.push({path: '/bindBank',query:{'CardTp':encodeURIComponent(res.data.Data.CardTp)}})
            }else {
              this.$router.push({path: '/bindBank'})
            }
        } else if (res.data.Flag === 0 ){
             this.$refs.errMsg.innerHTML = res.data.Msg
             this.$refs.msgPC.innerHTML = res.data.Msg
             this.maskHide = true
          // this.$root.bool = true
          // this.prom = res.data.Msg
        }
      },
      maskshow () {
        this.maskHide = false
      },
      // 获取焦点
      fnFocus (){
        // ios 兼容
        let ua = navigator.userAgent.toLowerCase(); 
        if (/iphone|ipad|ipod/.test(ua)) {
          this.windowChange = false
        }
      },
      // 失去焦点
      fnBlur () {
        let ua = navigator.userAgent.toLowerCase(); 
        if (/iphone|ipad|ipod/.test(ua)) {
          let This = this
          setTimeout(function(){
            This.windowChange = true
          },1000) 
        }
      },
      // 跳转到绑定银行卡界面
      goBank (){
        this.$router.push({path:'/bank'})
      },
    },
    components: {
      'v-checkstand': CheckStand,
      'v-copyright': Copyright,
      'v-modal': Modal
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
  .bankcard
    .bank_h5
      .content
        padding:0px 36px
        .ipt_box
          position:relative
          width:100%
          border:1px solid #D3D3D3 
          background:rgba(255,255,255,1)
          border-radius: 45px 
          margin-top:31px
          span
            display:inline-block
            margin:0px 20px
            height:43px 
            font-size:14px
            color:rgba(151,151,151,1)
            line-height:43px
          .bank_number
            outline:none
            border:none
            padding:8px 0px
            height:27px
            line-height:27px
            font-size:14px
            border-radius:0px 45px 45px 0px
            overflow:hidden
            color:#535353

        p
          position:absolute
          top:140px
          color:#C0191F
          font-size:14px
          width:115px
          margin-left:75px
        .next
          display:inline-block
          outline:none
          border:none
          height:45px 
          background:#D3D3D3
          border-radius: 45px  
          font-size:16px
          color:rgba(255,255,255,1)
          line-height:45px
          margin-top:49px
          width:100%
          text-align:center
          &.active
            background:#C0191F
        .goBank
          text-align:center
          margin-top:35px
          a
            font-size:14px
            color:#90704D
          i
            display:inline-block
            color:#90704D
            font-size:10px
            margin-left:10px
          
      .bank_info
        padding:0px 32px
        position:fixed
        bottom:46px
        .img
              float:left
              width:16%
              text-align:right
              
          img
            display:inline-block
            width:45px
            height:28px
            background-size:45px 28px

        ul
          width:78%
          float:left
          padding-left: 10px;
          margin-top:-2px
          li

            &:last-child
              margin-top:12px
            span
              display:inline-block
              width:5px
              height:5px
              background:#979797
              border-radius:100%
              float:left
              margin-top: 4px;
            div
              font-size:12px
              color:rgba(151,151,151,1)
              line-height:16px
              padding-left:18px
              float:none

    .bank_PC
      margin:0 auto
      margin-top:10px
      box-shadow: 0 0 10px rgba(0,0,0,0.20)
      position:relative
      h3
        font-size:16px
        color:rgba(83,83,83,1)
        line-height:21px
        padding:46px 0px 21px 0px
        border-bottom:1px dashed #D3D3D3
        margin:0px 40px 
        span
          display:inline-block
          color:#C0191F
          margin:0px 6px
          font-family:Arial
      .content
        margin:0px 40px
        width:409px
        padding:0px 0px
        text-align:center
        position:relative
        .total
          width:409px
          height:50px
          background:rgba(249,248,246,1)
          border-radius: 31px 
          text-align:center
          margin-top:15px
          .text
            font-size:18px
            font-weight:bold
            color:rgba(83,83,83,1)
            line-height:50px
          .number
            font-size:20px
            color:#C0191F
            line-height:50px
            font-family:Arial
            font-weight:bold
        .ipt_box
          width:300px
          margin-left:55px
          text-align:left
          border:1px solid #BCBCBC 
          position:relative 
          &.active
            border:1px solid #C0191F
          span
            height:38px
            line-height:38px
          .bank_number
            padding:6px 0px
            height:26px
            line-height:26px
            width:220px
            border-radius:0px 45px 45px 0px
          a
            position:absolute
            right:-140px
            top:11px
            font-size:14px
            color:#90704D 
        .next
          width:300px
          margin-bottom:165px
          margin-top:59px
          font-size:20px
          height:50px
          line-height:50px
      .bank_info
        position:static
        position:absolute
        right:0px
        top:196px
        width:275px
        font-size:14px
        .img2
          position:relative
          top:-70px
          left:37px
          img
            width:134px
            height:46px
            background-size:134px 46px
        ul
          margin-left:10px
          margin-top:-58px
          li
            span
              display:inline-block
              width:5px !important
              height:5px
              border-radius:100% 100%
              background:#979797 
              margin-right:-8px
              margin-top:8px
              position:relative
              left:22px
            div
              text-indent:18px
              font-size:14px
              color:rgba(151,151,151,1)
              line-height:19px
              width:227px

  .err_msg1
    position:fixed
    width:300px
    height:50px 
    background:rgba(255,255,255,1)
    border-radius: 50px 
    left:50%
    top:50%
    margin-left:-150px
    margin-top:-50px
    z-index:20
    text-align:center
    font-size:14px
    color:rgba(83,83,83,1)
    line-height:50px
  .msgPC
    position:fixed
    width:417px
    height:190px
    border-radius: 20px
    left:50%
    top:50%
    margin-left:-208px
    margin-top:-95px
    z-index:20
    text-align:center
    background:#fff
    span
      position:absolute
      top:15px
      right:15px
      cursor:pointer
      color:#D3D3D3
    h3
      margin-top:52px
      font-size:16px
      color:rgba(83,83,83,1)
      line-height:21px
    a
      display:inline-block
      outline:none
      border:none
      margin-top:37px
      width:140px
      height:45px
      line-height:45px
      text-align:center
      background:rgba(192,25,31,1)
      border-radius: 58px
      font-size:18px
      color:rgba(255,255,255,1)
      cursor:pointer
      &:hover
          background:#CD474C
          transition: all 0.5s ease

  .mask
      position:fixed
      top:0px
      left:0px
      width:100%
      height:100%
      z-index:10
      background: rgba(0,0,0,0.30)
      filter:blur(10px)
      transition:all 0.5s ease
      &.moveMask-enter,&.moveMask-leave-active
        opacity:0
      &.moveMask-enter-active
        opacity:1
@media screen and (max-width: 360px) and (min-width: 300px)
  .bankcard
    .bank_h5
      .content
        padding:0px 20px
        .msg_box 
          span
            margin:0px 16px
        .msg_btn
              font-size:13px
        .ipt_box
          span
             margin:0px 10px
      .bank_info 
          padding:0px 20px
          ul
            li
              &:last-child
                margin-top:12px
              span
                display:inline-block
                width:5px
                height:5px
                border-radius:5px 5px
                background:#979797 
                margin-right:5px
                margin-top:5px
              div
                font-size:12px
                color:rgba(151,151,151,1)
                line-height:16px
</style>