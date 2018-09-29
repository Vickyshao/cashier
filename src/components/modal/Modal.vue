<template>
    <div class="modal" v-if="prom !== null">
      <div class="content_h5" :class="{'content_PC':isPC()}" v-if="this.$root.bool">
        <div class="title">
          <h3></h3>
          <span class="close iconfont icon-PCclose" @click.stop.prevent="maskHide ($event)"></span>
        </div>
        <div class="text">
          <slot name="msg"></slot>
          <div class="msg">{{prom}}</div>
          <a herf="javascript:;" class="modalBtn" @click="maskHide($event)">关闭</a>
        </div>
      </div>
      <transition name="moveMask">
        <div class="mask" v-show="this.$root.bool" @click="maskHide($event)"></div>
      </transition>
    </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'modal',
    props: {
      prom: {
        type: String
      }
    },
    methods: {
      // 浮层隐藏
      maskHide($event) {
        this.$root.bool = false
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .modal
    position:relative
    .content_h5
      position:relative
      position:fixed
      width:80%
      height:190px 
      top:50%
      margin-left:10%
      background:rgba(255,255,255,1)
      border-radius: 20px 
      margin-top:-95px 
      z-index:80 
      .title
        position:relative
        text-align:center
        h3
          font-size:16px
          color:rgba(47,46,46,1)
          line-height:67px
          height:67px
        span
          position:absolute
          font-size:20px
          color:#D3D3D3
          background:#fff
          top:20px
          right:20px
          cursor:pointer
      .text
        text-align:center
        font-size:16px
        color:#535353 
        width:80%
        margin-left:10%
        .msg
          font-size:16px
          color:rgba(83,83,83,1)
          line-height:21px
          font-size:16px
          color:#535353
          position:relative
          top:-15px 
          text-align:center
        .msgSpan
          font-size:16px
          color:rgba(83,83,83,1)
          line-height:21px
          font-size:16px
          color:#535353
          position:relative
          top:-15px 
          text-align:center
          .color
            color:#C0191F
        .modalBtn
          display:inline-block
          outline:none
          border:none
          width:140px
          height:45px
          line-height:45px
          text-align:center
          background:rgba(192,25,31,1);
          border-radius: 58px
          font-size:18px
          color:#fff  
          margin-top:10px
          cursor:pointer
          &:hover
            background:#CD474C
            transition: all 0.5s ease
    .content_PC
      width:417px
      height:190px 
      left:50%
      margin-left:-208px
    .mask
      position:fixed
      top:0px
      left:0px
      width:100%
      height:100%
      z-index:50
      background: rgba(0,0,0,0.30)
      filter:blur(10px)
      transition:all 0.5s ease
      &.moveMask-enter,&.moveMask-leave-active
        opacity:0
      &.moveMask-enter-active
        opacity:1
</style>