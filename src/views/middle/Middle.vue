<template>
    <div class="middle_container">
      <!--移动-->
      <v-checkstand :title='title'></v-checkstand>
      <div class="middle_top">
        <span class="iconfont info icon-tishi"></span>
        <p>请确认微信支付是否已完成</p>
      </div>
      <div class="btn_wrap">
        <a href="javascript:;" class="btn btn1" @click="goSuccess">已完成</a>
        <a href="javascript:;" class="btn btn2" @click="goPayment">支付遇到问题，重新支付</a>
      </div>
    </div>
</template>
<script type="text/ecmascript-6" scope>
  import CheckStand from '@/components/checkstand/CheckStand'
  export default {
    data () {
      return {
         title: '首旅如家收银台',
      }
    },
    mounted () {
      this.$root.loading = false;
    },
    methods:{
      goSuccess(){
        this.$router.push({path: '/success',query:{'orderNo':this.$route.query.orderno}})
      },
      goPayment(){
        this.$router.push({path: '/main',query:{'code':this.$route.query.code}})
      }
    },
    components: {
      'v-checkstand': CheckStand,
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped> 
  .middle_container
    height:100%
    background:#fff
    .middle_top
      background:#FAFAFA
      height:200px
      width:100%
      text-align:center
      .info
        display:inline-block
        font-size:51px
        color:#C0191F
        margin-top:51px
      p
        margin-top:22px
        height:25px
        font-size:18px
        font-weight:bold
        color:rgba(83,83,83,1)
        line-height:25px

    .btn_wrap
      text-align:center
      .btn
        display:inline-block
        outline:none
        border:none
        width:278px
        color:#fff
        font-size:20px
        height:45px
        line-height:45px
        border-radius: 58px
        box-sizing:border-box
      .btn1
        margin-top:62px
        background:#C0191F 
      .btn2
        margin-top:54px
        color:#C0191F
        border:1px solid #C0191F
    
</style>