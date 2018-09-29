<template>
	<div class="integral_wrapper">
		<div class="integral">
			<!--移动端-->
			<transition name="fold">
				<div class="integral_h5" v-show="flag > 0" :class="{'integral_PC':isPC()}">
					<div class="content">
						<span class="close iconfont icon-PCclose" @click="maskHide ($event)"></span>
						<div class="balance" v-if="Data.CustomerAccount">{{flag === 1 ? '钱包余额' : '积分余额'}} <span class="Arial">{{flag === 1 ? Data.CustomerAccount.WalletMoney : Data.CustomerAccount.IntegralMoney}}</span> {{flag === 1 ? '元' : '积分'}}</div>
						<div class="use" v-if="Data.CustomerAccount">本次使用<input type="number" :disabled="isDisabled" v-model="willPay" id="ipta" @focus='addBodyClass' @blur='removeBodyClass'>{{flag === 1 ? '元' : '积分'}} <span v-show="isPC() && flag === 2">( 可抵<i> {{Math.floor(willPay / balance)}} </i>元 )</span></div>
						<p v-show=" multiple > 0"><i class="iconfont icon-cuowutishi"></i>{{blur}}</p>
						<a  href="javascript:;" class="btn" :class="{'active':payIpt}" @click="sure()" id="enter-hooka">确定</a>
						{{enter}}
					</div>
				</div>					
			</transition>
			<transition name="moveMask">
				<div class="mask" v-show="flag > 0" @click="maskHide($event)"></div>
			</transition>
		</div>
	</div>
