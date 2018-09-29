<template>
	<div class="select_wrapper" id="select_wrapper">
		<div class="select">
			<!--PC-->
			<div class="timePC" v-if="isPC() && PCdate">
				<v-date :obj="obj" :PCdate="PCdate" :tab="tab"></v-date>
			</div>

			<!--移动-->
			<div class="search_h5 fix" v-if="!isPC() && selectShow">
				<div class="searchText fl" @click="dateShow()">
					<i class="iconfont icon-time"></i>
					<span class="select_time" id="select_time">筛选时间</span>
				</div>
				<div class="searchMain fr">
					<i class="iconfont icon-search"></i>
					<router-link to="./search">搜索</router-link>
				</div>
				<!--日历-->
				<div class="date_box">
				    <!-- 头部 -->
				    <div class="h5_header">
				        <a href="javascript:" class="h5_header_back iconfont icon-back"></a>
				        <h1 class="h5_header_title">选择日期</h1>
				        <a href="javascript:" class="sure" v-if="false">确定</a>
				    </div>
				    <div class="date_con">
				    </div>
				</div>
				<!--时间筛选框-->
				
				<div id="enter_time" @click="selectHide()">
					<div class="title">
						<span class="arrow_left icon-back iconfont"  @click.stop.prevent="dateHide()"></span>
						<h2>筛选时间</h2>
					</div>
					
					<div class="list" v-if="timeFlag">
						<p :class="{'active':tab === 0}" @click.stop.prevent="options(0)">最近1个月</p>
						<p :class="{'active':tab === 1}" @click.stop.prevent="options(1)">最近2个月</p>
						<p :class="{'active':tab === 2}" @click.stop.prevent="options(2)">最近3个月</p>
					</div>
					  
					<ul class="select_list">
						<li class="li-parent lia fix" @click.stop.prevent="timeShow()">
							<span class="text fl">时间跨度</span>
							<i class="icon-right-arrow fr iconfont"></i>
							<span class="date stayl fr">最近{{tab+1}}个月</span>
						</li>
						<li class="li-parent fix">
							<span class="text fl">开始日期</span>
							<i class="icon-right-arrow fr iconfont"></i>
							<span class="date start_date start_date1 stayl fr" :data-time="obj.StartTime"></span>
						</li>
						<li class="li-parent fix">
							<span class="text fl">结束日期</span>
							<i class="icon-right-arrow fr iconfont"></i>
							<span class="date end_date end_date1 stayl fr" :data-time="obj.EndTime"></span>
						</li>
						
					</ul>
					<div class="btn-box">
						<a href="javascript:;" class="time-btn" @click="timeSearch()">查询</a>
					</div>
					
				</div>
			</div>
			<div class="select_h5" ref="selectList" :class="{'select_PC':isPC(),'select_top':IsHideHeadDiv != 0}">
				<div class="status_bar" v-if="isPC() && arr.length>0">
					<ul class="fix">
						<li class="lia fl">商家图片</li>
						<li class="lib fl">创建时间</li>
						<li class="lic fl">
							<span class="sp1">商品</span> | <span class="sp2">订单号</span>
						</li>
						<li class="lie fr">交易状态</li>
						<li class="lid fr">
							<span class="sp1">支付方式</span> | <span class="sp2">金额</span>
						</li>
						
					</ul>
				</div>
				<div class="scroll_box">
				    <!-- 顶部提示信息 -->
				    <div class="top-tip" v-show="!isPC() && arr.length>0">
				      <span class="refresh-hook">下拉刷新</span>
				    </div>
				    <!-- 列表 -->
				    <ul class="ul-hook">
				        <li v-for="(data,index) in arr" @click="detail(data.OrderNo,$event)">
				        <!--路由传参
				        <router-link :to="{path:'/orderDetail',name: 'OrderDetail',params:{name:data.OrderNo}}">
				        -->
				        <!--<router-link :to="{path:'/orderDetail'}">-->
				        <a href="javascript:;" class="fix">
				        	<div class="img fl" >
				        	    <img v-lazy="data.ThirdImageUrl" alt="">
				        	</div>
				        	<div class="content fl fix">
				        	    <div class="time fl"><span class="sp1">{{data.CreateTime.split(' ')[0]}}</span><span class="sp2">{{data.CreateTime.split(' ')[1]}}</span></div>
				        	    <div class="name fl">
				        	        <p v-if="obj.KeyWords !== '' && data.ProductName.indexOf(obj.KeyWords) !== -1">{{data.ProductName.split(obj.KeyWords)[0]}}<span>{{obj.KeyWords}}</span>{{data.ProductName.split(obj.KeyWords)[1]}}</p>
				        	        <p v-if="obj.KeyWords === '' || data.ProductName.indexOf(obj.KeyWords) === -1">{{data.ProductName}}</p>
				        	        <div v-show="isPC()">
				        	            <span class="from">{{data.ThirdName}}</span>
				        	            <span class="order">订单号 : </span>
				        	            <span class="order_num Arial">{{data.OrderNo}}</span>
				        	        </div>
				        	    </div>
				        	</div>
				        	<div class="status fr">
				        	    <p :class="{'active':data.State === 1}" v-if="data.State === 1">
				        	    	<a href="javascript:;"  @click.stop="gotoPay(data.ThirdId,data.ThirdOrderNo)">{{data.StateText}}</a>
				        	    </p>
				        	    <p v-if="data.State !== 1">
					        	    {{data.StateText}}
				        	    </p>
				        	    <div v-show="isPC()">支付详情</div>
				        	</div>
				        	<div class="payWay fr">
				        	    <div class="pay" v-show="isPC()">{{data.PayTypeText}}</div>
				        	    <div class="money" :class="{'active':data.PayTypeText === ''}">
				        	        <span class="sp1"><i v-show="data.PayTypeText !== '积分商城'">¥ </i>{{data.TotalMoney}}</span><span class="sp2" v-show="data.PayTypeText === '积分商城'">积分</span>
				        	        
				        	    </div>
				        	</div>
				        	
				        </a>
				        <!--</router-link>-->
				            
				        </li>
				    </ul>
				    <!-- 
				      1、底部提示信息 
				      2、这里有一种情况,就是没有更多数据时,这里的文本应该显示"暂无更多数据"
				    -->
				    <div class="bottom-tip" v-show="!isPC() && totalPage > obj.PageIndex">
				      <i class="icon-more iconfont icon-jiazaizhong"></i>
				      <span class="loading-hook">查看更多</span>
				    </div>
				    <!--没有查询结果-->
				    <div class="no_result">
				        <span class="icon-error iconfont"></span>
				        <p>没有找到相关记录</p>
				    </div>
				    <!--刷新页面显示-->
				    <div class="reflash" v-if="false">
				        <img src="./loading.gif" alt="">
				    </div>
				</div>
			</div>
			<!-- alert -->
			<div class="alert" ref="alertHook" v-show="!isPC() && arr.length>0">刷新成功</div>
			<!--loading-->
			<div class="loading"></div>
			<!--分页器-->
			<v-page v-show="isPC() && totalPage > 1" :totalPage="totalPage" :page="obj.PageIndex"></v-page>
			<!--公共错误弹框-->
			<v-modal :prom="prom"></v-modal>
			<!--<v-copyright :bottom="true"></v-copyright>-->
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import PagePC from '@/components/pagePC/PagePC'
	import DatePC from '@/components/datePC/DatePC'
	import Modal from '@/components/modal/Modal'
	import Copyright from '@/components/copyright/Copyright'
	import $ from 'jquery'
	import '@/common/js/date2'

  	let today = new Date()
	let todayY = today.getFullYear()
	let todayM = today.getMonth() + 1<10?"0"+(today.getMonth()+1):(today.getMonth()+1)
	let todayD = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()

	let todayBefore90=new Date(today.getTime()-90*24*60*60*1000);
	let todayBefore90Y=todayBefore90.getFullYear()
	let todayBefore90M=todayBefore90.getMonth()+1<10?"0"+(todayBefore90.getMonth()+1):(todayBefore90.getMonth()+1)
	let todayBefore90D=todayBefore90.getDate()<10?"0"+todayBefore90.getDate():todayBefore90.getDate();
	// 追加一天
    function addDate(date, days) {
        if (days == undefined || days == '') {
            days = 1;
        }
        var date = new Date(date);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
    }
    // 前推一月
    function subDate(date, days) {
        if (days == undefined || days == '') {
            days = 0;
        }
        var date = new Date(date);
        var month = date.getMonth() - days;
        var day = date.getDate();
        if(month === 0 ){
          month = 12
          return (date.getFullYear() - 1) + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }else if(month < 0){
          month = 12 + month
          return (date.getFullYear() - 1) + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        } else if(month > 0){
          return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }
        
    }
    // 日期月份/天的显示，如果是1位数，则在前面加上'0'
    function getFormatDate(arg) {
        if (arg == undefined || arg == '') {
            return '';
        }
        var re = arg + '';
        if (re.length < 2) {
            re = '0' + re;
        }
        return re;
    }
	export default {
	  name: 'selecta',
	  props: {
	  	selectShow: {
	  		type: Boolean
	  	}
	  },
	  data () {
	  	return {
	  		arr: [],
	  		itema: [],
	  		obj: {
	  			'PaymentType': '',	// 支付类型
	  			'PaymentState': '',	// 支付状态
	  			'PaymentMethod': '',	// 支付方式
	  			'KeyWords': '',	// 查询关键字
	  			'StartTime': null,	// 开始时间
	  			'EndTime': null,	// 结束时间
	  			'PageIndex': 1,	// 页码
	  			'PageSize': 9  // 每条页数
	  		},
	  		statusArr: ['待支付', '已支付', '已退款', '已部分退款', '已取消'],
	  		totalPage: 0, // 总页数
	  		orederNum: '',
	  		Code: null, // 判断Code是否改变 来清楚this.arr 的数据
	  		timeFlag: false, // 下拉框显示隐藏
	  		tab: 0, //  1最近1个月  2 两个月  3 三个月
	  		PCdate: null, // PC日期控件显示
	  		prom: null, // 错误提示信息
	  		refreshBl: true, // 多次加载开	
	  		finsh: true, //解决加载页面是图标闪动
	  		IsHideHeadDiv:0,// 头部显示隐藏标识
	  	}
	  },
	  created () {
	  	this.$root.loading = true
	  	this.obj.StartTime =  subDate(todayY + '-' + todayM + '-' + todayD, 0)
	  	this.obj.EndTime = addDate(todayY + '-' + todayM + '-' + todayD, 1)
	    // 筛选列表异步请求初始化
	    this.selectListAjax(1)
	    // 分页函数异步请求调用
	    this.$root.eventHub.$on('ajax', this.selectListAjax)
    	this.$root.eventHub.$on('searcha', this.selectListAjax) // PC
    	this.$root.eventHub.$on('searchaa', this.selectListAjax) // 移动
    	this.$root.eventHub.$on('keyWord', this.selectListAjax) // 模糊查询
    	this.$root.eventHub.$on('PCDate', this.PCDateTime) // PC日期传递
    	this.$root.eventHub.$on('PCTab', this.changeTab) // PC改变tab
    	this.$root.eventHub.$on('dateFlag', this.datee) // pc端日期控件显示
    	this.$root.eventHub.$on('PCflag', this.datee) // pc端日期控件显示
	  },
	  beforeDestroy() {
	    this.$root.eventHub.$off('ajax', this.selectListAjax)
    	this.$root.eventHub.$off('searcha', this.selectListAjax) // PC
    	this.$root.eventHub.$off('searchaa', this.selectListAjax) // 移动
    	this.$root.eventHub.$off('keyWord', this.selectListAjax) // 模糊查询
    	this.$root.eventHub.$off('PCDate', this.PCDateTime) // PC日期传递
    	this.$root.eventHub.$off('PCTab', this.changeTab) // PC改变tab
    	this.$root.eventHub.$off('dateFlag', this.datee) // pc端日期控件显示
    	this.$root.eventHub.$off('PCflag', this.datee) // pc端日期控件显示
	  },
	  mounted () {   
	  	$('.start_date1').html(this.obj.StartTime)
	  	$('.end_date1').html(todayY + '-' + todayM + '-' + todayD)
	  	if(this.isPC()){
	  		let select_box = document.getElementsByClassName('select_wrapper')[0]
	  		select_box.style.maxWidth = '1000px'
	  		select_box.style.margin = 'auto'
	  	}
	  	this.IsHideHeadDiv = parseInt(this.getCookie('IsHideHeadDiv'))
	  },
	  methods: {
	  	_initScroll () {
	  		let This = this
	  		let listWrapper = this.$refs.selectList
	  		if (!this.isPC()){
	  			//let topTip = listWrapper.getElementsByClassName('refresh-hook')[0]
	  			//let bottomTip = listWrapper.getElementsByClassName('loading-hook')[0]
	  		}
	  		if (!this.scroll) {
	  			this.scroll = new BScroll(listWrapper, {
	  				click: true,
	  				// scrollbar: true,
	  				probeType: 1
	  			})
	  		} else {
	  			this.scroll.refresh()
	  		}
	  		// 滑动中  实时监听滚动距离
	  		this.scroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(Math.round(pos.y))
				let topTip = listWrapper.getElementsByClassName('refresh-hook')[0]
				if (pos.y > 30) {
				   topTip.innerText = '释放立即刷新'
				}
			})
			/*
			 * @ touchend:滑动结束的状态
			 * @ maxScrollY:屏幕最大滚动高度
			*/
			// 滑动结束
			this.scroll.on('touchEnd', (pos) => {
			  if (pos.y > 30) {
			  let topTip = listWrapper.getElementsByClassName('refresh-hook')[0]
			    setTimeout(function () {
			      // 恢复文本值
			      topTip.innerText = '下拉刷新'
			      // 刷新成功后的提示
			      This.refreshAlert('刷新成功')
			      // 刷新列表后,重新计算滚动区域高度
			      This.scroll.refresh()
			    }, 0)
			  } else if (pos.y < (This.scroll.maxScrollY - 30)) {
			  	let bottomTip = listWrapper.getElementsByClassName('loading-hook')[0]
			    bottomTip.innerText = '加载中...'
		      	// 恢复文本值
		      	if (this.totalPage === this.obj.PageIndex) {
	  				bottomTip.innerText = '已经没有数据了'
	  			} else {
	  				bottomTip.innerText = '查看更多'
	  			}
		      	// 向列表添加数据
		      	
		      	if(This.refreshBl){
		      		This.refreshBl = false
		      		This.reloadData()
		      	}
		      	
		      	// 加载更多后,重新计算滚动区域高度
		      	
			  }
			  This.scroll.refresh()
			})
	  	},
	  	// 加载更多方法
	  	reloadData () {
	  		if (this.totalPage === this.obj.PageIndex) {
	  			return
	  		}
	  		this.obj.PageIndex ++
	  		this.selectListAjax(0)
	  	},
	  	// 刷新成功提示方法
	  	refreshAlert (text) {
	  	  let alert = this.$refs.alertHook
	  	  text = text || '操作成功'
	  	  alert.innerHtml = text
	  	  alert.style.display = 'block'
	  	  setTimeout(function () {
	  	    alert.style.display = 'none'
	  	  }, 0)
	  	},
	  	//	筛选列表数据请求
	  	selectListAjax (pageIndex, Code, type, keyWord) {
	  		// pageIndex  页码
	  		// Code 编码
	  		// type 查询分类  0 支付方式查询 1 表示来源分类 2 表示支付状态分类
	  		// 关键字模糊查询
	  		// 默认调用此函数传参为0，有实际参数时传实际参数即可
	  		
	  		if (pageIndex !== 0) {
	  			this.obj.PageIndex = pageIndex
	  		}
	  		if (type === 0) { // 支付方式
	  			this.obj.PaymentMethod = Code
	  		} else if (type === 1) { // 支付来源
	  			this.obj.PaymentType = Code
	  		} else if (type === 2) { // 支付状态
	  			this.obj.PaymentState = Code
	  		}
	  		// 模糊查询
	  		if(keyWord === ''){
	  			this.obj.KeyWords = ''
	  		}
	  		if (keyWord) {
	  			if (!this.isPC()){
	  				this.clearData()
	  			}
	  			this.obj.KeyWords = keyWord
	  		}

	  		this.fetchDataA(this.obj,Code,pageIndex)
	  		
	  	},
	  	// 异步请求
  		fetchDataA: async function (parms,Code,pageIndex) {
  		  let params = parms
  		  const res = await this.$root.http.post('/mvc/pay/QueryOrderPayList', params,this)
  		  if (res.data.Flag === 1) {
  		  		this.refreshBl = true
  		  		this.finsh = false
  		        this.totalPage = res.data.Data.PageCount
  		        if(this.totalPage <= 0){
  		        	this.$root.subNav = false
  		        }
	    		this.$root.loading = false
	    		// 判断是PC访问就不用缓存数据，如果是移动访问需要缓存数据
	    		if (this.isPC()) {
	    			this.arr = res.data.Data.OrderList

	    		} else {
	    			if(pageIndex === 1){
	    				this.arr = []
	    			}
	    			this.itema = res.data.Data.OrderList
	    			this.arr = this.arr.concat(this.itema)
	    			this.$root.eventHub.$emit('list', this.arr)
	    		}
	    		this.$nextTick(() => {
	    				let el = document.getElementById('select_wrapper')
	    				if( window.screen.availHeight > el.offsetHeight){
	    					el.style.position = "static"
	    				}else {
	    					el.style.position = "relative"
	    				}

	    			// 移动端滑屏初始化  （滚动条）
	    			if (this.isPC()) { // 判断如果不是PC访问就不调用移动端滚动条
	    				 //return
	    			}else{
	    				this._initScroll()
	    			}

	    			let no_result = document.getElementsByClassName('no_result')[0]	
	    			if(this.arr.length > 0){
	    				no_result.style.display = "none"
	    			}else{
	    				no_result.style.display = "block"
	    			}
	    		})
	    		// 清空输入框内的内容
	    		this.val = ''
  		  } else if (res.data.Flag === 0 ){
  		  	 this.refreshBl = true
  		     this.$root.bool = true
  		     this.prom = res.data.Msg
  		  }
  		},
	  	detail (type, event) {
	  		//console.log(event)
	  		//if (!event._constructed) {
			//	return
			//}
			this.setCookie('CashierInfoId',type)
			this.$router.push('/orderDetail')
			//alert(12)
	  	},
	  	// 清空数据
	  	clearData () {
	  		this.obj = {
	  			'PaymentType': null,	// 支付类型
	  			'PaymentState': null,	// 支付状态
	  			'PaymentMethod': null,	// 支付方式
	  			'KeyWords': null,	// 查询关键字
	  			'StartTime': null,	// 开始时间
	  			'EndTime': null, // 结束时间
	  			'PageIndex': 1,	// 页码
	  			'PageSize': 9  // 每条页数
	  		}
	  	},
	  	// 日期控件
	  	dateShow () {
	  		//console.log(111)
	  		let This = this
	  		$('#enter_time').stop(true, true).animate({ left: "0%" }, 500)
	  		//console.log(222)
	  		$('.start_date1').off().on('click', function () {
	  			$('.start_date1').addClass('cur').siblings().removeClass('cur')
	  			let endArr=$('.end_date1').attr('data-time').split('-')
	  			let endTime=new Date(endArr[0],endArr[1]-1,endArr[2]).getTime()-24*60*60*1000
	  			let endDate=new Date(endTime)
	  			let endDateY=endDate.getFullYear()
	  			let endDateM=endDate.getMonth()+1<10?"0"+(endDate.getMonth()+1):(endDate.getMonth()+1)
	  			let endDateD=endDate.getDate()<10?"0"+endDate.getDate():endDate.getDate();
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
	  			    	This.obj.StartTime = $('.start_date1').html()
	  			    	$('.start_date1').html()
	  			    	
	  			    }
	  			})
	  		})
	  		$('.end_date1').off().on('click',function(){
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
	  			    startDate:startDateY+'-'+startDateM+"-"+startDateD, // 日期之后可选
	  			    endDate: todayY + '-' + todayM + '-' + todayD, // 日期之前可选
	  			    maxDays: 90,  // 之后可点击最大天数,
	  			    Seperate: [], // 间隔的日期
	  			    En: false, // 是否英文
	  			    callback: function () { // 日期选中之后的callback
	  			    	This.obj.EndTime = addDate($('.end_date1').html(),1)
	  			    	$('.end_date1').html()
	  			    	$('.end_date1').attr('data-time',addDate($('.end_date1').html(),1))

	  			    }
	  			})
	  		})
	  	},
	  	// 时间下拉菜单显示
	  	timeShow () {
	  		this.timeFlag = true
	  	},
	  	// 点击其他地方时间下拉菜单隐藏
	  	selectHide () {
	  		this.timeFlag = false
	  	},
	  	// 选择最近月份
	  	options (num) {
	  		this.tab = num
	  		this.timeFlag = false
	  		if (num >= 0) {
	  			this.obj.StartTime = subDate(todayY + '-' + todayM + '-' + todayD, num)
	  			$('.start_date1').html(this.obj.StartTime)
	  			$('.start_date1').attr('data-time',this.obj.StartTime)
	  			$('.end_date1').html(todayY + '-' + todayM + '-' + todayD)
	  			$('.end_date1').attr('data-time',addDate(todayY + '-' + todayM + '-' + todayD, 1))
	  		}	  		
	  	},
	  	// 日期控件隐藏
	  	dateHide () {
	  		$('#enter_time').stop(true, true).animate({ left: 200 + '%' }, 500)
	  	},
	  	// PC 日期控件显示
	  	datee (bool) {
	  		this.PCdate = bool
	  	},
	  	// 时间查询
	  	timeSearch () {
	  	  this.selectListAjax(1)
	  	  $('#enter_time').stop(true, true).animate({ left: 200 + '%' }, 500)
	  	},
	  	// 待支付跳订单详情
	  	gotoPay (Code, Third) {
	  		this.$router.push({
	  			path:'/main',
	  			query:{'code':Code + '_' + Third}
	  		})
	  	},
	  	// PC传递时间筛选参数
	  	PCDateTime (startDate,endDate) {
	  		this.obj.StartTime = startDate
	  		this.obj.EndTime = endDate
	  	},
	  	//改变月份
	  	changeTab (num) {
	  		this.tab = num
	  	}
	  },
	  components: {
	  	'v-page': PagePC,
	  	'v-date': DatePC,
	  	'v-modal': Modal,
	  	'v-copyright': Copyright
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
	.select_wrapper
		position:relative
		.select
			.select_top
				top:35px !important
			.select_h5
				position:fixed
				top:80px
				left:0px
				bottom:50px
				right:0px
				font-size:20px
				overflow:hidden
				.scroll_box
					.top-tip
						position:absolute
						top:-40px
						left:0px
						z-index:2
						width:100%
						height:40px
						line-height:40px
						text-align:center
						color:#979797
						font-size:14px
					.bottom-tip
						width: 100%
						height: 45px
						line-height: 45px
						text-align: center
						color: #777
						background: #fff
						i
							font-size:16px
							position:relative
							top:2px
						span
							color:#979797
							font-size:14px
					ul
						margin-top:0px
						li
							position:relative
							padding:15px
							border-bottom: 1px solid #EBEBEB
							a
								.img
									width:55px
									border-radius:5px
									img
										display:block
										width:45px
										height:45px
										background-size:100% 100%
										margin-right:10px
										border-radius:5px

								.content
									position:relative
									min-width: 0
									top:2px
									.time
										position:absolute
										font-size: 12px
										color: #979797
										line-height: 12px
										top:28px  
										font-family:Arial
										width:190px
										span
											display:inline-block
											font-size:12px
											color:#979797
										.sp1
											margin-right:3px

									.name
										p
											text-overflow: ellipsis
											white-space: nowrap
											overflow: hidden
											font-size: 15px
											color: #535353
											line-height: 20px
											width:190px
											span
												color:#B00018 
								.money
									position:absolute
									right:15px
									top:16px
									span
										font-size: 17px
										color: #C0191F
										line-height: 17px
										font-family:Arial
										i
											font-style:normal

								.status
									width:110px
									text-align:right
									p
										position:absolute
										bottom:16px
										right:15px
										display:inline-block
										font-size: 15px
										color: #BA9765
										line-height: 17px
										a
											display:inline-block
											width:100%
											height:100%
											color: #BA9765
										&.active
											background: #C0191F
											border-radius: 33px
											font-size: 14px
											color: #FFFFFF
											line-height: 24px
											padding:0px 10px
											bottom:12px
											a
												display:inline-block
												width:100%
												height:100%
												color: #FFFFFF
					.no_result
						margin-top:79px
						text-align:center
						margin-bottom:350px
						span
							display:inline-block
							font-size:50px
							color:#D3D3D3
						p
							margin-top:8px
							font-size: 14px
							color: #535353
							line-height: 20px
					.reflash
						margin-top:140px
						text-align:center
			.select_PC
				position:static
				.status_bar
					//padding:0px 17px
					
					max-width:966px
					min-width:966px
					margin:0 auto
					margin-top:50px
					padding:0px 0px
					margin-bottom:16px
					ul
						li
							font-size: 14px
							color: #979797
							span
								display:inline-block
							.sp1
								margin-right:5px
							.sp2
								margin-left:5px

						.lia
							width:75px
						.lib
							width:105px
						.lic
							text-align:left
						.lid
							width:135px
							margin-right:24px
							text-align:center
						.lie
							width:84px
							text-align:center
				.scroll_box
					ul
						li
							padding:15px 17px
							align-items: center
							a
								.img
									width:75px
									img
										width:60px
										height:60px
										background-size:100% 100%
										margin-right:15px
								.content
									.time
										position:static
										width:105px
										font-size: 14px
										color: #535353
										line-height: 20px
										margin-top:8px
										span
											display:block
											font-size:14px
											font-family:Arial
										.sp1
											color:#535353
										.sp2
											color:#858585 
											

									.name
										margin-top:8px
										p
											font-size: 14px
											color: #535353
											line-height: 20px
											width:520px
											overflow: hidden
											text-overflow:ellipsis
											white-space: nowrap
										div
											span
												display:inline-block
												font-size: 14px
												color: #979797
											.from
												padding-right:8px
												border-right:1px solid #979797
											.order
												margin-left:4px
								.payWay
									width:100px
									position:relative
									top:8px
									text-align:center
									.pay
										font-size: 14px
										color: #535353
										line-height: 20px
										height:20px
									.money
										position:static
										span
											font-size: 14px
											color: #C0191F
											line-height: 20px
											i
												font-style:normal
									.active
										margin-top:-10px
								.status
									width:84px
									text-align:center
									margin-left:38px
									position:relative
									top:7px
									p
										position:static
										font-size: 14px   
										color: #535353
										line-height: 20px
										&.active
											background: #C0191F
											font-size: 14px
											color: #FFFFFF
											line-height: 27px
											padding:0px 14px
											&:hover
												background:#CD474C
												transiton:all .3s ease
									div
										font-size: 14px
										color: #BA9765
										line-height: 22px
						li:first-child
							border-top: 1px solid #EBEBEB
			.alert
				display: none
				position: fixed
				top: 81px
				left: 0
				z-index: 2
				width: 100%
				height: 35px
				line-height: 35px
				text-align: center
				color: #fff
				font-size: 12px
				background: rgba(7, 17, 27, 0.7)
			.search_h5
				background: #F8F8F8
				padding:0px 17px
				.searchText,.searchMain
					i
						display:inline-block
						font-size:16px
						color: #969696
						margin-right:0px
						line-height:35px
						position:relative
						top:1px
						color:#BA9765
					.select_time
						font-size:15px
						color:rgba(47,46,46,1)
						line-height:35px
					a
						display:inline-block
						font-size: 15px
						color: #2F2E2E
						line-height:35px

				#enter_time
					.title
						text-align:center
						background:rgba(247,247,247,1)
						span
							position:absolute
							left:17px
							font-size:16px
							color:#535353
							line-height:45px
						h2
							text-align:center
							display:inline-block
							font-size:18px
							color:#2F2E2E
							height:45px
							line-height:45px
							position:relative
							top:2px
					.select_list
						position:relative
						.li-parent
							padding:0px 20px
							font-size:14px
							color:rgba(151,151,151,1)
							line-height:48px
							border-bottom:1px solid #EBEBEB
							position:relative
							.text
								font-size:14px
								color:#979797
							i
								font-size:12px
								line-height:48px
							.stayl
								font-size:14px
								margin-right:15px
								color:#535353
						.lia
							position:relative
							i
								font-size:12px
								line-height:48px
							.stayl
								font-size:14px
								margin-right:15px
								color:#535353
					.list
						position:absolute
						top:93px
						right:12px
						border:1px solid #EBEBEB
						border-top:none
						z-index:45
						p
							border-top:1px solid #EBEBEB
							padding:0px 20px
							font-size:14px
							color:rgba(151,151,151,1)
							line-height:48px
							background:#ffff
						p.active
							background:#f8f8f8
					.btn-box
						width:100%
						text-align:center
						.time-btn
							display:inline-block
							border:none
							outline:none
							width:140px
							height:45px 
							background:rgba(192,25,31,1)
							border-radius: 58px 
							font-size:18px
							color:#fff
							line-height:45px 
							margin-top:32px 
	@media screen and (max-width: 360px) and (min-width: 300px)
		.select_wrapper
			.select 
				.select_h5 
					.scroll_box 
						ul 
							li 
								a 
									.content 
										.name 
											p	
												width:170px
</style>