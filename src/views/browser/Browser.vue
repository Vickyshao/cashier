<template>
	<div class="bro_container">
		<div class="head_box">
			<div class="img">
				<img src="./arrow.png">
			</div>
			<p class="top_text">右上角 … 选择</p>
			<div class="circle andr" v-if="this.andrIos()">
				<img src="./other.png">
			</div>
			<div class="circle ios" v-if="!this.andrIos()">
			   <img src="./safari.png">
			</div>
			<p class="bottom_text">前往支付宝支付</p>
		</div>
		<div class="btn_box">
			<a class="complete" href="javascript:;" @click="successFn()">已支付完成</a>
			<a class="back" href="javascript:;" @click="back()">取消并返回</a>
		</div>
		{{isWX}}
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
	  name: 'browsera',	  
	  data(){
	  	return{
	  	} 
	  },
	  computed:{
	  	isWX(){
	  		if(!this.is_weixn()){	  			
	  			let itemData = JSON.parse(this.$route.query.obj)
	  			window.location.href = this.$root.publicPath + '/mvc/Pay/gopay?paypalId=' + itemData.PaypalId
	  		}
	  	}
	  },
	  methods:{
	  	back(){
	  		this.$router.go(-1)
	  	},
	  	successFn(){
	  		let itemData = JSON.parse(this.$route.query.obj)
	  		this.$router.push({path: '/success',query:{'orderNo':itemData.CashierInfoId}})
	  	},
  		//判断是否是微信
  	    is_weixn() {
  	        var ua = navigator.userAgent.toLowerCase();
  	        if (ua.match(/MicroMessenger/i) == "micromessenger") {
  	            return true;
  	        } else {
  	              return false;
  	        }
  	    },
	  }
	  
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.bro_container
		position:relative
		background:#fff
		z-index:10
		.head_box
			background:#FBFBFB
			width:100%
			height:334px
			text-align:center
			padding-top:64px
			.img
				position:absolute
				right:25px
				top:13px
				img
					width:66px
					height:69px
					background-size:66px 69px
			.top_text
				height:28px 
				font-size:20px
				font-weight:bold
				color:rgba(83,83,83,1);
				line-height:28px
			.circle
				width:165px
				height:165px 
				margin:0 auto
				margin-top:14px
				img
					width:165px
					height:165px
					background-size:165px 165px
			.bottom_text
				height:28px 
				font-size:20px
				font-weight:bold
				color:rgba(83,83,83,1);
				line-height:28px
				margin-top:15px
		.btn_box
			background:#fff
			width:100%
			a
				display:block
				width:222px
				height:45px 
				display:block
				font-size:18px
				color:#C0191F
				line-height:45px
				text-align:center
				border:1px solid #C0191F
				border-radius:116px
				box-sizing:border-box
				margin:0 auto
			.complete
				margin-top:42px
			.back
				margin-top:30px
				margin-bottom:69px
</style>