<template>
    <div class="identity_container">
      <!--头部内容-->
      <v-checkstand :PC="isPC()"></v-checkstand>
      <div class="identity_box box-shadow"  :class="{'highlight':isPC(),'identity_box_pc':isPC()}">
          <div class="user_info">
            <span class="user_icon"></span>
            <p>请验证您的住客身份</p>
          </div>
          <div class="ipt_box">
            <ul>
              <li><span>房间号</span><input type="text" placeholder="例如：2306" v-model.trim="roomNum"><span class="err_info" v-show="isPC() && addActive">{{room_err}}</span></li>
              <li class="last" v-show="existCard ==''"><span>身份证</span><input type="text" placeholder="请输入18位身份证号码" v-model.trim="IDCard"><span class="err_info" v-show="isPC() && card_err.length > 0">{{card_err}}</span></li>
              <li class="onlyRead" v-show="existCard !=''"><span>身份证</span><input type="text" :value="existCard" readonly><span class="err_info" v-show="isPC() && card_err.length > 0">{{card_err}}</span></li>
            </ul>
          </div>
          <div class="btn_box" @click.stop.prevent="fnSubmit" :class="{'active':addActive  && !isPC()}">
            <a :class="{'active':addActive && isPC()}">提交{{addClass}}</a>
          </div>
           <div class="pop_dialog" v-show="isPopDialog">
              <div class="mask" @click="dialogShow()"></div>
              <div class="pop_content">
                <a href="javascript:;" class="close iconfont icon-close" @click="dialogShow()"></a>
                <h3>验证失败</h3>
                <p>{{error_info}}</p>
                <a href="javascript:;" class="back active" @click="dialogShow()" v-show="!isPC()">返回重填</a>
                <a href="javascript:;" class="back_order" @click="fnBackOrder" v-show="!isPC()">返回原订单</a>
                <a href="javascript:;" class="back_order" @click="fnBackOrder" v-show="isPC()">返回原订单</a>
                <a href="javascript:;" class="back active" @click="dialogShow()" v-show="isPC()">返回重填</a>
              </div>
            </div>
      </div>
      
      <div class="pop_info" v-show="isPopShow && !isPC()">
        <div class="mask" @click="maskshow()"></div>
        <p>{{pop_info}}</p>
      </div>
     
       
    </div>
