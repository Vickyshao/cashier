<template>
	<div class="search_wrapper">
		<div class="search">
			<!--移动搜索-->
			<div class="search_h5 fix" v-show="!isPC()">
				<i class="icon-back fl iconfont" @click="back"></i>
				<div class="searchMain fl">
					<i class="icon-search iconfont"></i>
					<input type="text" placeholder="输入订单相关信息" v-model="val">
					<span class="clearSpan" v-if="val.length > 0"><i class="icon-clear icon-PCclose iconfont" @click="clear()" ></i></span>
					
				</div>
				<span class="fl searchSpan" @click="search">搜索</span>
			</div>
			<!--移动头部内容-->
			<v-checkstand :title='title' v-show="isPC()"></v-checkstand>
			<!--移动端搜索内容-->
			<v-select  :selectShow="selectShow"></v-select>
			<!--版权信息-->
			<v-copyright></v-copyright>
		</div>
		<!--公共错误弹框-->
          <v-modal :prom="prom" ></v-modal>
	</div>
</template>
<script type="text/ecmascript-6">
	import Select from '@/components/select/Select'
	import CheckStand from '@/components/checkstand/CheckStand'
	import ClassifyPC from '@/components/classifyPC/ClassifyPC'
	import Copyright from '@/components/copyright/Copyright'
	import Modal from '@/components/modal/Modal'
	export default {
	  name: 'search_wrapper',
	  props: {
	  	title: {
	  		type: String
	  	}
	  },
	  data () {
	  	return {
	  		selectShow: false, // 判断搜索页的筛选信息显示隐藏
	  		val: '',
	  		dataArr: {'name': '123'},
	  		prom: null, // 错误提示信息
	  		item: null // 临时存储数据
	  	}
	  },
	  created () {
	  	if(this.isPC()){
	  		this.$router.push({path: '/err',query:{'Msg':encodeURIComponent('此页面不存在')}})
	  		return
	  	}
	  	this.fetchData()
	  	this.$root.eventHub.$on('list', this.listText)
	  },
	  mounted () {
	  	//document.getElementById('app').className = "active"

	  },
	  methods: {
	  	// 数据请求
	  	fetchData: async function () {
	       let params = {
	       }
	       const res = await this.$root.http.post('/mvc/pay/QuerySearchTypeList', params,this)
	       if (res.data.Flag === 1) {
	            this.dataArr = res.data.Data
	  			this.$root.eventHub.$emit('classData', this.dataArr)
	       } else if (res.data.Flag === 0 ){
	          this.$root.bool = true
	          this.prom = res.data.Msg
	       }
	     },
	  	// 清空输入框内的内容
	  	clear () {
	  		this.val = ''
	  	},
	  	// 模糊查询
	  	search () {
	  		if (this.val === this.item) {
	  			return 
	  		}
	  		this.item = this.val
	  		this.$root.eventHub.$emit('keyWord', 1, '', '', this.val)
	  	},
	  	listText (arr) {
	  	},
	  	// 路由切换返回上一步
	  	back () {
	  		this.$router.go(-1)
	  	}
	  },
	  components: {
	  	'v-select': Select,
	  	'v-checkstand': CheckStand,
	  	'v-classifypc': ClassifyPC,
	  	'v-copyright': Copyright,
	  	'v-modal': Modal
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>

	.search_wrapper
		position:relative
		.search
			background: #fff
			height:45px
			.search_h5
				padding:0px 4.5333%
				box-shadow: 0 1px 0 0 #EBEBEB
				width:100%
				.icon-back
					width:9.86666%
					display:inline-block
					font-size:17px
					line-height:45px
				.searchMain
					height:30px
					background: #F2F2F2
					border-radius: 37px
					margin-top:8px
					width:71.3333%
					position:relative
					i
						display:inline-block
						line-height:30px
					.icon-search
						width:35px
						font-size:16px
						text-align:center
						position:relative
						top:0px
						color:#979797
					.clearSpan
						display:inline-block
						position:absolute
						right:7px
						top:5px
						width:20px
						height:20px 
						border-radius:10px 10px
						background:#D3D3D3
						.icon-PCclose
							width:auto
							font-size:12px !important
							color:#fff
							position:relative
							top:-4px
							left:4px
					input
						background: #F2F2F2
						outline:none
						border:none
						line-height:18px
						height:18px
						font-size: 13px
						color: #535353
						letter-spacing: -0.63px
						position:relative
						top:-1px
						width:76%

				.searchSpan
					width:11.3333%
					line-height:45px
					display:inline-block
					font-size: 16px
					color: #BA9765
					text-align:right
			.select_wrapper
				.select
					.select_h5
						top:45px
						bottom:0px
@media screen and (max-width:360px) and (min-width:300px)
	.search_wrapper
		position:relative
		.search
			background: #fff
			height:45px
			.search_h5
				.searchMain
					width:68.333%	
					input
						width:70% !important
	 			.searchSpan
					width:13.3333% !important
					
</style>