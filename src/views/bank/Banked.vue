<template>
    <div class="banka">
      <!--头部内容-->
      <v-checkstand :PC="isPC()" :title='title' :color="true"></v-checkstand>
      <div class="bank_h5" :class="{'bank_PC':isPC()}" >
        <h3 v-if="isPC()">您正在为订单尾号为<span ref="str" class="Arial"> </span>的订单进行在线支付</h3>
        <div class="content">
          <div class="total" v-if="isPC()">
            <span class="text">支付总额：</span>
            <span class="number Arial">¥ {{PayMoney}}</span>
          </div>
          <div class="ipt_box" v-if="!isPC()" @click="listH5()">  
            <span>银联卡</span>
            <h3 class="bank_number bank_numberh3" ref="bankNumber" v-if="bankList"><span>{{listName}} </span><br><span class="Arial">{{listBankNo.replace(listBankNo.substring(listBankNo.length-10, listBankNo.length-4), '******')}}</span></h3>
            <i class="fr iconfont" :class="{'icon-down-arrow':!this.maskHide,'icon-top-arrow':this.maskHide}" @click.stop.prevent="listH5()" v-if="!isPC() && this.count > 1"></i>
          </div>
          <div class="ipt_boxPC fix" v-show="isPC()" @click.stop.prevent="list()">
            <span class="fl">银联卡号</span>
            <h5 class="fl" v-if="bankList">{{listName}} <span class="Arial">{{listBankNo.replace(listBankNo.substring(listBankNo.length-10, listBankNo.length-4), '******')}}</span></h5>
            <i class="fr iconfont" :class="{'icon-top-arrow':listShow,'icon-down-arrow':!listShow}" @click.stop.prevent="list()" v-if="isPC() && this.count > 1"></i>
            <ul class="fl" v-if="listShow && isPC()" id="ul-list-pc">
              <li @click.stop.prevent="selectBank(list,index)" v-for="(list, index) in bankList">{{list.BankName}} <span class="Arial">{{list.BankNo.replace(list.BankNo.substring(list.BankNo.length-10, list.BankNo.length-4), '******')}}</span></li> 
            </ul>
            <router-link :to="{path:'/bankCard',query:{'count':this.count}}" class="bind" v-if="isPC()">绑定新的银联卡</router-link>
          </div>
          <div class="msg_box">
            <span>验证码</span>
            <input type="number" class="bank_number" placeholder="6位" v-model="msgVal" @focus ='fnFocus()' @blur = "fnBlur()">
          </div>
          <a  href="javascript:;" class="msg_btn" @click="countdown()" ref="bankBTn">获取手机验证码</a>
          <p v-if="isPC() && msgVal.length > 6" class="msgTel">验证码输入错误</p>
          <a class="next btn-hookc" @click="sub()" :class="{'active':msgVal.length ===6}" id="btn-hookc">下一步{{enterc}}</a>
          <div class="goBank" @click="goBank()" v-if="!isPC()">
            <router-link :to="{path:'/bankCard',query:{'count':this.count}}" class="bind" >绑定新的银联卡</router-link>
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
              <div class="fl" > 如家酒店集团不会记录你的任何信用卡信息， 所有信息均由加密通道传递给中国银联</div>
            </li>
            <li class='fix'>
              <span class="fl"></span>
              <div class="fl"> 本服务由银联在线提供技术支持</div>
            </li>
          </ul>
        </div>
      </div> 
      <!--版权信息-->
      <!--<v-copyright :PC="isPC()" :bottom="true"></v-copyright>-->
      <div class="err_msg" v-if="maskHidea && !isPC()">
        <div class="close">
          <span class="icon-PCclose iconfont" @click="maskshow ($event)"></span>
        </div>
        <h3>已绑定了其他用户</h3>
        <button  class="nextBtn">下一步</button>
      </div>
      <!--移动端-->
      <transition name="fold">
        <div class="fold" v-show="!isPC() && maskHide">
          <ul id="ul-list">
            <li @click="selectBankH5(list,index)" v-for="(list, index) in bankList">{{list.BankName}} <span class="Arial">{{list.BankNo.replace(list.BankNo.substring(list.BankNo.length-10, list.BankNo.length-4), '******')}}</span></li>
          </ul>
        </div>       
      </transition>
      <transition name="moveMask">
        <div class="mask" v-if="maskHide && !isPC()" @click="maskshow()"></div>
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
    name: 'banka',
    props: {
      Data: {
        type: Object
      }
    },
    data () {
      return {
        title: '绑定银行卡',
        maskHide: false, // 浮层隐藏
        maskHidea: false, // 浮层隐藏
        card:null, // 银行卡号
        n: 59, // 倒计时时间设定
        bl:true,
        listShow:false, // 默认情况下 list表隐藏
        msgVal:'', // 验证码的值
        bankList: null, // 银行卡列表
        prom: null, // 错误提示信息
        PayMoney:null, // 银联支付总金额
        PayOrder: null, //银联支付订单编号
        timer: null,
        listName:null,
        listBankNo:null,
        windowChange: true, //软件盘出现底隐藏
        count:0
      }
    },
    computed: {
          enterc () {   
              this.enterPublick('btn-hookc',this.msgVal.length ===6)       
          }
    },
    watch: {
        msgVal() {
            if (this.msgVal.length > 6) {
                this.msgVal = String(this.msgVal).slice(0, 6)
            }
        }
    },
    mounted () {
      this.$root.loading = true
      this.PayMoney = this.getCookie('PayMoney')
      this.PayOrder =this.getCookie('CashierInfoId') 
      this.PayOrder = this.PayOrder.substring(this.PayOrder.length-9)
      if (this.isPC()){
        this.$refs.str.innerHTML = this.PayOrder
      }
      this.fetchData()
     // document.getElementById('app').className = "active"
     let This = this
     if(!this.isPC()){
       //window.onresize = function(){
       //    This.windowChange = !This.windowChange
       //}
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
     if(this.isPC()){
         document.getElementById('app').className = "active"
     }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      // 浮层显示隐藏
      maskshow () {
        this.maskHide = false
      },
      // 异步请求
      fetchData: async function () {
         let params = {
         }
         const res = await this.$root.http.post('/mvc/union/UnionBankCardList', params,this)
         if (res.data.Flag === 1) {
              if(res.data.Data.BankCardCount > 0){
                this.$root.loading = false
                this.bankList = res.data.Data.BankCardItems
                this.card = this.bankList[0].BankNo
                this.listName  = this.bankList[0].BankName
                this.listBankNo  = this.bankList[0].BankNo
                this.count = res.data.Data.BankCardCount
              } else {
                this.$root.loading = false
                this.$router.push({path: '/bankCard',query:{'count':res.data.Data.BankCardCount}})
              }
         } else if (res.data.Flag === 0 ){
            this.$root.bool = true
            this.prom = res.data.Msg
         }
       },
      // 倒计时
      countdown () {
          this.countdownAsync()
      },
      // 倒计时的异步请求函数
      countdownAsync: async function () {
        if (this.bl) {
          this.bl = false
          let This = this
          let params = {
             'bankNo': this.card,
             'paypalId': this.getCookie('PaypalId')
          }
          const res = await this.$root.http.post('/mvc/union/VerifyUnionSmsMsg', params,this)
          if (res.data.Flag === 1) {
            This.$refs.bankBTn.innerHTML = this.n-- + 'S'
            This.$refs.bankBTn.style.background ="#D3D3D3" 
            This.$refs.bankBTn.style.color ='#fff'
            This.$refs.bankBTn.style.border= "none"
             this.timer = setInterval(() => {
               This.$refs.bankBTn.innerHTML = this.n-- + 'S'
               This.$refs.bankBTn.classList.add('activeBg')
               This.$refs.bankBTn.onmouseover = function(){
                  this.style.background = "#D3D3D3"
                  this.style.cursor = "default"
                  this.style.color ="#fff"
               }
               This.$refs.bankBTn.cursor = 'default'
               if (This.n === -1) {
                 clearInterval(this.timer)
                 This.$refs.bankBTn.innerHTML = '获取手机验证码'
                 This.$refs.bankBTn.classList.remove('activeBg')
                 This.$refs.bankBTn.style.background = ""
                 This.$refs.bankBTn.style.border="1px solid #90704D"
                 This.$refs.bankBTn.style.color="#90704D"
                 This.$refs.bankBTn.style.cursor="pointer"
                This.$refs.bankBTn.onmouseover = null
                 This.bl = true
                 This.n = 59
               }
             }, 1000)  
          } else if (res.data.Flag === 0 ){
             this.$root.bool = true
             this.prom = res.data.Msg
             This.bl = true
          }
        }
      },
      // 提交信息
      sub () {
        if (this.msgVal.length !== 6) {
          return
        }
        this.subAsync()
        
      },
      // 异步请求
      subAsync: async function () {
        let params = {
           'verifyNum': this.msgVal,
            'bankNo': this.card, 
            'paypalId': this.getCookie('PaypalId')
        }
        const res = await this.$root.http.post('/mvc/union/UnionPay', params,this)
        if (res.data.Flag === 1) {
             this.setCookie('orderId',res.data.Data.CashierInfoID)        
             this.$router.push({path: '/success'})
        } else if (res.data.Flag === 0 ){
           this.$root.bool = true
           this.prom = res.data.Msg
        }
      },
      // 选择银行卡
      selectBank (list,index) {
        this.listName = list.BankName
        this.listBankNo = list.BankNo
        this.card = list.BankNo
        this.listShow = !this.listShow
      },
      // 选择银行卡h5
      selectBankH5 (list,index) {
        this.listName = list.BankName
        this.listBankNo = list.BankNo
        this.card = list.BankNo
        let el = document.getElementById('ul-list')
        let aLi = el.children
        for(let i =0;i<aLi.length;i++){
          aLi[i].classList.remove('active')
        }
        
        aLi[index].className = 'active'
        aLi[index].style.background = "#c0191f"
        aLi[index].style.color = "#fff"
        aLi[index].children[0].style.color = "#fff"
        this.maskHide = !this.maskHide
      },
      // list显示隐藏
      list () {
        if(this.count <= 1){
          return
        }
        this.listShow = !this.listShow
      },
      // listH5显示隐藏
      listH5 () {
        if(this.count <= 1){
          return
        }
        let el = document.getElementById('ul-list')
        let aLi = el.children
        this.maskHide = !this.maskHide
        if(aLi[0].className === 'active'){
          aLi[0].className = 'active'
          aLi[0].style.background = ""
          aLi[0].style.color = ""
          aLi[0].children[0].style.color = ""
          return
        }
        for(let i =0;i<aLi.length;i++){
          aLi[i].style.background = ""
          aLi[i].style.color = ""
          aLi[i].children[0].style.color = ""
          if(aLi[i].className === 'active'){
            aLi[0].className = ''
            return
          }else{
            aLi[0].className = 'active'
          }
        } 
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
        this.$router.push({path:'/bankCard',query:{'count':this.count}})
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
  .banka 
    .bank_h5
      .content
        padding:0px 36px
        position:relative
        .ipt_box
          position:relative
          width:100%
          border:1px solid #D3D3D3 
          background:rgba(255,255,255,1)
          border-radius: 45px 
          margin-top:28px
          padding:7px 0
          span
            display:inline-block
            margin:0px 20px
            //height:45px 
            font-size:14px
            color:rgba(151,151,151,1)
            //line-height:45px
            vertical-align: middle
          .bank_number
            display:inline-block
            outline:none
            border:none
            //padding:9px 0px
            //height:27px
            //line-height:27px
            font-size:14px
            color:#414141
            font-weight:bold
            vertical-align: middle;
            //overflow:hidden
          .bank_numberh3
            padding:0px
            line-height: 16px
            color:#535353 
            span
              margin:0px
              font-weight:bold
              color:#535353 
            
          i
            display:inline-block
            //line-height:45px
            margin-right:17px
            font-size:14px
            color:#90704D 
            margin-top: 10px
        .msg_box
          position:relative
          width:50%
          border:1px solid #D3D3D3 
          background:rgba(255,255,255,1)
          border-radius: 45px 
          margin-top:15px
          display:inline-block
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
            height:27px
            line-height:27px
            padding:8px 0px
            font-size:14px
            width:59px
            border-radius: 45px
            overflow:hidden
            color:#535353
        .msg_btn
          display:inline-block
          margin-left:1.9%
          width:45% 
          outline:none
          border:none
          height:43px
          line-height:43px
          font-size:14px
          border-radius: 45px
          border:1px solid #90704D 
          background:#fff
          color:#90704D
          cursor:pointer
          text-align:center
          &.active
            background:#90704D
        .msgTel
          position:absolute
          top:190px
          left:20px
          font-size:14px
          color:#C0191F
          margin:0px
          line-height:14px
        p
          margin:26px 0px 14px 0px
          text-align:center
          height:24px; 
          font-size:17px;
          font-weight:bold
          color:rgba(83,83,83,1);
          line-height:24px
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
          margin-top:45px
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
          color:#C0191F
          display:inline-block
          margin:0px 6px
          font-family:Arial
      .content
        margin:0px 40px
        width:409px
        padding:0px 0px
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
            font-weight:bold
            font-family:Arial
        p
          margin:26px 0px 14px 0px
          text-align:center
          height:24px; 
          font-size:17px;
          font-weight:bold
          color:rgba(83,83,83,1);
          line-height:24px
        .ipt_boxPC
          width:409px
          margin-left:0px
          background:rgba(255,255,255,1)
          border:1px solid #D3D3D3 
          border-radius: 20px 
          margin-top:30px
          position:absolute
          z-index:10
          cursor:pointer
          span
            display:inline-block
            font-size:14px
            color:rgba(151,151,151,1)
            line-height:38px
            text-align:center
            width:96px
          h5
            display:inline-block
            font-size:14px
            color:#414141
            line-height:38px
            font-weight:bold
            span
              font-size:14px
              color:#414141
              font-weight:bold
              font-family:Airal
          i
            text-align:right
            font-size:14px
            line-height:38px
            margin-right:10px
            cursor:pointer
            color:#90704D
          ul
            top:39px
            width:100%
            font-size:14px
            font-weight:bold
            li
              border-top:1px solid #D3D3D3 
              font-size:14px
              color:#414141
              line-height:38px
              padding-left:97px
              cursor:pointer
              font-weight:bold
              span
                font-size:14px
                color:#414141
                font-weight:bold
                font-family:Arial

          .bind
            position:absolute
            top:0px
            right:-113px
            font-size:14px
            color:rgba(144,112,77,1)
            line-height:38px
        .msg_box
          position:relative
          width:255px
          border:1px solid #D3D3D3 
          background:rgba(255,255,255,1)
          border-radius: 45px 
          margin-top:90px
          display:inline-block
          span
            display:inline-block
            margin:0px 20px
            height:36px 
            font-size:14px
            color:rgba(151,151,151,1)
            line-height:36px
            width:56px
          .bank_number
            outline:none
            border:none
            font-size:14px
            width:150px
            height:26px
            padding:5px 0px
            line-height:26px
            border-radius: 45px
            margin-left:-3px
        .msg_btn
          display:inline-block
          margin-left:13px
          width:132px 
          outline:none
          border:none
          height:36px
          font-size:14px
          border-radius: 45px
          border:1px solid #90704D 
          background:#fff
          color:#90704D
          line-height:36px
          &.active
            background:#90704D
          &.activeBg
            background:#D3D3D3 
            color:#fff
            border:none
          &:hover
            background:#90704D
            color:#fff !important
            transition: all .3s ease
        .next
          width:409px
          height:50px
          line-height:50px
          margin-bottom:106px
          font-size:20px
          margin-top:59px
         
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

  .err_msg
    position:fixed
    width:300px
    height:173px 
    background:rgba(255,255,255,1)
    border-radius: 15px 
    left:50%
    top:50%
    margin-left:-150px
    margin-top:-88px
    z-index:20
    text-align:center
    font-size:14px
    color:rgba(83,83,83,1)
    overflow:hidden
    .close
      position:relative
      height:43px
      background: #fff
      span
        font-size:20px
        color:#D4D4D4
        position:absolute
        top:15px
        right:15px
        z-index:30
    h3
      position:absolute
      top:15px
      font-size:14px
      color:rgba(83,83,83,1)
      line-height:19px
      width:300px
      text-align:center
      z-index:10
    img
      display:block
      margin-top:15px
      width:140px
      height:86px
      background-size:140px 86px
      margin-left:80px
  .fold
    position:fixed
    left:0px
    bottom:0px
    width:100%
    z-index:20
    &.fold-enter-active,&.fold-leave-active
      transition:all 0.5s ease
    &.fold-enter-active
      transform:translate3d(0,0,0)
    &.fold-enter,&.fold-leave-active
      transform:translate3d(0,100%,0)
    ul
      background:rgba(255,255,255,1)
      li
        font-size:15px
        color:#535353
        line-height:50px
        text-align:center
        border-bottom:1px solid #EBEBEB
        span
          font-size:15px
          color:#535353
          font-family:Arial
        &:last-child
          border-bottom:none
        &.active
          color: #d3d3d3
          background: #fff
          span
            color: #d3d3d3
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
    .banka 
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