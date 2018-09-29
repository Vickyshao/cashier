<template>
    <div class="copyright" v-show="isPC()" id="copyright">
      <h3>版权所有 © 2014 Homeinns Co.,Ltd All Rights Reserved. </h3>
    </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'copyright',
    props:{
      bottom:{
        type:Boolean
      }
    },
    mounted () {
      if(this.bottom){
        let el = document.getElementsByClassName('copyright')[0]
        el.style.position = 'absolute'
        el.style.bottom = '0px'
        el.style.width = '1000px'
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
  .copyright 
    text-align:center
    h3
      padding:20px 0px 15px
      font-size: 14px
      color: #535353
      line-height:20px
</style>