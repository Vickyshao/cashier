<template>
  <div id="app" :class="{'active':isPC()}">
      <div class="myContent">
        <router-link to="/main"></router-link>
        <router-view></router-view>
        <div id="loading" v-show="this.$root.loading">
          <div class="mask_bg"></div>
          <div class="textPC" v-if="isPC()">
             <img src="./loadingSmall.gif">
          </div>
          <div class="textH5" v-if="!isPC()">
             <img src="./loading.gif">
          </div>
        </div>
      </div>
     <v-copyright v-if="isPC()"></v-copyright>
  </div>
</template>
<script type="text/ecmascript-6">
import Copyright from '@/components/copyright/Copyright'
export default {
  name: 'app',
  data() {
    return {
      screenWidth: document.body.clientWidth
    }
  },
  mounted () {
    if (this.isPC()){
      // PC访问字体变成微软雅黑
      document.getElementsByTagName('body')[0].style.fontFamily = 'Microsoft YaHei'
    }
  },
  computed:{
  },
  components: {
      'v-copyright': Copyright
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
body,html
  height:100%
  #app 
    position:relative
    height:100%
    .myContent
      min-height:90%
    &.active
        max-width:1000px
        min-width:1000px
        margin:0 auto
    #loading
        position:fixed
        top:0px
        left:0px
        bottom:0px
        right:0px
        z-index:50
        .mask_bg
            position:fixed
            top:0px
            left:0px
            width:100%
            height:100%
            z-index:50
            background: rgba(0,0,0,0.30)
            filter:blur(10px)
        .textPC
          position:fixed
          top:50%
          left:50%
          width:330px
          height:100px  
          margin-left:-165px
          margin-top:-50px
          z-index:50
          text-align:center
        .textH5
          position:fixed
          top:50%
          left:50%
          width:200px
          height:61px  
          margin-left:-100px
          margin-top:-30px
          z-index:50
          text-align:center
          img
            width:100%
          p
            color:rgb(250,250,250)
            margin-top:-20px
    .highlight   
      margin:0 auto
      margin-top:10px
      max-width:1000px
      min-width:1000px
      box-shadow: 0 0 10px rgba(0,0,0,0.20)
.fullbody
  .payment_wrapper
    .payment
      .payment_h5
        .footer
          display:none
    .interal_aa
      .integral_wrapper
        .integral
          .integral_h5
            position:absolute !important
            bottom:0px
      .integral_wrappera
        .integral
          .integral_h5
            position:absolute !important
            bottom:0px
    .mask
      position:absolute
</style>
