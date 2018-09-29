<template>
    <div class="err" id="err">
      <!--移动-->
      <v-checkstand :title='title'></v-checkstand>
      <div class="err_h5" :class="{'err_PC':isPC()}">
        <div class="err-img">
          <img src="./err.png" alt="">
        </div>
        <p class="err-msg">{{Msg}}</p>
        <div class="contact">
          <h3>如需帮助请联系客服</h3>
          <a href="tel:400 820 3333">400 820 3333</a>
          或 <a href="tel:1010 3333">1010 3333</a>
        </div>
        <router-link to="/order" class="btn">返回我的支付列表</router-link>
      </div>
      <!--<v-copyright v-if="isPC()" :bottom="true"></v-copyright>-->
    </div>
</template>
<script type="text/ecmascript-6" scope>
  import CheckStand from '@/components/checkstand/CheckStand'
  import Copyright from '@/components/copyright/Copyright'
  export default {
    name: 'err',
    data () {
      return {
        title: '首旅如家收银台',
        Msg:'出现未经处理的异常'
      }
    },
    beforeDestroy() {
      document.getElementById('app').style.background =""
    },
    mounted () {
      this.$root.loading = false     
      if(this.isPC()){
          document.getElementById('app').className = "active"
          document.getElementById('err').style.background = "#fff"
      }else{
        document.getElementById('app').style.background ="#fafafa"
      }
      if (this.$route.query.Msg) {
        this.Msg = decodeURIComponent(this.$route.query.Msg)  
      }else{
        this.Msg = '出现未经处理的异常'
      }
    },
    components: {
      'v-checkstand': CheckStand,
      'v-copyright': Copyright
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope> 
  .err
    height:100%
    background:#FAFAFA
    .err_h5
      text-align:center
      .err-img
        width:66px
        height:75px
        margin:0 auto
        padding-top:95px
        img
          display:inline-block
          width:100%
          height:100%
          background-size:66px 75px
      p
        margin-top:10px
        font-size:22px;
        color:#5C5E6A
        line-height:30px
      .contact
        margin-top:26px
        font-size:15px
        color:rgba(151,151,151,1)
        line-height:22px
        a
          font-size:15px
          color:rgba(151,151,151,1)
          line-height:22px
          font-family:Arial
      .btn
        display:inline-block
        margin-top:85px
        outline:none
        border:none
        padding:0px 39px
        background:#C0191F 
        color:#fff
        font-size:18px
        height:45px
        line-height:45px
        border-radius: 58px
    .err_PC
      position:relative
      box-shadow: 0 0 10px rgba(0,0,0,0.20)
      .err-img
        margin-top:0px
        padding-top:90px
      p
        margin-top:14px
        line-height:35px
        font-size:26px;
      .contact
        margin-top:14px
        font-size:16px
        line-height:21px
        h3
          display:inline-block
        a
          font-size:16px
          line-height:21px

      .btn
        margin-top:57px
        margin-bottom:100px
        font-size:20px
        &:hover
            background:#CD474C
            transition: all .3s ease
</style>