<template>
	<div class="integral_wrappera">
		<div class="integral">
			<!--移动端-->
			<transition name="fold">
				<div class="integral_h5" :class="{'integral_PC':isPC()}" v-show="btn" >
						<div class="close">
							<span class="iconfont icon-PCclose" @click="maskHide ($event)"></span>
						</div>
						<div class="pay_password">
							<h3>请输入短信验证码</h3>
							<p v-if="this.Data.CustomerAccount"><span class="sp1">将发送短信至</span><span class="sp2"> {{this.Data.CustomerAccount.CellPhone.replace(this.Data.CustomerAccount.CellPhone.substring(4, 8), '****')}}</span></p>
							<div class="send_box" >
								<input type="number" class="send_num" :class="{'active':andr}" ref="sendNum" placeholder="验证码" @focus='addBodyClass' @blur='removeBodyClass'>
								<span class="send" :class="{'active':n !== 59}" @click="countdown()" ref="send">发送</span>
								<div class="err" v-show="err > 0"><i class="iconfont icon-cuowutishi"></i>{{objErr}}</div>
							</div>

						</div>
						<a herf="javascript:;" class="btn btn-hookb" :class="{'active':len ===4 && err === 0}" @click="sure($event)" id="enter-hookb">验证并支付</a>
						{{entera}}
						
				</div>				
			</transition>
			<transition name="moveMask">
				<div class="mask" v-show="btn" @click="maskHide($event)"></div>
			</transition>
			<!--公共错误弹框-->
			<v-modal :prom="prom"></v-modal>
		</div>
	</div>
