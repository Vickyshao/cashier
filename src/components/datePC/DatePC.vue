<template>
    <div class="datePC">
      <div class="content" @click.stop.prevent="selectHide()">
        <div class="title">
          <h3>筛选时间</h3>
          <span class="close iconfont icon-PCclose" @click.stop.prevent="maskHide ($event)"></span>
        </div>
        <div class="list" v-if="timeFlag">
          <p :class="{'active':tab === 0}" @click.stop.prevent="options(0)">最近1个月</p>
          <p :class="{'active':tab === 1}" @click.stop.prevent="options(1)">最近2个月</p>
          <p :class="{'active':tab === 2}" @click.stop.prevent="options(2)">最近3个月</p>
        </div>
        <!--日历-->
        <div class="date_box" :class="{'active':endFlag === true}">
            <!-- 头部 -->
            <!--
            
            <div class="h5_header">
                <a href="javascript:" class="h5_header_back iconfont icon-back"></a>
                <h1 class="h5_header_title">选择日期</h1>
            </div>
            -->
            <div class="date_con">
            </div>
        </div>
        <div id="enter_timea">
          <ul class="select_list">
            <li class="li-parent fix">
              <span class="text fl">时间跨度</span>
              <div class="box"  @click.stop.prevent="timeShow()">
                <i class="fr iconfont"  :class="{'icon-top-arrow':timeFlag,'icon-down-arrow':!timeFlag}"></i>
                <span class="date stayl fr">最近{{tab+1}}个月</span>
              </div>
              
            </li>
            <li class="li-parent fix">
              <span class="text fl">开始日期</span>
              <i class="icon-down-arrow fr iconfont iconClickStart"></i>
              <span class="date start_date start_date1 stayl fr" data-time="obj.StartTime">{{obj.StartTime}}</span>
            </li>
            <li class="li-parent fix">
              <span class="text">结束日期</span>
              <i class="icon-down-arrow fr iconfont iconClickEnd"></i>
              <span class="date end_date end_date1 stayl fr" data-time="obj.EndTime" @click="endDateEvent()">{{obj.EndTime}}</span>
            </li>
          </ul>
          <a href="javascript:;" class="date-btn" @click="timeSearch()">查询</a>
        </div>
      </div>
      <transition name="moveMask">
        <div class="mask" v-show="Boolean" @click="maskHide($event)"></div>
      </transition>
    </div>
