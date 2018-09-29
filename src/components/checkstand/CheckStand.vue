<template>
	<div class="checkstand_wrapper" :class="{'checkstandPC':isPC()}" v-show="hideHead == 0">
		<div class="checkstand">
			<!--移动-->
			<div class="checkstand_h5" v-show="!isPC()" :class="{'bg':color}">
				<span class="arrow_left iconfont icon-back" @click="back"></span>
				<!--<h2>{{title}}</h2>-->
				<h2>
					<!--<router-link to="/order"></router-link>-->
					<a href="http://www.bthhotels.com">{{title}}</a>
				</h2>
			</div>
			<!--PC-->
			<div class="checkstand_PC fix" v-show="isPC()">
				<div class="left fl">
					<img src="./logo.png" alt="" @click="goDetail()">
					<span class="pay_in" @click="goPay()"><i>￥</i>收银台</span>
				</div>
				<div class="right fr" v-if="show">
					<router-link class="record" to="/order">我的支付记录</router-link>
					<!--<span class="login" v-if="this.Data.CustomerAccount">你好,{{this.Data.CustomerAccount.UserName}}</span>-->
					{{getUserName}}
					<span class="login" v-if="IsAnonymousa === 0">你好, {{userNamea}}</span>
					<a herf ="javascript:;" class="logina" v-if="IsAnonymousa === 1" @click="login()">登录家宾会</a>
					<a class="registration" href="javascript:;"  @click="logout" v-if="IsAnonymousa === 0">退出</a>
					<a class="registration" href="javascript:;"  @click="zhuce" v-if="IsAnonymousa === 1">注册</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
	  name: 'checkstand',
	  props: {
	  	title: {
	  		type: String
	  	},
	  	Data: {
	  		type: Object
	  	},
	  	show: { // 登录信息显示隐藏
	  		type: Boolean
	  	},
	  	color: { // 修改头部导航背景色为红色
	  		type: Boolean
	  	},
	  	goList: {
	  		type:Number,
	  		default: 0
	  	},
	  	userName:{
	  		type:String
	  	},
	  	IsAnonymous:{
	  		type:Number
	  	},
	  	HeadDiv:{
	  		type:[Number,String]
	  	}
	  },
	  data() {
	  	return {
	  		userNamea: null,
	  		IsAnonymousa: null,
	  		IsHideHeadDiv:0,
	  	}
	  },
	  mounted() {
	  	// this.userName = this.getCookie('userName')
	  },
	  computed: {
	  	getUserName () {
	  		this.userNamea = this.userName
	  		this.IsAnonymousa = this.IsAnonymous
	  	},
	  	hideHead(){
	  		return this.HeadDiv === undefined ? parseInt(this.getCookie('IsHideHeadDiv')) : this.HeadDiv;
	  	}
	  },
	  methods: {
	  	back () {
	  		if (this.goList === 1){
	  			this.$router.push({path:'/order'})
	  		} else {
	  			this.$router.go(-1)
	  		}	
	  	},
	  	goDetail () {
	  		window.location.href = "http://www.bthhotels.com"
	  	},
	  	//点击收银台跳转到列表页
	  	goPay () {	  		
	  		this.$router.push({path:'/order'})
	  	},
	  	//
	  	logout () {
	  		window.location.href = this.$root.publicPath + '/Mvc/Login/LogOut'
	  	},
	  	login () {
	  		window.location.href = 'https://login.bthhotels.com/login/index?returnUrl=' + encodeURI(window.location.href)
	  	},
	  	zhuce () {
	  		window.location.href = 'https://login.bthhotels.com/Reg'
	  	}
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
	.checkstand_wrapper
		width:100%
		background:#fff
		position:relative
		// 移动样式
		.checkstand_h5
			span
				position:absolute
				left:17px
				font-size:16px
				color:#535353
				line-height:45px
			h2
				text-align:center
				a
					display:inline-block
					font-size:18px
					color:#2F2E2E
					height:45px
					line-height:45px
					position:relative
					top:0px
		.bg
			background:#C0191F
			span:before
				color:#fff
			h2
				color:#fff
				a
					color:#fff
		// PC样式
		.checkstand_PC
			margin:0 auto
			max-width:1000px
			min-width:1000px
			padding:22px 0px 20px
			.left
				img
					display:inline-block
					margin-right:18px
					height:37px
					width:185px
					background-size:185px 37px
					cursor:pointer
				.pay_in
					display:inline-block
					width:75px
					height:26px
					font-size: 13px
					color: #BA9765
					letter-spacing: 1.39px
					border: 1px solid #BA9765
					border-radius: 43px
					text-align:center
					line-height:26px
					vertical-align:top
					position:relative
					cursor:pointer
					top:5px
					i
						font-style:normal
			.right
				height:37px
				span
					displya:inline-block
					font-size: 14px
					color: #BA9765
					line-height:37px
					cursor:pointer
				a
					displya:inline-block
					font-size: 14px
					color: #BA9765
					line-height:37px
					cursor:pointer
				.record
					padding-right:65px
				.login
					padding-right:19px
					color:#535353
					cursor:pointer
				.logina
					color: #BA9765
					display:inline-block
					margin-right:12px
	.checkstand_wrapperPC
		max-width:1000px
		min-width:1000px
		margin:0 auto
</style>