</template>
<script type="text/ecmascript-6" scope>
	import Modal from '@/components/modal/Modal'
	export default {
	  name: 'integral',
	  props: {
	  	btn: {
	  		type: Boolean // 验证码弹框显示隐藏
	  	},
	  	walletMoney: { // 钱包支付金额
	  		type: Number
	  	},
	  	integralMoney: { // 钱包支付金额
	  		type: Number
	  	},
	  	linePay: { // 在线支付编码
	  		type: String
	  	},
	  	Data: {
	  		type: Object
	  	},
	  	balance: { // 积分支付比例
	  		type: Number
	  	},
	  	payCode: {// 支付编号
	  		type: String
	  	},
	  	integralToMoney:{
	  		type: Number
	  	}
	  },
	  data () {
	  	return {
	  		len: 0,
	  		n: 59, // 倒计时时间
	  		bl: true, // 开关解决倒计时狂点
	  		val: 0, // 短信验证码
	  		err: 0, // 1表示验证码请求失败    2 表示验证码验证失败
	  		totalMoney: 0, // 支付总金额
	  		tel: null, // 电话号码
	  		prom: null, // 错误提示信息
	  		timer: null,
	  		errText: null,
	  		codeFlag:true,
	  		andr:false
	  	}
	  },
	  computed: {
	  	objErr () {
	  		if (this.err === 1) {
	  			return this.errText
	  		} else if (this.err === 2) {
	  			return '短信验证码格式错误'
	  		} else {
	  			return ''
	  		}
	  	},
	  	// 划入效果
  	  	entera () {
  			this.enterPublick('enter-hookb',this.len ===4 && this.err === 0)
  	  	}
  	  	
	  },
	  beforeDestroy() {
	    clearInterval(this.timer)
	  },
	  mounted () {
	  	// 弹框按钮根据验证码的长度判断是否激活
	  	let oIpt = this.$refs.sendNum;
	  	let This = this
	  	oIpt.oninput = function () {
	  		if (this.value.length > 4) {
	  			This.err = 2
	  			return
	  		} else {
	  			This.err = 0
	  		}
	  		This.len = this.value.length
	  	}
	  	// 为了兼容andr  icon 位置
	  	
	  	if(!this.isPC()){
	  	    let ua = navigator.userAgent.toLowerCase(); 
	  	    if (/android/.test(ua)) {
	  	      this.andr = true
	  	    }
	  	}   
	  	
	  },
	  methods: {
	  	// 浮层隐藏
	  	maskHide (event) {
	  	  this.$root.eventHub.$emit('maskHide', event.target)
	  	  clearInterval(this.timer)
	  	  let oSend = this.$refs.send
	  	  oSend.innerHTML = '发送'
	  	  this.bl = true
		  this.n = 59
		  this.err = 0;
		  let oIpt = this.$refs.sendNum;
		  oIpt.value = '';
	  	},
	  	// 确定
	  	sure (event) {
	  	  if(this.codeFlag){
	  	  	this.sureAsync()
	  	  	let This = this
	  	  	setTimeout(function(){
	  	  		This.codeFlag = true
	  	  	},1000)
	  	  	
	  	  }
	  	  
	  	},
	  	// 倒计时
	  	countdown () {
	  		this.countdownAsync()
	  	},
	  	// 确认并支付异步加载函数
	  	sureAsync: async function () {
	  	  
	  	  let oIpt = this.$refs.sendNum
	  	  if (oIpt.value.length !== 4 || this.err > 0) {
	  	  	return
	  	  }
	  	  this.val = oIpt.value
	  	  let itemAdd = this.floatTool.add(this.walletMoney,this.integralToMoney);
	  	  this.totalMoney = this.floatTool.subtract(this.Data.PayDetailInfo.TotalMoney,itemAdd)
	  	  let params = {
	  	     'code': this.payCode,
 	  	    'WalletMoney': this.walletMoney, // 钱包支付金额
 	  	    'IntegralMoney': this.balance == 1 ?this.Data.PayDetailInfo.IntegralMoney:this.integralMoney, // 积分支付金额
 	  	    'SmsCode': this.val, // 手机验证码
 	  	    'OnlinePayMoney': this.totalMoney, // 在线支付金额
 	  	    'OnlinePayType': this.linePay, // 在线支付方式
 	  	    'CarbonScore':this.Data.PayDetailInfo.CarbonScore,//碳积分
	  	  }  
	  	  const res = await this.$root.http.post('/mvc/pay/SubPayInfos', params,this);
	  	  this.codeFlag = false
	  	  if (res.data.Flag === 0) {
	  	       this.err = 1
	  	       this.errText = res.data.Msg
	  	       this.codeFlag = true
	  	  } else if (res.data.Flag === 1 ){// 跳转成功页
	  	     //this.setCookie('CashierInfoId',res.data.Data)
	  	     this.$router.push({path: '/success',query:{'orderNo':res.data.Data}})
	  	  } else if (res.data.Flag === 2 ){// 跳转第三方
	  	  	if(this.linePay === '08'){//支付宝扫码支付
	  		  	  this.$root.eventHub.$emit('maskHide')
	  		  	  clearInterval(this.timer)
	  		  	  let oSend = this.$refs.send
	  		  	  oSend.innerHTML = '发送'
	  		  	  this.bl = true
	  			  this.n = 59
	  			  this.err = 0;
	  			  let oIpt = this.$refs.sendNum;
	  			  oIpt.value = '';
	  	  		let itemStr = this.$root.publicPath + '/mvc/Pay/gopay?paypalId=' + res.data.Data.PaypalId
	  	  		this.$root.eventHub.$emit('pay08',itemStr)
	  	  	}else {
	  	  		if(this.is_weixn()){
		  		 	window.location.href = this.$root.publicPath + '/pages/index.html#/browser?obj=' + JSON.stringify(res.data.Data);
		  		 	return;		
	  	  		}else{
	  	  		 window.location.href = this.$root.publicPath + '/mvc/Pay/gopay?paypalId=' + res.data.Data.PaypalId
	  	  		}
	  	  	}
	  	  } else if (res.data.Flag === 3 || res.data.Flag === 4 ){// 跳转钱包支付失败
	  	  	// this.setCookie('CashierInfoId',res.data.Data)
	  	  	// this.setCookie('Mask',res.data.Flag)
			 this.$router.push(
			 	{
					path: '/error',
			 		query:{
			 			'CashierInfoId':res.data.Data,
			 			'Mask':res.data.Flag
			 			}
			 	}
			 )
	  	  } else if (res.data.Flag === 5) { // 跳转钱包支付失败
				
				this.setCookie('PayMoney',res.data.Data.OnlinePayMoney) // 银联支付总金额
				this.setCookie('PaypalId',res.data.Data.PaypalId) // 银联ID
				this.setCookie('CashierInfoId',res.data.Data.CashierInfoId) // 银联订单尾号
			  	this.$router.push({path: '/bank'})
			}else if (res.data.Flag === 6 ){
				window.location.href = res.data.Data	
			}else if (res.data.Flag === 7 ){
				this.$router.push({path: '/identity',query:{'UserCardNo':res.data.Data.UserCardNo,'PaypalId':res.data.Data.PaypalId}})
			}
			 

	  	},
	  	// 获取验证码异步加载函数
	  	countdownAsync:async function () {
  			if (this.bl) {
	  			this.bl = false
	  			let oSend = this.$refs.send
	  			this.err = 0
			    let params = {
			    }
			    const res = await this.$root.http.post('/mvc/pay/QuerySmsPayCode', params,this)
			    if (res.data.Flag === 1) {
			       oSend.innerHTML = this.n-- + 'S'
			       this.timer = setInterval(() => {
		  				oSend.innerHTML = this.n-- + 'S'
		  				if (this.n === -1) {
		  					clearInterval(this.timer)
		  					oSend.innerHTML = '发送'
		  					this.bl = true
		  					this.n = 59
		  				}
		  			}, 1000)
			    } else if (res.data.Flag === 0 ){
			        this.bl = true
	   			  	//this.$root.bool = true
	   			  	//this.prom = res.data.Msg
	     			this.err = 1
			    }	  					
	  		} 			
	  	},
	  	//添加类名
	  	addBodyClass () {
	    	let ua = navigator.userAgent.toLowerCase();	
    		if (/iphone|ipad|ipod/.test(ua)) {
    			document.body.classList.add('fullbody')
    		}
	  	},
	  	// 删除类名
	  	removeBodyClass(){ 
	  	  let ua = navigator.userAgent.toLowerCase();	
	  	  if (/iphone|ipad|ipod/.test(ua)) {
	  	  	document.body.classList.remove('fullbody');//原生的写法
	  	  } 
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
	  },
	  components: {
	  	'v-modal': Modal
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
	.integral_wrappera
		.integral
			.integral_h5
				position:absolute
				left:0px
				bottom:0px
				width:100%
				z-index:20
				&.fold-enter-active,&.fold-leave-active
					transition:all 0.5s ease
				&.fold-enter-active
					transform:translate3d(0,0,0)
				&.fold-enter,&.fold-leave-active
					transform:translate3d(0,100%,0)
				.close
					position:relative
					height:43px
					background: #FFFFFF
					cursor:pointer
					span
						font-size:16px
						color:#D3D3D3
						position:absolute
						top:15px
						right:15px
				.pay_password
					text-align:center
					background: #FFFFFF 
					overflow:hidden
					h3
						font-size: 17px
						color: #979797
						height:23px
						line-height:23px
					p
						font-size: 17px
						line-height: 45px
						.sp1
							font-size: 17px
							color: #858585
						.sp2
							font-size: 17px
							color: #535353 
							font-family:Arial
					.send_box
						margin:10px 0px 61px
						position:relative
						span
							display:inline-block
						.send
							background: #BA9765
							border-radius: 45px
							height:45px
							width:83px
							outline:none
							font-size: 17px
							color: #FFFFFF
							line-height:45px
							margin-left:15px
							cursor:pointer
							&.active
								background:#D3D3D3
						.send_num
							width:115px
							height:27px
							padding:8px 0px
							background: #F7F7F7 
							border: 1px solid #D4D4D4
							border-radius: 52px
							font-size: 20px
							color: #535353
							text-align:center
							line-height:27px
							outline:none
							overflow:hidden
							position:relative
							top:1px
							&.active
								top:3px
						.err
							position:absolute
							width:100%
							top:60px
							height:20px 
							font-size:15px
							color:rgba(192,25,31,1)
							line-height:20px
							text-align:center
							background:#fff
							i
								display:inline-block
								font-size:16px
								position:relative
								top:1px
								right:3px
								color:#C0191F
						
				.btn
					display:inline-block
					width:100%
					background: #D3D3D3
					height:50px
					line-height:50px
					text-align:center
					font-size: 18px
					color: #FFFFFF
					outline:none
					border:none
					&.active
						background: #C0191F
			.integral_PC
				position:static
				position:fixed !important
				width:417px !important
				height:250px !important
				top:50%
				left:50% !important
				margin-left:-209px
				margin-top:-125px
				overflow:hidden
				border-radius: 20px	!important
				transform:translate3d(0,0%,0)
				background:#fff
				text-align:center
				&.fold-enter-active,&.fold-leave-active
					transition:all 0s ease
				&.fold-enter-active
					transform:translate3d(0,0%,0)
				&.fold-enter,&.fold-leave-active
					transform:translate3d(0,0%,0)
				.close
					span
						font-size:16px
						color:#D3D3D3
						top:20px
						right:20px
				.pay_password
					position:relative
					height:100%
					h3
						font-size:16px
						position:absolute
						left:93px
						top:58px
						line-height:16px	
					p
						font-size:16px
						position:absolute
						top:7px
						left:68px
						line-height: 21px
						.sp1
							font-size: 16px
							color: #979797
							line-height: 21px
						.sp2
							font-size: 16px
							color: #414141
							line-height: 21px
					.send_box
						position:static
						.send
							position:absolute
							top:0px
							right:68px
							width:72px
							font-size:14px
							height:35px
							line-height:35px
							margin-right:0px
						.send_num
							position:absolute
							padding:0px
							top:48px
							right:93px
							width:90px
							height:33px
							font-size: 16px							
							line-height:33px
							background:#fff
						.err
							top:92px	
				.btn
					position:absolute
					left:50%
					bottom:40px
					display:inline-block
					width:auto
					padding:0 25px
					background: #D3D3D3
					height:45px
					line-height:45px
					font-size: 18px
					color: #FFFFFF
					outline:none
					border:none
					border-radius:58px
					display: table-cell
					text-align: center
					transform: translate(-50%)
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