</template>
<script type="text/ecmascript-6">
  let today = new Date()
  let todayY = today.getFullYear()
  let todayM = today.getMonth() + 1<10?"0"+(today.getMonth()+1):(today.getMonth()+1)

  let todayD = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
  let todayBefore90 = new Date(today.getTime()-90*24*60*60*1000)
  let todayBefore90Y = todayBefore90.getFullYear()
  let todayBefore90M = todayBefore90.getMonth()+1<10?"0"+(todayBefore90.getMonth()+1):(todayBefore90.getMonth()+1)
  let todayBefore90D = todayBefore90.getDate()<10?"0"+todayBefore90.getDate():todayBefore90.getDate()
  
  export default {
    name: 'datePC',
    props: {
      obj: {
        type: Object
      },
      PCdate: {
        type: Boolean
      },
      tab: {
        type:Number
      }
    },
    data () {
      return {
        timeFlag: false, // 下拉框显示隐藏
        //tab: 0 //  1最近1个月  2 两个月  3 三个月
        endFlag:false //点击结束日期时，日期控件下移
      }
    },
    created () {
      
    },
    mounted () {
      $('.start_date1').attr('data-time',this.obj.StartTime)
      $('.end_date1').attr('data-time',this.obj.EndTime)
      $('.start_date1').html(this.obj.StartTime)
      $('.end_date1').html(todayY + '-' + todayM + '-' + todayD)
      let This = this
      $('.start_date1,.iconClickStart').off().on('click', function (event) {
        This.endFlag = false
        event.stopPropagation()// 阻止冒泡事件
        $('.date_box').show()
        $('.start_date1').addClass('cur').siblings().removeClass('cur')
        let endArr=$('.end_date1').attr('data-time').split('-')
        let endTime=new Date(endArr[0],endArr[1]-1,endArr[2]).getTime()-24*60*60*1000
        let endDate=new Date(endTime)
        let endDateY=endDate.getFullYear()
        let endDateM=endDate.getMonth()+1<10?"0"+(endDate.getMonth()+1):(endDate.getMonth()+1)
        let endDateD=endDate.getDate()<10?"0"+endDate.getDate():endDate.getDate()
        $('.start_date1').dateChoose({
            dateClass: '.date_box', // 日期选择页面
            startClass: '.start_date', // 开始日期的class
            endClass: '.start_date', // 结束日期
            range: true, // 开始日期和结束日期都包括，若为false，则只有开始日期
            divideChoose: true, // 结束日期和开始日期是否在两个不同的输入框
            startTxt: '', // 开始日期选中之后出现的文字
            endTxt: '', // 开始日期选中之后出现的文字
            startDate: todayBefore90Y+'-'+todayBefore90M+"-"+todayBefore90D, // 日期之后可选
            endDate: endDateY+'-'+endDateM+"-"+endDateD, // 日期之前可选
            maxDays: 90,  // 之后可点击最大天数,
            Seperate: [], // 间隔的日期
            En: false, // 是否英文
            callback: function () { // 日期选中之后的callback
             //This.obj.StartTime = $('.start_date1').html()
             $('.start_date1').attr('data-time',$('.start_date1').html())
             $('.start_date1').html()
             $('.date_box').hide()
             
            }
        })
      }),
      $('.end_date1,.iconClickEnd').off().on('click',function(event){
        event.stopPropagation()// 阻止冒泡事件
        $('.date_box').show()
        $('.end_date1').addClass('cur').siblings().removeClass('cur')
        let startArr=$('.start_date1').attr('data-time').split('-')
        let startTime=new Date(startArr[0],startArr[1]-1,startArr[2]).getTime()+24*60*60*1000
        let startDate=new Date(startTime)
        let startDateY=startDate.getFullYear()
        let startDateM=startDate.getMonth()+1<10?"0"+(startDate.getMonth()+1):(startDate.getMonth()+1)
        let startDateD=startDate.getDate()<10?"0"+startDate.getDate():startDate.getDate()
        $('.end_date1').dateChoose({
            dateClass: '.date_box', // 日期选择页面
            startClass: '.end_date', // 开始日期的class
            endClass: '.end_date', // 结束日期
            range: true, // 开始日期和结束日期都包括，若为false，则只有开始日期
            divideChoose: true, // 结束日期和开始日期是否在两个不同的输入框
            startTxt: '', // 开始日期选中之后出现的文字
            endTxt: '', // 开始日期选中之后出现的文字
            startDate: startDateY+'-'+startDateM+"-"+startDateD, // 日期之后可选
            endDate: todayY + '-' + todayM + '-' + todayD, // 日期之前可选
            maxDays: 90,  // 之后可点击最大天数,
            Seperate: [], // 间隔的日期
            En: false, // 是否英文
            callback: function () { // 日期选中之后的callback
              //This.obj.EndTime = addDate($('.end_date1').html(),1)
              $('.end_date1').html()
              $('.end_date1').attr('data-time',This.addDate($('.end_date1').html(),1))
             $('.date_box').hide()
             this.endFlag = false
            }
        })
      })
    },
    methods: {
      // 时间下拉菜单显示
      timeShow () {
        this.timeFlag = true
      },
      // 点击其他地方筛选框隐藏
      selectHide () {
        this.timeFlag = false
        $('.date_box').hide()
        this.endFlag = false
      },
      // 选择最近月份
      options (num) {
        this.$root.eventHub.$emit('PCTab', num)
        this.timeFlag = false 
        if (num >= 0) {
          $('.start_date1').html(this.subDate(todayY + '-' + todayM + '-' + todayD, num))
          $('.start_date1').attr('data-time',this.subDate(todayY + '-' + todayM + '-' + todayD, num))
          $('.end_date1').html(todayY + '-' + todayM + '-' + todayD)
          $('.end_date1').attr('data-time',this.addDate(todayY + '-' + todayM + '-' + todayD, 1))
        }
      },
        addDate(date, days) {
            if (days == undefined || days == '') {
                days = 1
            }
            var date = new Date(date)
            date.setDate(date.getDate() + days)
            var month = date.getMonth() + 1
            var day = date.getDate()
            return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day)
        },
        subDate(date, days) {
            if (days == undefined || days == '') {
                days = 0
            }
            var date = new Date(date)
            var month = date.getMonth() - days
            var day = date.getDate()
            if(month === 0 ){
              month = 12
              return (date.getFullYear() - 1) + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
            }else if(month < 0){
              month = 12 + month
              return (date.getFullYear() - 1) + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
            } else if(month > 0){
              return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
            }
        },
        getFormatDate(arg) {
            if (arg == undefined || arg == '') {
                return ''
            }
            var re = arg + ''
            if (re.length < 2) {
                re = '0' + re
            }
            return re
        },
      // 浮层显示隐藏
      maskHide  (event) {
        this.$root.eventHub.$emit('PCflag', false)
      },
      // 时间查询
      timeSearch () {
        let startDate = $('.start_date1').attr('data-time')
        let endDate = $('.end_date1').attr('data-time')
        this.$root.eventHub.$emit('PCDate',startDate,endDate)
        this.$root.eventHub.$emit('searcha', 1)
        //$('.datePC .content').hide()
        this.$root.eventHub.$emit('PCflag', false)
      },
      // 结束日期点击事件
      endDateEvent(){
        this.endFlag = true
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .datePC
    position:relative
    .content
      position:relative
      padding:0px 20px 
      position:fixed
      width:377px
      height:325px 
      left:50%
      top:50%
      background:rgba(255,255,255,1)
      border-radius: 20px 
      margin-left:-208px
      margin-top:-240px 
      z-index:80
      .title
        position:relative
        text-align:center
        h3
          font-size:16px
          color:rgba(47,46,46,1)
          line-height:67px
        span
          position:absolute
          font-size:16px
          color:#D4D4D4
          background:#fff
          top:20px
          right:0px
          cursor:pointer
      .date_box
        width:330px
        height:327px 
        background:#F9F9F9
        border-radius: 5px 
        position:relative
        margin-top:107px
        margin-left:50px
        left:0%
        display:none
        border:1px solid #D3D3D3
        &.active
          margin-top:157px
        .date_con
          background:#F9F9F9
          border-radius: 6px
          overflow: hidden
          .month_change
            padding-top:0px
            background:#F9F9F9
            height:66px
            line-height:66px
            h3
              display:inline-block
              margin-top:0px
              background:#F9F9F9 !important
              font-size:20px
              color:#535353
            a
              font-size:30px
              line-height:30px
              margin-top:-16px
              color:#D3D3D3
            a:hover
              color:#90704D
          .week
            border:none
            margin:0 21px
            height:auto
            line-height:1
            margin-bottom:20px
            margin-top:10px
            li
              font-size:14px
              color:#535353
          .date_list
            margin:0px 21px 
            border:none
            background:#F9F9F9
            a
              display:inline-block
              width:42px
              height:41px
              background:#fff
              border:1px solid #D3D3D3
              margin-bottom:0px
              box-sizing:border-box
              margin-left:-1px
              margin-top:-1px
              font-size:16px
              color:#535353
            .before
              background:#F9F9F9
              border:none
            .cur
              background:#C0191F
              color:#fff
            a:hover
              background:#C0191F
              color:#fff
              font-size:18px
            .disabled
              color:#D3D3D3
            .disabled:hover{
              font-size:16px
              background:#fff
              color: #D3D3D3
            }
      .date_box:before
        box-sizing: content-box
        width: 0px
        height: 0px
        position: absolute
        top: -16px
        right:75px
        padding:0
        border-bottom:8px solid #F9F9F9
        border-top:8px solid transparent
        border-left:8px solid transparent
        border-right:8px solid transparent
        display: block
        content:''
        z-index: 82
      .date_box:after
        box-sizing: content-box
        width: 0px
        height: 0px
        position: absolute
        top: -18px
        right:74px
        padding:0
        border-bottom:9px solid #D3D3D3
        border-top:9px solid transparent
        border-left:9px solid transparent
        border-right:9px solid transparent
        display: block
        content:''
        z-index:80
      #enter_timea
        position:absolute
        top: 0
        z-index: 40
        left:50%
        top:50%
        height:auto
        background-color: #fff
        width:377px
        height:238px
        margin-left:-190px
        margin-top:-93px 
        .select_list
          .li-parent
            padding:0px 20px
            font-size:14px
            color:rgba(151,151,151,1)
            line-height:49px
            border-bottom:1px solid #EBEBEB
            i
              font-size:12px
              line-height:49px
              cursor:pointer
              position:relative
              top:2px
              color:#C4A958
            .stayl
              padding-right:15px
              cursor:pointer
              font-size:14px
              color:#535353
            .text
              font-size:14px
              color:#979797
          .li-parent:first-child
              border-top:1px solid #EBEBEB

      .date-btn
        outline:none
        border:none
        display:inline-block
        width:140px
        height:45px
        text-align:center 
        background:rgba(192,25,31,1)
        border-radius: 58px 
        font-size:18px
        line-height:45px
        color:rgba(255,255,255,1)
        margin-top:25px
        margin-left:114px
        cursor:pointer
        &:hover
          background:#CD474C
          transition: all .3s ease
      .list
        position:absolute
        top:120px
        right:32px
        border:1px solid #EBEBEB
        border-top:none
        z-index:45
        background:#fff
        p
          border-top:1px solid #EBEBEB
          padding:0px 20px
          font-size:14px
          color:rgba(151,151,151,1)
          line-height:49px
          background:#fff
          cursor:pointer
          color:#535353
          &:hover
            background:#F8F8F8
            transition: all .3s ease
        p.active
          background:#F8F8F8
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
</style>