</template>
<script type="text/ecmascript-6" scope>
	export default {
	  name: 'integral',
	  props: {
	  	flag: {
	  		type: Number // 控制积分浮层显示隐藏
	  	},
	  	Data: {
	  		type: Object
	  	},
	  	purse: { // 1表示钱包弹框显示 2表示积分弹框显示
	  		type: Number
	  	},
	  	walletMoney: { // 钱包支付金额
	  		type: Number
	  	},
	  	integralMoney: { // 钱包支付金额
	  		type: Number
	  	},
	  	balance: { // 积分支付比例
	  		type: Number
	  	}
	  },
	  data () {
	  	return {
	  		willPay: null, // 必付
	  		payIpt: false, // 支付输入框的内容长度大于1的时候确定按钮为激活状态
	  		multiple: 0, // 0 表示默认  1金额必须为整数 2积分是100的整数倍
	  		maxVal: null, // 最大值
	  		itemWallet: null, // 钱包支付金额
	  		itemIntegral: null, // 积分支付金额
	  		blurFlag:0,//自动处理discount的整数倍
	  		eventFlag:0,//点击确定时修改成1，防止失去焦点触发事件
	  		nowDate:null,//当前日期
	  	}
	  },
	  computed: {
	  	//	判断是否禁止输入
	  	isDisabled () {
	  		if (this.flag === 1) {
	  			if (this.Data.PayDetailInfo.IsWalletMoney > 0) {
	  				this.willPay = this.Data.PayDetailInfo.WalletMoney
	  				return true
	  			} else {
	  				this.willPay = null
	  				return false
	  			}
	  		} else {
	  			if (this.Data.PayDetailInfo.IsIntegralMoney > 0) {
	  				this.willPay = this.Data.PayDetailInfo.IntegralMoney
	  				this.multiple = 0
	  				return true
	  			} else {
	  				this.willPay = null
	  				return false
	  			}
	  		}
	  	},
	  	blur () {
	  		// 输入框的内容不能为空
	  		this.multiple = 0
	  		if (this.willPay === null || this.willPay === '') {
	  			this.payIpt = false
	  			this.multiple = 0
	  		    return false
	  		}
	  		// 输入框的内容不能为0
	  		if (this.willPay === 0){
  			 	this.payIpt = false
  			 	this.multiple = 3;
  			 	if(this.flag === 1){
  			       return '输入不能为 0 '
  			 	}else{
  			 	   return `积分必须为${this.balance}的整数倍`
  			 	}
	  		}

	  		
	  		// 二次点击清空输入框内的赋值
	  		if (this.walletMoney === 0){
	  			this.itemWallet = 0
	  			if (this.integralMoney === 0) {
		  			this.itemIntegral = 0
		  		}
	  		}else if (this.integralMoney === 0) {
	  			this.itemIntegral = 0
	  			if (this.walletMoney === 0) {
		  			this.itemWallet = 0
		  		}
	  		}

  			if ((this.flag === 1) || (this.flag === 2)){
  				this.payIpt = true
  				this.multiple = 0;
  				// 积分必付金额  钱包必付金额

  				if (this.flag === 1) {
  					if (this.purse === 1){
  						//如果积分必付存在的话，让输入的积分为0
  						if(this.balance == 0){
  							
  							//判断必付积分可抵扣多少钱
  							if(this.Data.PayDetailInfo.IntegralToCashMoney > 0){
  								this.itemIntegral = parseFloat(this.Data.PayDetailInfo.IntegralToCashMoney)
  							}else{
  								this.itemIntegral = 0;
  							}
  						}else{
  							if(this.Data.PayDetailInfo.IsIntegralMoney == 1){
  								this.itemIntegral = Math.floor(parseFloat(this.Data.PayDetailInfo.IntegralMoney) / parseFloat(this.balance));
  							}else{
  								this.itemIntegral =Math.floor(parseFloat(this.integralMoney) / parseFloat(this.balance));
  							}
  						}
  						
  					} else {
  						this.itemWallet = this.willPay
  					}
  					this.maxVal = this.Data.PayDetailInfo.TotalMoney - this.itemIntegral
  					
  					if (this.maxVal < this.willPay) {
  						this.multiple = 1
  						this.payIpt = false
  						return '已超订单所需金额'
  						//return '支付金额不能大于总金额'
  					}
  					if (this.Data.CustomerAccount.WalletMoney < this.willPay) {
  						this.multiple = 1
  						this.payIpt = false
  						return '钱包余额不足'
  					}
  					
  				} else if (this.flag === 2) {
  					if (this.Data.PayDetailInfo.WalletMoney > 0){
  						this.itemWallet = this.Data.PayDetailInfo.WalletMoney
  					}else{
  						this.itemWallet = this.walletMoney
  					}
  					this.maxVal = this.Data.PayDetailInfo.TotalMoney - this.itemWallet
  					
  					//如果积分必付存在的话，让输入的积分为0
  					if(this.balance == 0){
  						
  						//判断必付积分可抵扣多少钱
  						if(this.Data.PayDetailInfo.IntegralToCashMoney > 0){
  							this.itemIntegral = parseFloat(this.Data.PayDetailInfo.IntegralToCashMoney)
  						}else{
  							this.itemIntegral = 0;
  						}
  					}else{
  						if(this.Data.PayDetailInfo.IsIntegralMoney == 1){
  							this.itemIntegral = Math.floor(parseFloat(this.Data.PayDetailInfo.IntegralMoney) / parseFloat(this.balance));
  						}else{
  							this.itemIntegral =this.willPay / this.balance;
  						}
  					}
  					if (this.maxVal < this.itemIntegral) {
  						this.multiple = 2
  						this.payIpt = false
  						return '已超订单所需积分'
  						//return '支付积分不能大于总需积分'
  					}
  					if (this.Data.CustomerAccount.IntegralMoney < this.willPay) {
  						this.multiple = 2
  						this.payIpt = false
  						return '剩余积分不足'
  					}
  					
  					if (this.Data.CustomerAccount.IntegralLimit!=0 && this.Data.CustomerAccount.IntegralLimit < this.willPay) {
  						this.multiple = 2
  						this.payIpt = false
  						return `支付积分已超出限额${this.Data.CustomerAccount.IntegralLimit}积分`
  					}

  				}
  			} 

  			 if (this.flag === 1 && (/^\d+(\.\d{3,})$/.test(this.willPay))) {
  				this.multiple = 1
  				this.payIpt = false
  				return '输入金额不能超过2位小数'
  			}else{
  				this.payIpt = true
  				this.multiple = 0
  			}
  			if(this.blurFlag === 1){
  				this.multiple = 1;
  				this.payIpt = true;
  				this.eventFlag = 1;
  				return `积分必须为${this.balance}的整数倍,再次点击确认提交`
  			}
	  		
	  	},
	  	enter () {
			this.enterPublick('enter-hooka',this.payIpt)
	  	}
	  },
	  mounted () {
	     
	  },
	  methods: {
	  	// 浮层隐藏
	  	maskHide (event) {
	  	  this.willPay = null
	  	  this.$root.eventHub.$emit('maskHide', 0)
	  	  this.payIpt = false
	  	},
	  	// 删除类名
	  	removeBodyClass(){ 
		  	let ua = navigator.userAgent.toLowerCase();	
		  	if (/iphone|ipad|ipod/.test(ua)) {
		  		document.body.classList.remove('fullbody');//原生的写法
		  	} 
		  	if(this.purse == 2){
			  	 if(this.willPay % this.balance !== 0){
		 		  	  this.nowDate = new Date().getTime();
		 	      	  if (this.flag === 2 && this.willPay % this.balance !== 0) {
		 	    	  	this.multiple = 2
		 	    	  	this.payIpt = false
		 	  			this.willPay = Math.floor(this.willPay/this.balance)*this.balance;
		 	  			this.blurFlag = 1;
		 	  			return 
		 		  	  } 
			  	 }

			  	 
		  	}
	  	 	  	  	  	  
	  	},
	  	// 确定
	  	sure () {
	  		if(this.purse == 2){
		  	  this.blurFlag = 1
	  		  if(this.eventFlag == 1){
	  		  	if((new Date().getTime()) - this.nowDate > 200){
	  		  		this.eventFlag = 0	  		  		
	  		  	}else{
	  		  		return;
	  		  	}	
	  		  }
	  		}
		  	
	  	  if ((this.payIpt === false && this.multiple > 0) || this.payIpt === false) {
	  	  	return
	  	  }
    	  if (this.flag === 2 && this.willPay % this.balance !== 0) {
	    	  	this.multiple = 2
	    	  	this.payIpt = false
	  			this.willPay = Math.floor(this.willPay/this.balance)*this.balance;
	  			this.blurFlag = 1;
	  			return 
		  	  } 
	  	  if (this.purse === 1) {
	  	  	this.$root.eventHub.$emit('maskHide', 1,this.willPay, this.purse)
	  	  } else {
	  	  	this.$root.eventHub.$emit('maskHide', 2,this.willPay, this.purse)
	  	  }
	  	  this.willPay = null
	  	  //document.body.style.position = 'relative'
	  	},
	  	//添加类名
	  	addBodyClass () {
	    	let ua = navigator.userAgent.toLowerCase();	
    		if (/iphone|ipad|ipod/.test(ua)) {
    			document.body.classList.add('fullbody')
    			//document.body.style.overflow='hidden';        
    			//document.addEventListener("touchmove",this.mo,false);//禁止页面滑动
    		}
    		this.blurFlag = 0;
    		this.eventFlag = 0;
	  	},
	  	
	  	mo (e) {
	  		e.preventDefault()
	  	}
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
	.integral_wrapper
		.integral
			.integral_h5
				position:fixed
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
				.content
					position:relative
					background:#fff
					padding-top:43px
					.close
						position:absolute
						font-size:16px
						color:#D3D3D3
						background:#fff
						top:15px
						right:15px
						cursor:pointer
					.balance
						font-size: 17px
						color: #858585
						line-height: 23px
						margin-bottom:33px
						text-align:center
						span
							font-size: 24px
							color: #c0191f
					.use
						text-align:center
						font-size: 17px
						color: #535353
						line-height:43px
						margin-bottom:55px
						input
							display:inline-block
							outline:none
							border:none
							margin:0px 6px
							padding:8px 0px
							width:137px
							height:27px
							border: 1px solid #D4D4D4
							border-radius: 52px
							font-size: 20px
							color: #535353
							text-align:center
							line-height:27px
							background: #FAFAFA
							overflow:hidden
					p
						position:absolute
						width:100%
						top:162px
						height:20px  
						font-size:15px
						color:rgba(192,25,31,1)
						line-height:20px
						text-align:center
						i
							display:inline-block
							margin-right:3px
							position:relative
							top:1px
						.icon-cuowutishi
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
				.content
					padding-top:39px
					text-align:center
					.close
						top:20px
						right:20px
					.balance
						font-size:16px
						line-height:27px
						margin-bottom:22px
						color:#858585
						span
							font-size:24px
					.use
						line-height:33px
						margin-bottom:17px
						font-size:16px
						input
							height:33px
							width:95px
							padding:0px 5px
							background:#fff
							line-height:33px
							overflow:hidden
						span
							color:#979797
							i
								font-style:normal
								color:#B00018
								font-family:Arial
					p
						top:135px
						i
							display:inline-block
							margin-right:3px
							position:relative
							top:1px
					.btn
						display:inline-block
						width:140px
						background: #D3D3D3
						height:45px
						line-height:45px
						text-align:center
						font-size: 18px
						color: #FFFFFF
						outline:none
						border:none
						border-radius: 58px
						margin-top:25px

						
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