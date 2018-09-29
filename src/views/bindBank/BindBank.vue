<template>
    <div class="bindbank">
      <!--头部内容-->
      <v-checkstand :PC="isPC()" :title='title' :color="true"></v-checkstand>
      <div class="bank_h5" :class="{'bank_PC':isPC()}" >
        <h3 v-if="isPC()">您正在为订单尾号为<span v-if="PayOrder">{{PayOrder.substring(PayOrder.length-9)}}</span>的订单进行在线支付</h3>
        <div class="content">
          <div class="total" v-if="isPC()">
            <span class="text">支付总额：</span>
            <span class="number">¥ {{PayMoney}}</span>
          </div>
          <p v-if="bankNo">{{bankName}} <span class="Arial">{{bankNo.replace(bankNo.substring(bankNo.length-10, bankNo.length-4), '******')}}</span></p>
          <div class="ipt_box" :class="{'active':CVNPC !== ''}" id="CVN_box" v-if="CardTp">
            <span>CVN2</span>
            <input type="number" class="bank_number" placeholder="卡片背面三位数字，示例：878
" v-model="obj.CVN" @focus="fnFocus(1,'CVN','CVN_box','CVN_ipt')" @blur = "fnBlur()" id="CVN_ipt">
            <i class="icon-tishi icon-info iconfont" style="margin-left:10px;" @click="imgShow(11)" v-if="!isPC()"></i>
            <img src="./number.png" alt="" v-if="isPC() && imgTab === 1">
          </div>
          <h4 v-if="isPC() && (imgTab === 5 || CVNPC !=='') && CardTp === true">{{CVNPC}}</h4>
          <div class="ipt_box" :class="{'active':datePC !== ''}" id="date_box" v-if="CardTp">
            <span>有效期</span>
            <input type="number" class="bank_number"  placeholder="卡片正面月份年份，示例：0820" v-model="date"  @focus="fnFocus(2,'Date','date_box','date_ipt')" @blur = "fnBlur()" id="date_ipt">
             <i class="icon-tishi icon-info iconfont icon-info2" style="margin-left:7px" @click="imgShow(12)" v-if="!isPC()"></i>
            <img src="./date.png" alt="" v-if="imgTab === 2 && isPC()">
          </div>
          <h4 v-if="isPC() && (imgTab === 5 || datePC !== '') && CardTp === true">{{datePC}}</h4>
          <div class="ipt_box" :class="{'active':this.phonePC !== ''}" id="tel_box">
            <span>手机号</span>
            <input type="number" class="bank_number" v-model = "obj.PhoneNo" placeholder="银行预留的手机号"  @focus="fnFocus(3,'tel','tel_box','ipt_box')" @blur = "fnBlur()" id="ipt_box"> 
          </div>
          <h4 v-if="isPC() && (imgTab === 5 || this.phonePC !=='')">{{this.phonePC}}</h4> 
          <div class="msg_box">
            <span>验证码</span>
            <input type="number" class="bank_number" placeholder="6位" @focus="fnFocus()" @blur = "fnBlur()" v-model="tem_msg" >
          </div>
          <a href="javascript:" class="msg_btn" @click="countdown()" ref="bankBTn">获取手机验证码</a>
          <h4 v-if="isPC() && imgTab === 6">{{this.tem_msg_PC}}</h4>
          <a v-show="CardTp" class="next btn-hooke" :class="{'activeA':obj.CVN.length === 3 && date.length === 4 && obj.PhoneNo.length === 11 && tem_msg.length === 6}" @click="sub()" id="btn-hookf">确认提交{{entere}}</a>
          <a v-show="!CardTp" class="next btn-hooke" :class="{'activeA':obj.PhoneNo.length === 11 && tem_msg.length === 6}" @click="suba()" id="btn-hookfa">确认提交{{entere}}</a>
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
      <!--<v-copyright :PC="isPC()"></v-copyright>-->
      <div class="err_msga" v-show="maskHide && !isPC() && warmInfo !== ''" ref="errMsg">{{warmInfo}}</div>
      <div class="err_msg" v-show="maskHide && !isPC() && (imgTab === 11 || imgTab === 12)">
        <div class="close">
          <span class="icon-PCclose iconfont" @click="maskshow ($event)"></span>
        </div>
        <h3>如下图圆圈内位置所示</h3>
        <img src="./number.png" alt="" v-if="imgTab === 11">
        <img src="./date.png" alt="" v-if="imgTab === 12">
      </div>
      <transition name="moveMask">
        <div class="mask" v-if="!isPC() && maskHide" @click="maskshow()"></div>
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
    name: 'bindBank',
    props: {
      Data: {
        type: Object
      }
    },
    data () {
      return {
        title: '绑定银行卡',
        maskHide: false, // 浮层隐藏
        obj:{
          AccNo: '', // 银行卡号
          CVN: '', // CVN 值
          Year: '', // 年份
          Month: '', // 年份
          PhoneNo: '',// 手机号码 
          paypalId: ''
        },
        tem_msg: '', // 验证码
        date: '', // 日期的值
        imgTab: 0, // 1表示调用CVN格式错误图片  2表示date格式错误图片
        n: 59, // 倒计时时间设定
        bl:true,
        PayMoney:null, // 银联支付总金额
        PayOrder: null, //银联支付订单编号 
        bankNo:null, // 银行卡号
        bankName: null, // 银行的名称
        prom: null, // 错误提示信息
        warmInfo: '', //错误提示信息
        CVNPC: '',//PC下CVN格式验证
        datePC: '',//PC下date格式验证
        phonePC:'',
        tem_msg_PC: '',
        timer: null,
        windowChange: true,// 解决移动端软件盘出现将底部定位顶上去
        CardTp:true // 借记卡


      }
    },
    computed: {
      entere () {
          this.enterPublick('btn-hookf',this.obj.CVN.length === 3 && this.date.length === 4 && this.obj.PhoneNo.length === 11 && this.tem_msg.length === 6)

          this.enterPublick('btn-hookfa',this.obj.PhoneNo.length === 11 && this.tem_msg.length === 6)
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    watch: {
        tem_msg() {
            if (this.tem_msg.length > 6) {
                this.tem_msg = String(this.tem_msg).slice(0, 6)
            }
        }
    },
    mounted () {
      this.PayMoney = this.getCookie('PayMoney')
      this.PayOrder = this.getCookie('CashierInfoId') 
      this.bankNo = this.getCookie('bankNo')
      this.bankName = this.getCookie('bankName')
      this.obj.AccNo = this.getCookie('bankNo')
      this.obj.paypalId = this.getCookie('PaypalId') 
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
         //银联卡小屏下显示在屏幕底部
          let app = document.getElementById('app')
          if(app.offsetHeight < 640){
            let bankH5 = document.getElementsByClassName('bindbank')[0]
            let bankInfo = document.getElementsByClassName('bank_info')[0]
            bankH5.style.height = 640 + 'px'
            bankInfo.style.position = "absolute"
          }
      } 
      if (decodeURIComponent(this.$route.query.CardTp) === 'undefined'){
        this.CardTp = false 
      } else {
        this.CardTp = true
      }
      if(this.isPC()){
          document.getElementById('app').className = "active"
      }
    },
    methods: {
      // 浮层显示隐藏
      maskshow () {
        this.imgTab = 0
        this.maskHide = false
      },
      fnFocus (num,str,id,iptID) {
        let el = document.getElementById(id)
        let ipt = document.getElementById(iptID)
        let This = this
        if (num === 1) {
          ipt.oninput = function(){
            if (This.obj.CVN === null || This.obj.CVN ==='') {
              This.CVNPC = 'CVN 不能为空'
            } else if(This.obj.CVN.length > 3) {         
              This.CVNPC = 'CVN 格式错误'
            } else {
              This.CVNPC = ''
            }
          }
           this.imgTab = 1
        } else if (num === 2){
         // let str = This.date.replace('/','')
          This.obj.Year = This.date.substring(2)
          This.obj.Month = This.date.substring(0,2)
          ipt.oninput = function(){
            if (This.date === null || This.date ==='') {
              This.datePC = '日期格式不能为空'
            } else if(This.date.length > 4) {
              This.datePC = '日期格式错误'
            }else {
              This.datePC = ''
            }
          }
          this.imgTab = 2  
        }else if(num === 3){
           this.imgTab = 0
          ipt.oninput = function(){
             if (This.obj.PhoneNo === null || This.obj.PhoneNo ==='') {
               This.phonePC = '手机号不能为空'
             } else if(This.obj.PhoneNo.length > 11){          
               This.phonePC = '手机号格式错误'
             } else {
               This.phonePC = ''
             }
           }
        }else{
          this.imgTab = 0 
        }
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
      // 倒计时
      countdown () {
        if(this.isPC()){
          this.imgTab = 5
          this.validationPC (1)
        } else{
          if(this.CardTp){//不是借记卡进行验证
            this.validation (1)
          }
        }

        if (this.obj.CVN.length === 3 && this.date.length ===4 && this.obj.PhoneNo.length ===11) {
          this.countdownAsync()
        }else if(!this.CardTp){//是借记卡发送验证码
          this.telMsg ()
          if(this.obj.PhoneNo.length ===11){
            this.countdownAsync()
          }
        }
      },
      countdownAsync: async function () {
        if (this.bl) {
          this.bl = false
          let This = this
          let params = this.obj
          const res = await this.$root.http.post('/mvc/union/FirstBindCardAndSmsCode', params,this)
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
             if(!This.isPC()){
               This.maskHide = true
               This.imgTab = 0
               This.warmInfo = res.data.Msg
               //This.$refs.errMsg.innerHTML = res.data.Msg
             }else {
               This.$root.bool = true
               This.prom = res.data.Msg
             } 
             This.bl = true
          }
        }
     },
      // 提交信息
      sub () {
        this.imgTab = 6
        this.validation (2)
        if (this.obj.CVN.length === 3 && this.date.length === 4 && this.obj.PhoneNo.length === 11 && this.tem_msg.length === 6) {
            this.subAsync()
        }
      },
      suba () {
        this.imgTab = 6
        this.validation (2)
        if (this.obj.PhoneNo.length === 11 && this.tem_msg.length === 6) {
            this.subAsync()
        }
      },
      subAsync:async function () {
       let params = {
          'verifyNum': this.tem_msg,
          'bankNo': this.obj.AccNo,
          'paypalId': this.getCookie('PaypalId')
       }
       const res = await this.$root.http.post('/mvc/union/UnionPay', params,this)
       if (res.data.Flag === 1) {
            this.setCookie('orderId',res.data.Data.CashierInfoID)
            //window.localStorage.orderId = res.data.Data.CashierInfoID
            this.$router.push({path: '/success'})
       } else if (res.data.Flag === 0 ){
          if (!this.isPC()){
            this.maskHide = true
            this.warmInfo = res.data.Msg
            this.imgTab = 0
            //this.$refs.errMsg.innerHTML = res.data.Msg
          } else {
            this.$root.bool = true
            this.prom = res.data.Msg
          }
       }
     },
      // 图片显示
      imgShow (num) {
        if(num === 11){         
          this.imgTab = num
        } else {
          this.imgTab = num
        }
        this.maskHide = true
      },
      // 验证格式是否正确
      validation (num) {
        // 1 表示获取验证码是验证  2 表示提交时再次验证
        // CVN验证
        if(num === 1){
          if (this.obj.CVN === null || this.obj.CVN ==='') {
            this.maskHide = true
            return  this.warmInfo = 'CVN 不能为空'
          } else if(!(/^\d{3}$/.test(this.obj.CVN))) {
            this.maskHide = true
            return  this.warmInfo = 'CVN 格式错误'
          } else {
            this.warmInfo = ''
          }
          
          // 日期格式验证
          let str = this.date.replace('/','')
          this.obj.Year = this.date.substring(2)
          this.obj.Month = this.date.substring(0,2)
          if (this.date === null || this.date ==='') {
            this.maskHide = true
            return  this.warmInfo = '日期格式不能为空'
          } else if(!(/^\d{4}$/.test(str))) {
            this.maskHide = true
            return  this.warmInfo = '日期格式错误'
          } else {
            this.warmInfo = ''
          }
          //手机号码验证
          if (this.obj.PhoneNo === null || this.obj.PhoneNo ==='') {
            this.maskHide = true
            return  this.warmInfo = '手机号不能为空'
          } else if(!(/^1[34578]\d{9}$/.test(this.obj.PhoneNo))){ 
            this.maskHide = true
            return  this.warmInfo = '手机号格式错误'
          } else {
            this.warmInfo = ''
          }
        }
        if (num === 2){
          //短信验证码验证
          if (this.tem_msg === null || this.tem_msg ==='') {
            this.maskHide = true
            return  this.warmInfo = '短信验证码不能为空'
          } else if(!(/^\d{6}$/.test(this.tem_msg))){ 
              this.maskHide = true
              return  this.warmInfo = '短信验证码格式错误'
          } else {
            this.warmInfo = ''
          }
        }       
      },
      // 验证格式是否正确
      validationPC (num) {
        // 1 表示获取验证码是验证  2 表示提交时再次验证
        // CVN验证
       
        if (this.obj.CVN === null || this.obj.CVN ==='') {
          this.CVNPC = 'CVN 不能为空'
        } else if(!(/^\d{3}$/.test(this.obj.CVN))) {         
          this.CVNPC = 'CVN 格式错误'
        } else {
          this.CVNPC = ''
        }
        
        // 日期格式验证
        let str = this.date.replace('/','')
        this.obj.Year = this.date.substring(2)
        this.obj.Month = this.date.substring(0,2)
        if (this.date === null || this.date ==='') {
          this.datePC = '日期格式不能为空'
        } else if(!(/^\d{4}$/.test(str))) {
          this.datePC = '日期格式错误'
        }else {
          this.datePC = ''
        }
       
        //手机号码验证
        if (this.obj.PhoneNo === null || this.obj.PhoneNo ==='') {
          this.phonePC = '手机号不能为空'
        } else if(!(/^1[34578]\d{9}$/.test(this.obj.PhoneNo))){          
          this.phonePC = '手机号格式错误'
        } else {
          this.phonePC = ''
        }
        if (num === 2){
          //短信验证码验证
          if (this.tem_msg === null || this.tem_msg ==='') {
            this.tem_msg_PC = '短信验证码不能为空'
          } else if(!(/^\d{6}$/.test(this.tem_msg))){ 
              this.tem_msg_PC = '短信验证码格式错误'
          } else {
            this.tem_msg_PC = ''
          }
        }       
      },
      // 手机号验证
      telMsg () {
        if(this.isPC()){
          //手机号码验证
          if (this.obj.PhoneNo === null || this.obj.PhoneNo ==='') {
            this.phonePC = '手机号不能为空'
          } else if(!(/^1[34578]\d{9}$/.test(this.obj.PhoneNo))){          
            this.phonePC = '手机号格式错误'
          } else {
            this.phonePC = ''
          }
        }else{
          //手机号码验证
          if (this.obj.PhoneNo === null || this.obj.PhoneNo ==='') {
            this.maskHide = true
            return  this.warmInfo = '手机号不能为空'
          } else if(!(/^1[34578]\d{9}$/.test(this.obj.PhoneNo))){ 
            this.maskHide = true
            return  this.warmInfo = '手机号格式错误'
          } else {
            this.warmInfo = ''
          }
        }
      }
    },
    components: {
      'v-checkstand': CheckStand,
      'v-copyright': Copyright,
      'v-modal': Modal
    }
  }
