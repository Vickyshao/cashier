<template>
    <div class="classifyH5">
      <!--移动-->
      <div class="classifyH5_h5">
          <ul class="nav nava fix" ref="nav">
            <li class="fl" :class="{'active':cur === 0}" @click="select(0,$event)">
              <span id="sp1" class="active">全部支付方式</span><i class="iconfont" :class="{'icon-down-arrow' :cur !== 0, 'icon-top-arrow' : cur === 0,'pos':andr}" id="icon1"></i>
            </li>
            <li class="fl" :class="{'active':cur === 1}" @click="select(1,$event)">
              <span id="sp2">全部分类</span><i class="iconfont" :class="{'icon-down-arrow' :cur !== 1, 'icon-top-arrow' : cur === 1,'pos':andr}" id="icon2"></i>
            </li>
            <li class="fl" :class="{'active':cur === 2}" @click="select(2,$event)">
              <span id="sp3">全部状态</span><i class="iconfont" :class="{'icon-down-arrow' :cur !== 2, 'icon-top-arrow' : cur === 2,'pos':andr}" id="icon3"></i>
            </li>
          </ul>
          <transition name="fold">
            <div class="selected" v-show="cur !== null">
              <ul id="ula">
                <li v-for="(item, index) in itemArr"  @click="search(1,item.Code,$event,index)">{{item.Name}}</li>
              </ul>
            </div>
          </transition>
          <transition name="moveMask">
            <div class="mask mask-hook" v-show="cur !== null" @click="maskHide($event)"></div>
          </transition>
      </div> 
    </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'classifyH5',
    data () {
      return {
        allPay: [],
        allClass: [],
        allStatus: [],
        itemArr: [],
        cur: null,
        arra: 0,
        arrb: 0,
        arrc:0,
        arrd:0,
        andr:false
      }
    },
    created () {
      this.$root.eventHub.$on('classData', this.arg)
    },
    mounted () {
      this.addPos()
    },
    methods: {
      // 显示当前选择内容
      select (num) {
          if(!this.isPC()){
            if (num === 0) {
               this.itemArr = this.allPay
               this.$nextTick(function(){
                aaa(this.arra)
               }) 
            } else if (num === 1) {
               this.itemArr = this.allClass
                this.$nextTick(function(){
                  aaa(this.arrb)
               }) 
            } else if (num === 2) {
               this.itemArr = this.allStatus
               this.$nextTick(function(){
                  aaa(this.arrc)
               }) 
            }
            this.cur = num
            let This = this
            function aaa(arg){
              This.$nextTick(function(){
                let ul = document.getElementById('ula')
                let aLi = ul.children
                if (This.cur === 0){
                     document.getElementById('sp1').style.color = '#B00018'
                     document.getElementById('sp1').style.fontWeight = 'bold'
                     document.getElementById('icon1').style.color = '#B00018'
                     
                    document.getElementById('sp2').style.color = ''
                    document.getElementById('sp2').style.fontWeight = 'normal'
                    document.getElementById('icon2').style.color = ''
                    document.getElementById('sp3').style.color = ''
                    document.getElementById('sp3').style.fontWeight = 'normal'
                    document.getElementById('icon3').style.color = ''
                     
                   } else if (This.cur === 1) {
                    document.getElementById('sp2').style.color = '#B00018'
                    document.getElementById('sp2').style.fontWeight = 'bold'
                    document.getElementById('icon2').style.color = '#B00018'
                   
                   document.getElementById('sp1').style.color = ''
                   document.getElementById('sp1').style.fontWeight = 'normal'
                   document.getElementById('icon1').style.color = ''
                   document.getElementById('sp3').style.color = ''
                   document.getElementById('sp3').style.fontWeight = 'normal'
                   document.getElementById('icon3').style.color = ''
                   
                   } else if (This.cur === 2) {
                      document.getElementById('sp3').style.color = '#B00018'
                      document.getElementById('sp3').style.fontWeight = 'bold'
                      document.getElementById('icon3').style.color = '#B00018'
                     document.getElementById('sp1').style.color = ''
                     document.getElementById('sp1').style.fontWeight = 'normal'
                     document.getElementById('icon1').style.color = ''
                     document.getElementById('sp2').style.color = ''
                     document.getElementById('sp2').style.fontWeight = 'normal'
                     document.getElementById('icon2').style.color = ''
                      
                   }
                    for(let i=0;i<aLi.length;i++){
                     aLi[i].className = ''
                     if(i !== arg){
                       if (This.cur === 0) {
                         aLi[This.arra].className = 'graya'
                       } else if (This.cur === 1) {
                         aLi[This.arrb].className = 'graya'
                       } else if (This.cur === 2) {
                         aLi[This.arrc].className = 'graya'
                       }

                     }
                   }  
              })
               
               
            }
          }
          
      },
      // 浮层隐藏
      maskHide (event) {
        this.cur = null
        document.getElementById('sp1').style.color = '#2f2e2e'
        document.getElementById('sp1').style.fontWeight = 'normal'
        document.getElementById('icon1').style.color = '#d3d3d3'
         document.getElementById('sp2').style.color = '#2f2e2e'
        document.getElementById('sp2').style.fontWeight = 'normal'
        document.getElementById('icon2').style.color = '#d3d3d3'
         document.getElementById('sp3').style.color = '#2f2e2e'
        document.getElementById('sp3').style.fontWeight = 'normal'
        document.getElementById('icon3').style.color = '#d3d3d3'
      },
      arg (arg) {
          this.allPay = arg.PaymentMethods
          this.allClass = arg.PaymentType
          this.allStatus = arg.PaymentStates  
      },
      search (page, Code, event,iNow) {
        if(!this.isPC()){
          if (this.cur === 0) {
             this.arra = iNow
             this.arrd = iNow
          } else if (this.cur === 1) {
             this.arrb = iNow
             this.arrd = iNow
          } else if (this.cur === 2) {
            this.arrc = iNow
            this.arrd = iNow
          }

          this.$nextTick(function(){
               let ul = document.getElementById('ula')
               let aLi = ul.children
            if (this.cur === 0){
                if(event.target.innerHTML.length > 4){
                  document.getElementById('sp1').classList.add('active')
                }else {
                  document.getElementById('sp1').classList.remove('active')
                }
                 document.getElementById('sp1').innerHTML = event.target.innerHTML 
               } else if (this.cur === 1) {
                  if(event.target.innerHTML.length > 4){
                    document.getElementById('sp2').classList.add('active')
                  }else {
                    document.getElementById('sp2').classList.remove('active')
                  }
                 document.getElementById('sp2').innerHTML = event.target.innerHTML   
               } else if (this.cur === 2) {
                if(event.target.innerHTML.length > 4){
                  document.getElementById('sp3').classList.add('active')
                }else {
                  document.getElementById('sp3').classList.remove('active')
                }
                 document.getElementById('sp3').innerHTML = event.target.innerHTML
               }
               document.getElementById('sp1').style.color = '#2f2e2e'
               document.getElementById('sp1').style.fontWeight = 'normal'
               document.getElementById('icon1').style.color = '#d3d3d3'
                document.getElementById('sp2').style.color = '#2f2e2e'
               document.getElementById('sp2').style.fontWeight = 'normal'
               document.getElementById('icon2').style.color = '#d3d3d3'
                document.getElementById('sp3').style.color = '#2f2e2e'
               document.getElementById('sp3').style.fontWeight = 'normal'
               document.getElementById('icon3').style.color = '#d3d3d3'
               for(let i=0;i<aLi.length;i++){
                 aLi[i].className = ''
                  if(i !== this.arrd){
                    if (this.cur === 0) {
                      aLi[this.arra].className = 'gray'
                    } else if (this.cur === 1) {
                      aLi[this.arrb].className = 'gray'
                    } else if (this.cur === 2) {
                      aLi[this.arrc].className = 'gray'
                    }   
                  } 
               }
               this.$root.eventHub.$emit('searchaa', page, Code, this.cur) 
               this.cur = null
            })  
         }  
      },
      // 为了兼容andr  icon 位置
      addPos () {
        if(!this.isPC()){
          let ua = navigator.userAgent.toLowerCase(); 
          if (/android/.test(ua)) {
            this.andr = true
          }
        }   
      }
      
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
  .classifyH5 
    position:fixed
    bottom:0px
    left:0px
    right:0px
    background: #F7F7F7
    box-shadow: 0 -2px 2px 0 rgba(0,0,0,0.10)
    z-index:30
    .classifyH5_h5
      .nav
        width:100%
        background:#F7F7F7
        li
          width:33.33333%
          text-align:center
          padding:15px 0px
          span
            display:inline-block
            font-size: 15px
            color: #2F2E2E
            margin-right:5px
            overflow: hidden
            text-overflow:ellipsis
            white-space: nowrap 
            line-height:19px        
          i
            font-size: 12px
            color:#D3D3D3
            display:inline-block
            position:relative
            top:-0px
          .pos 
            position:relative
            top:-5px
          span.active
            width:74px
            overflow: hidden
            text-overflow:ellipsis
            white-space: nowrap
      .selected
        position:fixed
        left:0px
        bottom:48px
        width:100%
        z-index:-1
        background:#fff
        height: 300px
        overflow-y: scroll
        &.fold-enter-active,&.fold-leave-active
          transition:all 0.5s ease
        &.fold-enter-active
          transform:translate3d(0,20,0)
        &.fold-enter,&.fold-leave-active
          transform:translate3d(0,100%,0)
        h3
          box-shadow: 0 1px 0 0 #EBEBEB
          font-size: 15px
          color: #535353
          line-height:50px
          text-align:center
        #ula
          li
            // box-shadow: 0 1px 0 0 #EBEBEB
            border-bottom:1px solid #EBEBEB
            text-align:center
            font-size: 15px
            color: #535353
            height:49px
            line-height:49px
            &.gray
              color:#fff
              background:#C0191F
 
            &.graya
              color:#D3D3D3
              background:#fff 
      .mask
        position:fixed
        top:0px
        left:0px
        width:100%
        height:100%
        z-index:-2
        background: rgba(0,0,0,0.30)
        filter:blur(10px)
        transition:all 0.5s ease
        &.moveMask-enter,&.moveMask-leave-active
          opacity:0
        &.moveMask-enter-active
          opacity:1

</style>