<template>
  <div class="pagePC" v-show="isPC() && totalPage>1">
    <ul class="pagination" >
        <li v-show="current != 1"><a href="javascript:;" class="icon iconfont icon-back" @click="current-- && goto(current--)"></a></li>
        <li v-for="index in pages" @click="goto(index)" :class="{'active':current === index}" :key="index">
          <a href="javascript:;" >{{index}}</a>
        </li>
        <li v-show="totalPage > showItem && totalPage !== mid"><a href="javascript:;"  class="dian"><span></span><span></span><span></span></a></li>
        <li v-show="totalPage > showItem && totalPage !== mid"><a href="javascript:;" @click="goto(totalPage)">{{totalPage}}</a></li>
        <li v-show="totalPage != current && totalPage != 0 "><a href="javascript:;" class="icon iconfont icon-right-arrow" @click="current++ && goto(current++)"></a></li>
    </ul>
  </div>  
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'pagePC',
    props: {
      totalPage: {
        type: Number
      },
      page: {
        type: Number
      }
    },
    data () {
      return {
        current: 1,
        showItem: 4,
        mid: 0
      }
    },
    computed: {
      pages () {
        let pag = []
        this.current = this.page
        if (this.current < this.showItem) { // 如果当前的激活的项 小于要显示的条数
             // 总页数和要显示的条数那个大就显示多少条
             let i = Math.min(this.showItem, this.totalPage)
             while (i) {
                 pag.unshift(i--)
             }
         } else { // 当前页数大于显示页数了
             let middle = this.current - Math.floor(this.showItem / 2) // 从哪里开始
             let i = this.showItem
             if (middle > (this.totalPage - this.showItem)) {
                 middle = (this.totalPage - this.showItem) + 1
             }
             while (i--) {
                 pag.push(middle++)
             }
         }
         this.mid = pag[pag.length - 1]
         return pag
      }
    },
    methods: {
      goto (index) {
        console.log(index)
        console.log(this.current)
        if (index === this.current) return
          this.current = index
          // 这里可以发送ajax请求
          this.$root.eventHub.$emit('ajax', this.current)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
  .pagination
      position: relative
      text-align:center
      margin-top:41px
      margin-bottom:74px
      li
        display: inline-block
        margin:0 5px
        a
          display:inline-block
          width:30px
          height:30px
          background: #F8F8F8
          border-radius:100% 100%
          text-align:center
          line-height:30px
          font-size: 14px
          color: #535353
        a:hover
          background:#eee
          transition: all .3s ease
        .icon:before
          color:#5A4C24
          font-size:12px
        .dian
          background:#fff
          span
            display:inline-block
            width:3px
            height:3px
            background:#535353
            border-radius:100% 100%
            margin:0px 2px
        .dian:hover
          background:#fff
          transition: all .3s ease

      li.active a
        background:#eee
        color:#fff
</style>