</script scope>
<style lang="stylus" rel="stylesheet/stylus">
  .bindbank
    position:relative
    .bank_h5
      .content
        padding:0px 36px
        .ipt_box
          position:relative
          width:100%
          border:1px solid #D3D3D3 
          background:rgba(255,255,255,1)
          border-radius: 45px 
          margin-top:15px
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
            height:27px
            font-size:14px
            color:#535353
            overflow:hidden
          .icon-info
            color:#90704D
            display:inline-block
            font-size:20px
            position:absolute
            top:11px
            right:15px
          img
            position:absolute
            top:0px
            right:-159px
            width:137px
            height:85px
            background-size:137px 85px
        h4
          font-size:14px
          color:rgba(192,25,31,1)
          line-height:24px
          color:#C0191F
          text-align:left
          margin-left:76px
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
            border-radius:0px 45px 45px 0px
            color:#535353
        .msg_btn
          display:inline-block
          margin-left:1.9%
          width:45% 
          outline:none
          border:none
          height:43px
          line-height:43px
          text-align:center
          font-size:14px
          border-radius: 45px
          border:1px solid #90704D 
          background:#fff
          color:#90704D
          cursor:pointer
          &.active
            background:#90704D
        p
          margin:26px 0px 20px 0px
          text-align:center
          height:24px; 
          font-size:17px;
          font-weight:bold
          color:rgba(83,83,83,1);
          line-height:24px
          span
            font-size:17px
            color:#535353
            font-weight:bold
            font-family:Arial
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
          margin-top:30px
          width:100%
          text-align:center
          &.activeA
            background:#C0191F
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
      .content
        margin:0px 40px
        width:409px
        text-align:center
        padding:0px 0px
        .total
          width:409px
          height:50px
          background:rgba(249,248,246,1)
          border-radius: 31px 
          text-align:center
          margin-top:15px
          .text
            font-size:20px
            font-weight:bold
            color:rgba(83,83,83,1)
            line-height:50px
          .number
            font-size:20px
            font-weight:bold
            color:#C0191F
            font-family:Arial
            line-height:50px
        p
          margin:33px 0px 33px 0px
          text-align:center
          height:24px; 
          font-size:17px;
          font-weight:bold
          color:rgba(83,83,83,1);
          line-height:24px
          span
            font-size:17px;
            font-weight:bold
            color:rgba(83,83,83,1)
            font-family:Arial
        .ipt_box
          width:300px
          margin-left:55px
          margin-top:20px
          text-align:left
          span
            display:inline-block
            margin:0px 20px
            height:38px 
            font-size:14px
            color:rgba(151,151,151,1)
            line-height:38px
            width:42px
          .bank_number
            outline:none
            border:none
            height:28px
            line-height:28px
            padding:5px 0px
            font-size:14px
            width:202px
            border-radius:0px 50px 50px 0px
          img
            right:-163px
          &.active
            border:1px solid #C0191F

        .msg_box
          position:relative
          width:146px
          border:1px solid #D3D3D3 
          background:rgba(255,255,255,1)
          border-radius: 45px 
          margin-top:20px
          display:inline-block
          span
            display:inline-block
            margin:0px 20px
            height:38px 
            font-size:14px
            color:rgba(151,151,151,1)
            line-height:38px
          .bank_number
            outline:none
            border:none
            height:28px
            line-height:28px
            padding:5px 0px
            font-size:14px
            width:59px
            border-radius:0px 45px 45px 0px
        .msg_btn
          display:inline-block
          margin-left:6px
          width:139px 
          outline:none
          border:none
          height:38px
          line-height:38px
          font-size:14px
          border-radius: 45px
          border:1px solid #90704D 
          background:#fff
          color:#90704D
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
          width:300px
          margin-bottom:67px
          margin-top:45px
          font-size:20px
          height:50px
          line-height:50px
      .bank_info
        position:static
        position:absolute
        right:0px
        top:275px
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

  .err_msga
    position:fixed
    width:250px
    padding:16px 25px
    background:rgba(255,255,255,1)
    border-radius: 25px 
    left:50%
    top:50%
    margin-left:-150px
    margin-top:-50px
    z-index:20
    text-align:center
    font-size:14px
    color:rgba(83,83,83,1)
    line-height:18px
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
        top:0px
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
    .bindbank  
      .bank_h5 
        .content
          padding:0px 20px
          .msg_box 
            span
              margin:0px 16px
          .msg_btn
              font-size:13px
          .ipt_box
            .icon-info
              margin-left:-5px !important
            .icon-info2
              margin-left:-10px !important
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