</template>
<script type="text/ecmascript-6">
  import CheckStand from '@/components/checkstand/CheckStand'
  export default {
    data () {
      return {
        roomNum: '',
        IDCard:'',
        pop_info:"",
        isPopShow:false,
        addActive:false,
        existCard:"411023198103133212",
        isPopDialog:false,//后台返回错误信息弹框显示
        room_err:"",
        card_err:"",
        error_info:'',
        code:'',
        clickFlag:true
      }
    },
    computed:{
      addClass(){
        this.pop_info = "";
        this.room_err="";
        this.card_err="";
        if(this.existCard == ""){
          //身份证信息不存在的时候
          if(this.roomNum.length >= 3 && this.IDCard.length == 18){
            this.addActive = true;
           
          }else{
            this.addActive = false;
            
          }
        }else{
          //身份证信息存在的时候
          if(this.roomNum.length >= 3){
            this.addActive = true;
             this.clickFlag = true
          }else{
            this.addActive = false;
            this.clickFlag = true
          }
          //身份证加*
          //this.existCard = this.existCard.replace(this.existCard.substr(3,12),"************")
        }
       
      }
      
    },
    mounted(){
      this.existCard = this.$route.query.UserCardNo
    },
    methods:{
      fnSubmit(){
        if(!this.addActive){
          return;
        }
        if(!this.clickFlag){
          return;
        }
        this.clickFlag = false

        let regNum = /^[0-9a-zA-Z]{3,10}$/g;
        let regCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/; 
        if(this.roomNum == ""){
          this.isPopShow = true;
          this.pop_info = "房间号不能为空";
          this.room_err = "房间号不能为空";
          return;
        }
        if(!regNum.test(this.roomNum)){
          this.isPopShow = true;
          this.pop_info = "房间号格式输入不正确";
          this.room_err = "房间号格式输入不正确";
          return;
        }
        if(this.existCard == ""){
          if(this.IDCard == ""){
            this.isPopShow = true;
            this.pop_info = "身份证不能为空";
            this.card_err = "身份证不能为空";
            return;
          }
          if(!regCard.test(this.IDCard)){
            this.isPopShow = true;
            this.pop_info = "身份证格式输入不正确";
            this.card_err = "身份证格式输入不正确";
            return;
          };
        }
        
        //提交接口
        this.fetchData()
      },
       fetchData: async function () {
         let params = {
            roomId:this.roomNum,
            payPalDataId:this.$route.query.PaypalId
          }
          const res = await this.$root.http.post('/mvc/pay/SubRoomBillPay', params,this)
          if (res.data.Flag === 1) {
            this.$router.push({path: '/success',query:{'orderNo':res.data.Data.CashierInfoId}})
          }else{
            this.isPopDialog = true
            this.error_info = res.data.Msg
            this.code = res.data.Data.Code
          }
       },
      maskshow(){
        this.isPopShow = false;
        this.clickFlag = true
      },
      //错误弹框显示
      dialogShow(){
        this.isPopDialog = false;
        this.roomNum = ''
        this.clickFlag = true
      },
      //返回订单页
      fnBackOrder(){
        this.$router.push({path: '/main',query:{'code':this.code}})
      },

    },
    components: {
      'v-checkstand': CheckStand,
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped> 
  .identity_container
    position:relative
    .user_info
      padding-top:30px
      padding-bottom:28px
      text-align:center
      background:#F7F7F7
      .user_icon
        display:inline-block
        width:52px
        height:52px
        background:url("./identity.png") no-repeat
        background-size:52px 52px
      p
        margin-top:12px
        height:25px
        font-size:18px
        font-weight:bold
        color:rgba(83,83,83,1)
        line-height:25px
    .ipt_box
      padding-top:38px
      ul
        text-align:center
        li
          position:relative
          span
            display:inline-block
            width:51px
            height:50px;
            font-size:17px
            color:rgba(83,83,83,1);
            line-height:50px
            margin-right:15px
          input
            border:none
            outline:none
            width:219px
            height:50px
            background:rgba(247,247,247,1)
            border-radius:52px
            border:1px solid rgba(211,211,211,1)
            box-sizing:border-box
            text-align:center
            color:rgba(83,83,83,1)
            font-weight:bold
            font-size:17px
        .last
          margin-top:30px
        .onlyRead
          margin-top:30px
          input
            border:none
            background:#fff
    .btn_box
      position:fixed
      bottom:0px
      left:0px
      right:0px
      height:50px
      background:rgba(211,211,211,1)
      text-align:center
      a
        display:inline-block
        font-size:18px
        color:rgba(255,255,255,1)
        line-height:50px
    .active
      background:#CA101A
    .pop_info
      position:fixed
      top:0px
      left:0px
      bottom:0px
      right:0px
      z-index:8
      .mask
        position:fixed
        top:0px
        left:0px
        width:100%
        height:100%
        z-index:9
        background: rgba(0,0,0,0.30)
        filter:blur(10px)
      p
        position:fixed
        width:264px
        height:53px
        top:50%
        left:50%
        margin-top:-26px
        margin-left:-155px
        padding:0px 23px
        background:rgba(255,255,255,1)
        border-radius:26px
        text-align:center
        font-size:14px
        color:rgba(83,83,83,1)
        line-height:50px
        z-index:10
    .pop_dialog
      position:fixed
      top:0px
      left:0px
      bottom:0px
      right:0px
      z-index:8
      .mask
        position:fixed
        top:0px
        left:0px
        width:100%
        height:100%
        z-index:9
        background: rgba(0,0,0,0.30)
        filter:blur(10px)
      .pop_content
        position:fixed
        width:236px
        top:50%
        left:50%
        transform:translate(-50%,-50%)
        background:#fff
        padding:25px 32px 29px 32px
        border-radius:15px
        text-align:center
        z-index:10
        .close
          position:absolute
          right:15px
          top:15px
          font-size:20px
          color:#D3D3D3
        h3
          font-size:20px
          font-weight:bold;
          color:rgba(83,83,83,1)
          line-height:28px
          margin-bottom:14px
        p
          font-size:16px
          color:rgba(83,83,83,1)
          line-height:23px
          margin-bottom:21px
        .back
          display:block
          width:236px
          height:44px
          background:rgba(255,255,255,1)
          border-radius:22px
          border:1px solid rgba(192,25,31,1)
          font-size:20px
          color:rgba(192,25,31,1)
          line-height:44px
          margin-bottom:22px
        .back_order
          display:block
          width:236px
          height:44px
          background:rgba(255,255,255,1)
          border-radius:22px
          border:1px solid rgba(192,25,31,1)
          font-size:20px
          color:rgba(192,25,31,1)
          line-height:44px
          margin-bottom:22px
        .active
          background:#CA101A
          color:#fff
  .identity_box_pc
    padding-bottom:127px
    .user_info
      padding-top:34px
      padding-bottom:31px
      .user_icon
        display:inline-block
        width:60px
        height:60px
        background:url("./identity.png") no-repeat
        background-size:60px 60px
      p
        height:26px
        font-size:20px
        color:rgba(83,83,83,1)
        line-height:26px
        text-align:center
    .ipt_box
      padding-top:60px
      ul
        li
          span
            margin-left:-66px
          input
            width:238px
          .err_info
            position:absolute
            width:200px
            left:703px
            height:50px
            font-size:17px
            color:rgba(192,25,31,1)
            line-height:50px
            text-align:left

    .btn_box
      position:static
      margin-top:54px
      text-align:center
      background:#fff
      a
        width:238px
        height:50px
        background:rgba(211,211,211,1)
        border-radius:58px
        cursor:pointer
        display:inline-block
        font-size:20px
        color:rgba(255,255,255,1)
        line-height:50px
      .active
        background:#CA101A
    .pop_dialog
      .pop_content
        width:339px
        background:rgba(255,255,255,1);
        border-radius:20px
        padding:28px 39px 37px 39px
        .close
          right:20px
          top:20px
          font-size:16px
        h3
          line-height:26px
          margin-bottom:28px
        p
          line-height:21px
          margin-bottom:35px
          text-align:center
        .back
          display:inline-block
          width:140px
          height:44px
          background:rgba(255,255,255,1)
          border-radius:22px
          border:1px solid rgba(192,25,31,1)
          font-size:18px
          color:rgba(192,25,31,1)
          line-height:44px
          box-sizing:border-box
          margin-bottom:0px
        .back_order
          display:inline-block
          width:140px
          height:44px
          background:rgba(255,255,255,1)
          border-radius:22px
          border:1px solid rgba(192,25,31,1)
          font-size:18px
          color:rgba(192,25,31,1)
          line-height:44px
          box-sizing:border-box
          margin-bottom:0px
          margin-right:20px
        .active
          background:#CA101A
          color:#fff
  ::-webkit-input-placeholder
    color:#D3D3D3
  ::-moz-placeholder
    color:#D3D3D3
  :-ms-input-placeholder
    color:#D3D3D3
  :-moz-placeholder
    color:#D3D3D3
</style>