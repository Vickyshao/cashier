<template>
	<div class="pay_wrapper">
		<div class="pay">
			<!--移动-->
			<div class="pay_h5" :class="{'pay_PC':isPC()}" v-if="Data.PayDetailInfo">
				<div class="submit">订单提交成功，请尽快付款！</div>
				<div class="order_number">
					<span class="sp1">订单号 : </span><span class="sp2 Arial">&nbsp;{{Data.PayDetailInfo.OrderNo}}</span>
				</div>
				<div class="pay_time" v-show="false">
					请您在{{Data.PayDetailInfo.ValidMinutesCounts}}分钟内完成支付，否则订单会被自动取消。
				</div>
				<div class="pay_amount_box fix" >
					<div class="pay_money block" v-if="Data.PayDetailInfo.TotalMoney > 0">
						<span class="sp1">应付金额 : </span> <span class="sp2">{{Data.PayDetailInfo.TotalMoney}}</span><span class="sp3">元</span>
					</div>
					<div class="pay_money block" v-if="isIntegral">
						<span class="add_signal" v-if="Data.PayDetailInfo.TotalMoney > 0 && isPC()"> + </span>
						<span class="sp1">应付积分 : </span> <span class="sp2">{{Data.PayDetailInfo.IntegralMoney}}</span><span class="sp3">积分</span>
					</div>
					<div class="pay_money block" v-if="Data.PayDetailInfo.CarbonScore > 0">
						<span class="add_signal" v-if="(Data.PayDetailInfo.TotalMoney > 0 || isIntegral)&& isPC()"> + </span>
						<span class="sp1">应付碳积分 : </span> <span class="sp2">{{Data.PayDetailInfo.CarbonScore}}</span><span class="sp3">碳积分</span>
					</div>
					{{IntegralFn}}
					<div class="pay_detail fr" @click="detail_Show()">
						<span class="sp1">订单详情</span><span class="sp2" :class="{'iconfont icon-down-arrow':!detailShow,'iconfont icon-top-arrow':detailShow}"></span>
					</div>
				</div>
			</div>
			
			<!--详情内容-->
			<transition name="detailMove">
				<div class="detail_box" :class="{'h5_border':!isPC(),'PC_border':isPC()}" v-show="detailShow" v-if="Data.PayDetailInfo">
					<div class="detail_content fix">
						<div class="product_name fl">商品名称：</div>
						<div class="product_text fl">
							{{Data.PayDetailInfo.ProductName}}
						</div>
					</div>
				</div>
			</transition>			
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
	  name: 'checkstand',
	  props: {
	  	Data: {
	  		type: Object
	  	}
	  },
	  data () {
	  	return {
	  	  detailShow: false,
	  	  isIntegral:false,
	  	  balance:null
	  	}
	  },
	  computed:{
	  	IntegralFn(){
	  		let item = this.Data.SupportPayments
	  		for (let i = 0; i < item.length; i++) {
	  			if (item[i].PayWayName === '积分支付') {
	  				this.balance = parseFloat(item[i].Balance);
	  			}
	  		}
	  		if(parseInt(this.Data.PayDetailInfo.IntegralToCashMoney) == 0 && parseInt(this.balance) == 0){
	  			this.isIntegral = true
	  		}
	  	}
	  },
	  methods: {
	  	// 支付详情显示隐藏
	  	detail_Show () {
	  		if (this.detailShow) {
	  			this.detailShow = false
	  		} else {
	  			this.detailShow = true
	  		}
	  		this.$root.eventHub.$emit('detail-show', this.detailShow) // 传输点击的目标元素
	  	}
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
	.pay_wrapper
		background: #F7F7F7
		// 移动
		.pay_h5
			padding:15px 16px
			position:relative
			.submit
				font-size: 15px
				color: #535353
				font-weight:bold
				height:20px
				line-height:20px
				margin-bottom:10px
			.order_number
				margin-bottom:9px
				span
					display:inline-block
					font-size: 15px
					color: #535353
					height:20px
					line-height:20px
				.sp2
					font-family:Arial
			.pay_amount_box
				.pay_money
					.sp1
						font-size: 15px
						color: #535353
						height:22px
					.sp2
						font-size: 20px
						color: #B00018
						font-weight:700
						height:22px
					.sp3
						font-size: 15px
						color: #535353
						height:22px
					span
						display:inline-block
						line-height: 22px
				.block
					display:block
				.pay_detail
					position:absolute !important
					right:20px;
					bottom:14px
					span
						display:inline-block
						line-height: 20px
					.sp1
						font-size: 15px
						color: #BA9765
						padding-right:9px
					.sp2
						font-size: 12px
						color: #BA9765
						vertical-align:middle
						position:relative
						top:0px
		// PC
		.pay_PC
			padding:0px
			padding:32px 40px 23px
			.submit,.order_number
				font-size:18px
				height:24px
				line-height:24px
				margin-bottom:14px
			.order_number
				margin-bottom:13px
				span
					font-size:18px
					line-height:24px
					height:24px
			.pay_amount_box
				.pay_time
					font-size: 16px
					color: #535353
					height:21px
					line-height:21px
				.pay_money
					span
						display:inline-block
					.sp1,.sp3
						font-size:18px 
						line-height:24px
						height:33px   
					.sp2
						font-size:30px
						line-height:33px
						height:33px
						font-family:Arial 
				.block
					display:inline-block 
				.pay_detail 
					position:absolute !important
					top:auto
					bottom:31px
					right:40px
					cursor:pointer
					font-size:16px
					line-height:21px
					.sp1
						font-size: 16px !important
				
		.detail_box
			// 支付详情移动
			&.h5_border
				padding:10px 17px 15px
				border-top: 1px solid #EBEBEB
				.detail_content
					font-size: 14px
					color: #535353
					line-height: 20px
					.product_name
						//width:78px
						width:22.9%
						font-size: 14px
						color: #535353
					.product_text
						width:77.1%
						font-size: 14px
						color: #535353
			// 支付详情PC
			&.PC_border
				padding:0px 40px 0px
				.detail_content
					padding-top:15px
					padding-bottom:15px
					border-top: 1px solid #EBEBEB
					font-size: 16px
					color: #535353
					line-height: 30px
					.product_name
						width:85px
						font-size: 16px
						color: #535353
						line-height: 30px
					.product_text
						width:835px
						font-size: 16px
						color: #535353
						line-height: 30px
	@media screen and (max-width: 360px) and (min-width: 300px)
		.pay_wrapper
			.detail_box
				// 支付详情移动
				&.h5_border
					.detail_content
						.product_name
							width:24.9%
						.product_text
							width:75.1%
</style>