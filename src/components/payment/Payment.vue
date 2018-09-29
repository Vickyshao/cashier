  <template>
	<div class="payment_wrapper">
		<div class="payment">
			<!--移动-->
			<div class="payment_h5" :class="{'payment_PC':isPC()}"  ref="scrollWrapper">
				<div class="scroll_box" >
					<ul v-if="Data.CustomerAccount" >
						<li class="li_h5 fix" :class="{'active':wallet === 1}" v-show="SupportPayments('06') && Data.PayDetailInfo.IsCashGroup == 1">
							<div class="left fix fl">
								<div class="iconfont icon-qianbao fl"></div>
								<div class="pay_way fl">
									<p class="p1">如旅钱包</p>
									<p class="p2">余额 <span class="Arial">{{Data.CustomerAccount.WalletMoney}}</span>元</p>
								</div>
							</div>
							<div class="right fix fr">
								<div class="iconfont fr" :class="{'icon-duoxuanweixuanzhong':wallet !== 1,'icon-duoxuan':wallet === 1}" @click="maskShow(1, 1)"></div>
								<div class="pay fr" v-show="wallet === 1 || Data.PayDetailInfo.IsWalletMoneyPay > 0 || Data.PayDetailInfo.IsWalletMoney > 0">支付 <span class="Arial">{{walletPay}}</span>元</div>
								{{againPay}}
							</div>
							<div :class="{'gray':(Data.PayDetailInfo.IsWalletMoneyPay === 1 || Data.PayDetailInfo.IsWalletMoney > 0 || parseFloat(Data.PayDetailInfo.TotalMoney -integralToMoney)<=0),'light': ((Data.PayDetailInfo.TotalMoney -integralToMoney -Data.PayDetailInfo.WalletMoney == 0) && (this.balance != 0 || integralToMoney != 0) && parseFloat(Data.PayDetailInfo.TotalMoney - this.integralToMoney) != 0) ||(Data.PayDetailInfo.TotalMoney -integralToMoney -Data.PayDetailInfo.WalletMoney == 0) && (this.balance == 0)}"></div>
							<div class="opacity" @click="maskShow(1, 1)"></div>
						</li>  

						<li class="li_h5 fix" :class="{'active':integral === 2}" v-show="SupportPayments('05')" @click.prevent.stop="maskShow(2, 2)">
							<div class="left fix fl">
								<div class="iconfont icon-jifen fl"></div>
								<div class="pay_way fl">
									<p class="p1">积分 <span class="iconfont icon-tishi" v-show="!isPC()" @click.prevent.stop="iconInfo()"></span></p>
									<p class="p2">总共 <span class="Arial">{{ Data.CustomerAccount.IntegralMoney}}</span>积分 <span v-show="isPC() && balance != 0">( 可抵{{Math.floor(Data.CustomerAccount.IntegralMoney / balance)}}元 )</span></p>
									<span class="iconfont icon-tishi" v-show="isPC()" @click.prevent.stop="iconInfo()"></span>
								</div>
							</div>
							<div class="right">
								<div class="iconfont fr" :class="{'icon-duoxuanweixuanzhong':integral !== 2,'icon-duoxuan':integral === 2}" @click.prevent.stop="maskShow(2, 2)"></div>
								<div class="pay fr pay_h" :class="{'pay_ht':balance === 0}" v-show="integral === 2 || Data.PayDetailInfo.IsIntegralMoneyPay > 0 || Data.PayDetailInfo.IsIntegralMoney > 0">支付<span class="sp1 Arial">{{integralPay}}</span>积分<br/><span class="sp2" v-if="integralToMoney > 0">( 可抵<i class="Arial">{{integralToMoney}}</i>元 )</span></div>
							</div>
							<div :class="{'gray':(Data.PayDetailInfo.IsIntegralMoneyPay > 0 || Data.PayDetailInfo.IsIntegralMoney > 0 || parseFloat(Data.PayDetailInfo.TotalMoney - Data.PayDetailInfo.WalletMoney) == 0) || parseFloat(Data.PayDetailInfo.TotalMoney - this.walletMoney) == 0,'light': ((Data.PayDetailInfo.TotalMoney - Data.PayDetailInfo.WalletMoney - integralToMoney == 0) && (Data.PayDetailInfo.TotalMoney - this.walletMoney != 0)) || (Data.PayDetailInfo.TotalMoney == 0 && this.balance == 0) || ((Data.PayDetailInfo.TotalMoney - Data.PayDetailInfo.WalletMoney - integralToMoney == 0) && (Data.PayDetailInfo.TotalMoney - Data.PayDetailInfo.WalletMoney == 0))}"></div>
						</li>
						<li class="li_h5 fix active" v-if="Data.PayDetailInfo.CarbonScore > 0">
							<div class="left fix fl">
								<div class="iconfont icon-tanjifen fl"></div>
								<div class="pay_way fl">
									<p class="p1">碳积分</p>
				 					<p class="p2">总共 <span class="Arial">{{Data.CustomerAccount.CarbonScore}}</span>碳积分 </p>
								</div>
							</div>
							<div class="right fix fr">
								<div class="iconfont fr icon-duoxuan" ></div>
								<div class="pay fr">支付 <span class="Arial">{{Data.PayDetailInfo.CarbonScore}}</span>碳积分</div>
							</div>
							<div :class="{'gray':(Data.PayDetailInfo.TotalMoney - Data.PayDetailInfo.WalletMoney - integralToMoney) != 0 ,'light':(Data.PayDetailInfo.TotalMoney - Data.PayDetailInfo.WalletMoney - integralToMoney) == 0}"></div>
						</li>

					</ul>
					<div class="split" v-if="splitHide"></div>
					<ul class="ul_two" v-if="Data.PayDetailInfo"> {{IsAlipay}}
						<li class="li_h5 fix" :class="{'active':alipay === 5}" v-show="SupportPayments('10')">
							<div class="left fix fl">
								<div class="iconfont icon-xieyi fl" style="color:#95C493"></div>
								<div class="pay_way fl" style="margin-top:2px;" :class="{'pay_way_pc':isPC()}">
									<p class="p1">协议公司预授权</p>
									<p class="p2">可用金额 <span class="Arial">{{Data.CustomerAccount.CurCompanyPayMoney}}</span>元</p>
								</div>
							</div>
							<div class="right fix fr" >
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 5,'icon-danxuan':alipay === 5}" ></div>
								<div class="pay fr" v-show="alipay === 5">支付 <span class="Arial">{{(Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney).toFixed(2)}}</span>元</div>
							</div>
							<div :class="{'gray':(Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney) > Data.CustomerAccount.CurCompanyPayMoney }"></div>
							<div class="opacity" @click="alipays(5)"></div>
						</li>
						<li class="li_h5 fix" :class="{'active':alipay == 6}" v-show="SupportPayments('06') && Data.PayDetailInfo.IsCashGroup != 1" >
							<div class="left fix fl">
								<div class="iconfont icon-qianbao fl"></div>
								<div class="pay_way fl">
									<p class="p1">如旅钱包</p>
									<p class="p2">余额 <span class="Arial">{{Data.CustomerAccount.WalletMoney}}</span>元</p>
								</div>
							</div>
							<div class="right">
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 6,'icon-danxuan':alipay === 6}" @click="alipays(6)"></div>
								<div class="pay fr" v-show="alipay == 6 && Data.PayDetailInfo.TotalMoney - integralToMoney > 0">支付 <span class="Arial">{{(Data.PayDetailInfo.TotalMoney - integralToMoney).toFixed(2)}}</span>元</div>
								<div class="pay fr" v-show="Data.PayDetailInfo.TotalMoney - integralToMoney > Data.CustomerAccount.WalletMoney">钱包余额不足</div>
							</div>
							<div :class="{'gray':(Data.PayDetailInfo.TotalMoney - integralToMoney > Data.CustomerAccount.WalletMoney) ||Data.PayDetailInfo.TotalMoney - integralToMoney == 0}"></div>
							<div class="opacity" @click="alipays(6)"></div>
						</li>
						<li class="li_h5 fix" :class="{'active':alipay === 4}" v-show="isPC() && SupportPayments('08')">
							<div class="left fix fl">
								<div class="iconfont icon-zhifubao fl"></div>
								<div class="pay_way fl">
									<p class="p1 pt">支付宝</p>
									<span class="sweep_code" @click="Sweep()">扫码支付</span>
								</div>
							</div>
							<div class="right">
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 4,'icon-danxuan':alipay === 4}" @click="alipays(4)"></div>
								<div class="pay fr" v-show="alipay === 4">支付 <span class="Arial">{{(Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney).toFixed(2)}}</span>元</div>
								
							</div>
							<div :class="{'gray':parseFloat(Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney) <= 0}"></div>
							<div class="opacity"  @click="alipays(4)"></div>
						</li>
						<li class="li_h5 fix" :class="{'active':alipay === 1}" v-show="SupportPayments('01', '07')">
							<div class="left fix fl">
								<div class="iconfont icon-zhifubao fl"></div>
								<div class="pay_way fl">
									<p class="p1">支付宝</p>
								</div>
							</div>
							<div class="right">
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 1,'icon-danxuan':alipay === 1}" @click="alipays(1)"></div>
								<div class="pay fr" v-show="alipay === 1 && Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney > 0">支付 <span class="Arial">{{(Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney).toFixed(2)}}</span>元</div>
								
							</div>
							<div :class="{'gray':Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney<= 0}"></div>
							<div class="opacity" @click="alipays(1)"></div>
						</li>
						<li class="li_h5 fix" :class="{'active':alipay === 2}" v-show="SupportPayments('03') && !isPC() && is_weixn()">
							<div class="left fix fl">
								<div class="iconfont icon-weixin fl"></div>
								<div class="pay_way fl">
									<p class="p1">微信支付</p>
									<span class="sweep_code" v-show="false">扫码支付</span>
								</div>
							</div>
							<div class="right">  
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 2,'icon-danxuan':alipay === 2}" @click="alipays(2)"></div>
								<div class="pay fr" v-show="alipay === 2">支付 <span class="Arial">{{(parseFloat(Data.PayDetailInfo.TotalMoney) - walletMoney - integralToMoney).toFixed(2)}}</span>元</div>
							</div>
							<div :class="{'gray':Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney<= 0}"></div>
							<div class="opacity" @click="alipays(2)"></div>
						</li>
						<li class="li_h5 fix" :class="{'active':alipay === 7}" v-show="SupportPayments('12') && !isPC() && !is_weixn()">
							<div class="left fix fl">
								<div class="iconfont icon-weixin fl"></div>
								<div class="pay_way fl">
									<p class="p1">微信支付</p>
									<span class="sweep_code" v-show="false">扫码支付</span>
								</div>
							</div>
							<div class="right">  
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 7,'icon-danxuan':alipay === 7}" @click="alipays(7)"></div>
								<div class="pay fr" v-show="alipay === 7">支付 <span class="Arial">{{(parseFloat(Data.PayDetailInfo.TotalMoney) - walletMoney - integralToMoney).toFixed(2)}}</span>元</div>
							</div>
							<div :class="{'gray':Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney<= 0}"></div>
							<div class="opacity" @click="alipays(7)"></div>
						</li>
						<li class="li_h5 fix" :class="{'active':alipay === 3}" v-show="SupportPayments('02')">
							<div class="left fix fl">
								<img v-if="!isPC()" src="./h5.png" class="iconfont fl h5png">
								<img v-if="isPC()" src="./PC.png" class="iconfont fl PCpng">
								<div class="pay_way fl">
									<p class="p1 picon">银联支付</p>
								</div>
							</div>
							<div class="right">
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 3,'icon-danxuan':alipay === 3}" @click="alipays(3)"></div>
								<div class="pay fr" v-show="alipay === 3">支付 <span class="Arial">{{(Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney).toFixed(2)}}</span>元</div>
							</div>
							<div :class="{'gray':Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney<= 0}"></div>
							<div class="opacity"  @click="alipays(3)"></div>
						</li>
						<li class="li_h5 fix" :class="{'active':alipay === 8}" v-show="SupportPayments('13')">
							<div class="left fix fl">
								<div class="iconfont icon-guafangzhang fl"></div>
								<div class="pay_way fl pay_way_identify">
									<p class="p1">挂房账</p>
									<p class="p2">入住客人专享</p>
								</div>
							</div>
							<div class="right">
								<div class="iconfont fr" :class="{'icon-danxuanweixuanzhong':alipay !== 8,'icon-danxuan':alipay === 8}" @click="alipays(8)"></div>
								<div class="pay fr" v-show="alipay === 8">支付 <span class="Arial">{{(Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney).toFixed(2)}}</span>元</div>
							</div>
							<div :class="{'gray':Data.PayDetailInfo.TotalMoney - walletMoney - integralToMoney<= 0}"></div>
							<div class="opacity"  @click="alipays(8)"></div>
						</li>
						{{discountabc}}
					</ul>
				</div>
				<!--footer-->
				<div class="footer">
					<div class="spanBox" v-show="!isPC() && imgHidee">
						<span class="iconfont icon-PCclose" @click="imgHide()" ></span>
					</div>
					<img v-show="imgHidee" :src="imgUrl" @load="successImg">
					<a herf="javascript:;" class="paymentBtn" :class="{'active': wallet === 1 || integral === 2 || alipay > 0}" @click="payment()">立即支付</a>
				</div>
			</div>
			
		</div>
		<!-- 浮层支付-->
		<div class="interal_aa" >
			<v-integral :flag="flag" :purse="purse" :Data="Data" :walletMoney="walletMoney" :integralMoney="integralMoney" :balance="balance"></v-integral>
			<v-code :Data="Data" :btn="btn" :walletMoney="walletMoney" :integralMoney="integralMoney" :linePay="linePay" :balance="balance" :payCode="payCode" :integralToMoney="integralToMoney"></v-code>
		</div>
		<!--公共错误弹框-->
		<v-modal :prom="prom">
			<div class="msgSpan" slot="msg" v-if="modal_PC">
				<span class="color">{{balance}}</span>积分 = <span class="color">{{balance == 0 ? 0 : 1}}</span>元人民币
			</div>
		</v-modal>
		<div class="modal_h55" v-if="!isPC()&& modal_h5">
			<div class="msgSpan" slot="msg">
				<span class="color">{{balance}}</span>积分 = <span class="color">{{balance == 0 ? 0 : 1}}</span>元人民币
			</div>
		</div>
		<!--支付宝扫码弹出页-->
		<div class="modal-pc" v-if="hrefMask">
		    <div class="popup"></div>
		    <div class="alert-Alipay">
		        <div class="icon-close iconfont" @click="herfHide()"></div>
		        <div class="pay-img">
		            <iframe name="alipay_wx" :src="alipayHref" scrolling="no" width="960" height="650" style="position: absolute;
		                left: -297px;"></iframe>
		        </div>
		    </div>
		    <div class="text_box">
		    	<h1 class="h1">使用手机支付宝扫码完成付款</h1>
		    	<h2><a href="#">手机支付宝下载</a>&nbsp;&nbsp;&nbsp;丨&nbsp;&nbsp;&nbsp;<a href="#">如何使用？</a></h2>
		    </div>  
		</div>
		<!--支付宝扫码弹浮层-->
		<div class="mask" v-show="hrefMask" @click="herfHide()"></div>
		<div class="mask" v-show="modal_h5" @click="fnModal()"></div>
	</div>
</template>
<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import Integral from '@/components/integral/Integral'
	import Code from '@/components/code/Code'
	import Modal from '@/components/modal/Modal'
	export default {
	  name: 'payment',
	  props: {
	  	Data: {
	  		type: Object
	  	},
	  	payCode: {
	  		type:String
	  	}
	  },
	  data () {
	  	return {
	  		wallet: 0, // 判断钱包是否处在激活状态
	  		integral: 0, // 判断积分是否处在激活状态
	  		walletMoney: 0, // 钱包支付金额
	  		integralMoney: 0, // 钱包支付金额
	  		totalMoney: 0, // 支付总金额
	  		purse: 0, // 1表示钱包弹框显示 2表示积分弹框显示
	  		alipay: 1, // 1表示支付宝支付 2 表示微信支付 3表示在线支付  4表示支付宝扫码支付
	  		imgHidee: true,
	  		flag: 0, // 1 钱包弹框显示  2 积分弹框显示  3再次点击取消勾选并清除数据
	  		H: 'auto',
	  		only: null, // 判断钱包支付还是余额支付  0 钱包  1 余额
	  		btn: false,  // 在线支付点击 弹出验证码弹框，否则弹出输入框
	  		balance: 120, // 积分比例 100积分  相当于 0.01元
	  		linePay: '01', // 在线支付编码
	  		msgCode: '', // 手机号验证码
	  		alipayCode: null, // 移动PC动态修改支付编码
	  		prom: '报错了', // 错误提示信息
	  		code: 0, //判断如果积分和钱包是二次支付时 还有必付 
	  		alipayHref:'', //支付宝支付链接
	  		hrefMask: false,
	  		clickFlag: true, // 点击中间变量
	  		splitHide:true,
	  		integralToMoney:0,//积分转成钱
	  		modal_h5:false,//弹框显示隐藏
	  		modal_PC:false,
	  		imgUrl:'',
	  		isGroupPay:true,//判断是否是组合支付
	  	}
	  },
	  computed: {
	  	// 积分兑换比例
	  	discountabc () {
	  		this.imgUrl = this.Data.Ads[0].ImageUrl
	  		let item = this.Data.SupportPayments
	  		let flag05 = ""
	  		let flag06 = ""
	  		for (let i = 0; i < item.length; i++) {
	  			if (item[i].PayWayCode === '05') {
	  				this.balance = parseFloat(item[i].Balance);
	  				this.setCookie('Balance',this.balance)
	  				flag05 = '05'
	  				//return this.balance
	  			}
	  			if (item[i].PayWayCode === '06' && this.Data.PayDetailInfo.IsCashGroup == 1) {
	  				flag06 = '06'
	  			}
	  		}
	  		if(flag06 == "" && flag05 == "" && this.Data.PayDetailInfo.CarbonScore == 0){	  			
	  			this.splitHide = false
	  		}else{	  			
	  			this.splitHide = true
	  		}
	  		//如果积分必付存在的话，让输入的积分为0
	  		if(this.balance == 0){
	  			//判断必付积分可抵扣多少钱
	  			if(this.Data.PayDetailInfo.IntegralToCashMoney > 0){
	  				
	  				this.integralToMoney = parseFloat(this.Data.PayDetailInfo.IntegralToCashMoney.toFixed(2))
	  			}else{
	  				
	  				this.integralToMoney = 0;
	  			}
	  		}else{
	  		    
	  			if(this.Data.PayDetailInfo.IsIntegralMoney == 1){
	  				this.integralToMoney = Math.floor(parseInt(this.Data.PayDetailInfo.IntegralMoney) / parseInt(this.balance));
	  				
	  			}else{
	  				this.integralToMoney =Math.floor(parseInt(this.integralMoney) / parseInt(this.balance));
	  				
	  				
	  			}
	  		}
	  	},
	  	// 钱包支付
	  	walletPay () {
	  		if (this.Data.PayDetailInfo.IsWalletMoney > 0) {

	  			this.walletMoney = this.Data.PayDetailInfo.WalletMoney
	  		} else if (this.Data.PayDetailInfo.IsWalletMoneyPay > 0) {
	  			this.walletMoney = this.Data.PayDetailInfo.WalletMoney
	  		}
	  		return this.walletMoney
	  	},
	  	// 积分支付
	  	integralPay () {
	  		if (this.Data.PayDetailInfo.IsIntegralMoney > 0) {	  	
	  				this.integralMoney = this.Data.PayDetailInfo.IntegralMoney
	  			
	  		} else if (this.Data.PayDetailInfo.IsIntegralMoneyPay > 0) {
	  				this.integralMoney = this.Data.PayDetailInfo.IntegralMoney	
	  		}
	  		
	  		return parseFloat(this.integralMoney)
	  		
	  		
	  	},
	  	// 二次支付 与必付
	  	againPay () {
	  		
	  		// 钱包必付、已支付情况
	  		if (this.Data.PayDetailInfo.IsWalletMoney > 0 ) {
	  			// 如果是必付 就让code = 1 验证码弹框要弹
	  			this.code = 1
	  			this.wallet = 1
	  		} else if (this.Data.PayDetailInfo.IsWalletMoneyPay > 0 ) {
	  			// 验证码弹框不弹
	  			this.code = 0
	  			this.wallet = 1
	  		}
	  		// 积分必付、已支付情况
	  		if (this.Data.PayDetailInfo.IsIntegralMoney > 0 ) {
	  			// 如果是必付 就让code = 1 验证码弹框要弹
	  			this.code = 1
	  			this.integral = 2
	  		} else if (this.Data.PayDetailInfo.IsIntegralMoneyPay > 0) {
	  			// 验证码弹框不弹
	  			this.code = 0
	  			this.integral = 2
	  		}
	  		// 如果钱包是必付、积分已支付
	  		if (this.Data.PayDetailInfo.IsWalletMoney > 0 && this.Data.PayDetailInfo.IsIntegralMoneyPay > 0){
	  			this.code = 1
	  		} else if (this.Data.PayDetailInfo.IsWalletMoneyPay > 0 && this.Data.PayDetailInfo.IsIntegralMoney > 0 ) {
	  			// 如果积分是必付、钱包已支付
	  			this.code = 1
	  		}
	  		// 钱包积分都已支付
	  		if (this.Data.PayDetailInfo.IsWalletMoneyPay > 0 && this.Data.PayDetailInfo.IsIntegralMoneyPay > 0){
	  			this.code = 0
	  		}
	  		// 钱包积分都必付
	  		if (this.Data.PayDetailInfo.IsWalletMoney > 0 && this.Data.PayDetailInfo.IsIntegralMoney > 0){
	  			this.code = 1
	  		}
	  		// 钱包必付钱包已支付
	  		if (this.Data.PayDetailInfo.IsWalletMoney > 0 && this.Data.PayDetailInfo.IsWalletMoneyPay > 0){
	  			this.code = 0
	  		}
	  		// 积分必付积分已支付
	  		if (this.Data.PayDetailInfo.IsIntegralMoney > 0 && this.Data.PayDetailInfo.IsIntegralMoneyPay > 0){
	  			this.code = 0
	  		}
	  	},  
	  	//支付总金额小于0时，默认支付宝选择隐藏
	  	IsAlipay () {
	  		if(this.Data.PayDetailInfo.IsCashGroup == 1){
	  			if(this.Data.PayDetailInfo.TotalMoney - this.walletMoney - this.integralToMoney <= 0){
	  				this.alipay = 0
	  			}
	  			
	  		}else{
	  			if(this.Data.PayDetailInfo.TotalMoney - this. integralToMoney == 0){
	  				this.alipay = 0;
	  			}
	  		}
	  		
	  	}
	  },
	  created () {
	  	this.$root.eventHub.$on('maskHide', this.maskHide) // 浮层隐藏
	  	this.$root.eventHub.$on('maskShow', this.maskShow) // 浮层显示
	  	this.$root.eventHub.$on('detail-show', this.detailStatus)
	  	this.$root.eventHub.$on('keep', this.keepStatus)
	  	this.$root.eventHub.$on('pay08', this.fn08)
	  },
	  mounted () {
		if (this.isPC()) {
			this.linePay = '01'
		} else {	
			this.linePay = '07'	  		
		}

	  },
	  methods: {
	  	// 滚动条
	  	scrollBar (status) {
	  		// 产生滚动条
	  		this.$nextTick(function(){
	  			let winH = document.getElementById('app').offsetHeight
	  			let titleH = document.getElementsByClassName('checkstand_h5')[0].offsetHeight
	  			let  payH = document.getElementsByClassName('pay_wrapper')[0].offsetHeight
	  			let footerH = document.getElementsByClassName('footer')[0].offsetHeight
	  			let scrollH = (winH - titleH - payH - footerH)
	  			this.H = scrollH
	  			document.getElementsByClassName('payment_h5')[0].style.height = scrollH + 'px'		
	  		})
	  	 
	  	},
	  	// 支付宝支付 微信支付 在线
	  	alipays (num) {
	  		if (num === 1) {
	  			this.alipay = 1
				if (this.isPC()) {
					this.linePay = '01'
				} else {
					this.linePay = '07'
				}
	  		} else if (num === 2) {
	  			this.alipay = 2
	  			this.linePay = '03'
	  		} else if (num === 3) {
	  			this.alipay = 3
	  			this.linePay = '02'
	  		} else if (num === 4) {
	  			this.alipay = 4
	  			this.linePay = '08'
	  		}  else if (num === 5) {
	  			this.alipay = 5
	  			this.linePay = '10'
	  		}else if (num === 6) {
	  			this.alipay = 6;
	  			this.linePay = ''
	  		}else if (num === 7) {
	  			this.alipay = 7;
	  			this.linePay = '12'
	  		}else if (num === 8) {
	  			this.alipay = 8;
	  			this.linePay = '13'
	  		} else {
	  			this.alipay = 0
	  		}
	  		//判断钱包如果类似第三方支付
	  		if(this.Data.PayDetailInfo.IsCashGroup != 1){
		  		if(this.Data.PayDetailInfo.IsIntegralMoneyPay == 0 && this.integral == 2){
					this.code = 1;
				} 
	  		}
	  		
	  	},
	  	// 图片隐藏
	  	imgHide () {
	  		this.imgHidee = false
	  		let This = this
	  		setTimeout(function(){
	  			This.scrollBar()
	  		},100)
	  	},
	  	// 监控支付信息显示隐藏
	  	detailStatus () {
	  		let This = this
	  		if(!this.isPC()){
	  			setTimeout(function(){
	  				This.scrollBar()
	  			},100)
	  		}		
	  	},
	  	// 立即支付
	  	payment () {

	  		if (this.wallet === 0 && this.integral === 0 && this.alipay === 0 && this.Data.PayDetailInfo.IsWalletMoney === 0 && this.Data.PayDetailInfo.IsWalletMoneyPay === 0 && this.Data.PayDetailInfo.IsIntegralMoneyPay === 0 && this.Data.PayDetailInfo.IsIntegralMoneyPay === 0) {
	  			return
	  		}

	  		//如果支付积分不是抵扣积分的整数倍返回
	  		if((Math.floor(this.integralMoney % this.balance) > 0  || (this.integralToMoney == 0 && this.balance !=0))&& this.integralMoney != 0){
			      this.$root.bool = true
				  this.prom = `抵扣积分必须为${this.balance}的整数倍`
				  this.clickFlag = true;
				  return;
	  		}

	  		// 钱包全付
	  		if(this.alipay == 6){	  				
	  			this.walletMoney = this.Data.PayDetailInfo.TotalMoney - this.integralToMoney;
	  			this.btn = true;
	  			return;
	  		}
	  		
	  		// 既有钱包 或者积分 又有 在线支付
	  		if ((this.wallet === 1 || this.integral === 2) && this.alipay > 0 && this.code > 0) {
	  			this.btn = true
	  		}
	  		// 既有钱包 和积分
	  		if (this.wallet === 1 && this.integral === 2 && this.code > 0) {
	  			this.btn = true
	  		}
	  		// 只有钱包 或积分
	  		if ((this.wallet === 1 || this.integral === 2) && this.code > 0) {
	  			this.btn = true
	  		}
	  		
	  		// 只有在线支付
	  		if (this.code === 0 && this.alipay > 0) {
	  			if(this.alipay != 6){ 
	  				this.btn = false;
		  		}
	  			if(this.clickFlag === true){// 防止多次请求
	  				this.fetchData()//确认支付请求
	  				let This = this
	  				setTimeout(function(){
	  					This.clickFlag = true
	  				},1000)
	  			}
	  			
	  			
	  		}
	  	},
	  	// 浮层隐藏
	  	maskHide (num, countMoney, type) {
	  		this.flag = 0
	  		this.btn = false
	  		
	  		if(this.alipay == 6){
	  			this.walletMoney = 0;
	  			this.code = 0;
	  		}
	  		if (countMoney === undefined)	{
	  			return
	  		}
	  		if (type === 1) {
	  			this.code = 1
	  			this.wallet = parseInt(num)
	  			this.walletMoney = Number(countMoney)
	  		} else {
	  			this.code = 1
	  			this.integral = parseInt(num)
	  			this.integralMoney = parseInt(countMoney);
	  			this.integralToMoney = parseInt(countMoney)/this.balance;
	  		}
	  		// 如果积分与钱包的金额大于支付金额，就取消支付宝支付，否则显示
	  		if (this.Data.PayDetailInfo.TotalMoney == this.walletMoney + this.integralToMoney) {
	  			this.alipay = 0
	  		} ;
	  	},
	  	// 浮层显示  弹框显示
	  	maskShow (num, purse) {
	  		if (this.Data.PayDetailInfo.TotalMoney - this.Data.PayDetailInfo.IntegralToCashMoney - this.Data.PayDetailInfo.WalletMoney === 0) {
	  			return
	  		}
	  		if (num === 1) {
	  			// 二次支付的话点击无效
	  			if (this.Data.PayDetailInfo.IsWalletMoneyPay > 0) {
	  				return
	  			}
	  			//必付点击无效
	  			if (this.Data.PayDetailInfo.IsWalletMoney > 0) {
	  				return
	  			}
	  			if(this.Data.PayDetailInfo.TotalMoney - this.integralToMoney == 0){
	  				return
	  			}
	  			if (this.wallet === 1) {
	  				this.wallet = parseInt(0)
	  				this.walletMoney = parseInt(0)
	  				//如果积分是二次支付的话 就让code = 0 也就是不需要验证码
	  				
	  				if(this.Data.PayDetailInfo.IsIntegralMoneyPay > 0){
	  					this.code = 0
	  				}
	  				//如果积分和钱包都取消了，不选了，code = 0
		  			if(this.integral == 0 && this.wallet == 0){
		  				this.code = 0
		  			}
		  			//如果取消钱包选中 判断钱包加积分是不是等于总金额 如果相等默认选中支付宝
		  			if(this.Data.PayDetailInfo.TotalMoney - this.integralToMoney > 0 && this.alipay == 0){
		  				this.alipay = 1
		  			}
	  				return
	  			}
	  		} else {
	  			if (this.Data.PayDetailInfo.IsIntegralMoneyPay > 0) {
	  				return
	  			}else if(this.Data.PayDetailInfo.IsIntegralMoney > 0){
	  				return
	  			}
	  			if(this.Data.PayDetailInfo.TotalMoney - this.walletMoney == 0){
	  				return
	  			}
	  			if (this.integral === 2) {
		  			this.integral = parseInt(0)
		  			this.integralMoney = parseInt(0)
		  			//如果钱包是二次支付的话 就让code = 0 也就是不需要验证码
		  			if(this.Data.PayDetailInfo.IsWalletMoneyPay > 0){
		  				this.code = 0
		  			};
		  			//如果积分和钱包都取消了，不选了，code = 0
		  			if(this.integral == 0 && this.wallet == 0){
		  				this.code = 0
		  			}
		  			//如果取消钱包选中 判断钱包加积分是不是等于总金额 如果相等默认选中支付宝
		  			if(this.Data.PayDetailInfo.TotalMoney - this.walletMoney > 0 && this.alipay == 0){
		  				this.alipay = 1
		  			}
		  			return
		  		}
	  		}
	  		this.flag = num
	  		this.purse = purse
	  		//document.body.style.position = 'fixed'
	  	},
	  	// 验证码弹框取消是支付状况保持支付状态
	  	keepStatus () {
	  		this.wallet = 0
	  		this.integral = 0
	  		this.alipay = 0
	  	},
	  	// PC支付宝扫码支付
	  	Sweep () {
	  		if (this.alipay === 0) {
	  			return
	  		}
	  		//alert('支付宝扫码支付')
	  	},
	  	// 支持的支付方式
	  	SupportPayments (num, num2) {
	  		let item = this.Data.SupportPayments
	  		
	  		for (let i = 0; i < item.length; i++) {
	  			let itemCode = item[i].PayWayCode
	  			if (this.isPC() && num === itemCode) { // PC支付宝显示
	  				return true
	  			} else if (!this.isPC() && num2 === itemCode) { // H5支付宝显示
	  				return true
	  			} else if (!this.isPC() && num === itemCode) { // 	H5微信显示
	  				return true
	  			} else if (num === itemCode) {
	  				return true 
	  			}
	  		}
	  	},
	  	// 支付请求
	  	fetchData: async function () {
	  		this.clickFlag = false
			let itemAdd = this.floatTool.add(this.walletMoney,this.integralToMoney); 
			this.totalMoney = this.floatTool.subtract(this.Data.PayDetailInfo.TotalMoney,itemAdd)
			
			let obj = {
	  		    'code': this.payCode,
	  		    'WalletMoney': this.walletMoney, // 钱包支付金额
	  		    'IntegralMoney': this.balance == 1 ?this.Data.PayDetailInfo.IntegralMoney:this.integralMoney, // 积分支付金额
	  		    'SmsCode': this.msgCode, // 手机验证码
	  		    'OnlinePayMoney': this.totalMoney, // 在线支付金额
	  		    'OnlinePayType': this.linePay, // 在线支付方式
	  		    'CarbonScore':this.Data.PayDetailInfo.CarbonScore,//碳积分
				}
				
			  let params = obj
			  const res = await this.$root.http.post('/mvc/pay/SubPayInfos', params,this)
			  if (res.data.Flag === 0) {
			      this.$root.bool = true
				  this.prom = res.data.Msg
				  this.clickFlag = true
			  }else if (res.data.Flag === 1 ){// 跳转成功页
		  	     //this.setCookie('CashierInfoId',res.data.Data)
		  	     this.$router.push({path: '/success',query:{'orderNo':res.data.Data}})
	  	  	  } else if (res.data.Flag === 2 ){// 支付宝支付
			  	if(this.linePay === '08'){//支付宝扫码支付
			  		this.hrefMask = true
			  		this.alipayHref = this.$root.publicPath + '/mvc/Pay/gopay?paypalId=' + res.data.Data.PaypalId
			  	}else {
			  		if(this.is_weixn()){
			  		 	window.location.href = this.$root.publicPath + '/pages/index.html#/browser?obj=' + JSON.stringify(res.data.Data)
			  		 	return;
			  		 }else{
			  		 	window.location.href = this.$root.publicPath + '/mvc/Pay/gopay?paypalId=' + res.data.Data.PaypalId
			  		 }
			  		 
			  	} 
			  } else if (res.data.Flag === 5 ){
			  	
				this.setCookie('PayMoney',res.data.Data.OnlinePayMoney) // 银联支付总金额
				this.setCookie('PaypalId',res.data.Data.PaypalId) // 银联ID
				this.setCookie('CashierInfoId',res.data.Data.CashierInfoId) // 银联订单尾号
				// this.setCookie('orderId',res.data.Data.CashierInfoId)
				this.$router.push({path: '/bank'})
			  }else if (res.data.Flag === 6){//微信支付
				window.location.href = res.data.Data
			  }else if (res.data.Flag === 7){//挂房账
				this.$router.push({path: '/identity',query:{'UserCardNo':res.data.Data.UserCardNo,'PaypalId':res.data.Data.PaypalId}})
			  }
			  
			  //this.clickFlag = true
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
	    // 支付宝扫码支付浮层隐藏
	    herfHide() {
	    	this.hrefMask = false;
	    	if(this.wallet === 1 || this.integral === 2){
	    	 	 this.$root.eventHub.$emit('reFlash')
	    	}
	    },
	    fnModal(){
	    	this.modal_h5 = false;
	    	if(this.wallet === 1 || this.integral === 2){
	    	 	this.$root.eventHub.$emit('reFlash')
	    	}
	    },
	    //点击icon 显示比例弹框
	    iconInfo(){
	    	if(this.isPC()){
		      this.$root.bool = true
			  this.prom = ''
			  this.clickFlag = true;
			  this.modal_PC = true;
			  return;
	    	}else{
	    		this.modal_h5 = true
	    	}
	      
	    },
	    fn08(str){
		    if(this.linePay === '08'){
		    	this.hrefMask = true
		    	this.alipayHref = str
	    	}
	    },
	    successImg(){
	    	if(!this.isPC()){
	    		this.scrollBar();
	    	}
	    }
	  },
	  components: {
	  	'v-integral': Integral,
	  	'v-code': Code,
	  	'v-modal': Modal,
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.payment_wrapper
		.payment
			.payment_h5
				padding:0px 0px 0px
				background:#fff
				position:relative
				overflow-x:hidden
				overflow-y:scroll
				.li_h5
					padding:10px 18px 10px 15px
					border-bottom: 1px solid #EBEBEB
					position:relative
					cursor:pointer
					&.active
						background:#FAFAFA
					.gray
						position:absolute
						top:0px
						left:0px
						width:100%
						height:100%
						z-index:5
						background:rgba(250,250,250,0.6)
					.light
						position:absolute
						top:0px
						left:0px
						width:100%
						height:100%
						z-index:5
						background:rgba(250,250,250,0)
					.left
						height:40px
						.iconfont
							display:inline-block
							font-size:40px
							margin-right:12px
						.icon-qianbao
							color:#90704d
						.icon-jifen
							color:#c0191f
						.icon-zhifubao
							color:#1aaceb
						.icon-weixin
							color:#08ba08
						.icon-yinlian
							color:#08ba08
						.icon-tanjifen
							color:#BAE265
						.icon-guafangzhang
							color:#CDA048
						.h5png
							margin-right:20px
							width:35px
							height:35px
							background-size:35px 35px
							position:relative
							left:3px
							top:3px
						.pay_way
							margin-top:2px
							.p1
								font-size: 15px
								color: #535353
								line-height:21px
								.icon-tishi
									color:#BA9765
									font-size:16px
							.pt
								position:relative
								top:-10px
							.picon
								position:relative
								left:-2px
							.p2
								font-size: 12px
								color: #979797
								line-height:15px
								span
									display:inline-block
									font-size: 12px
									color: #979797
									line-height:15px
							
							.sweep_code
								display:inline-block
								width:24px
								height:26px
								padding:5px 6px  
								background:rgba(0,169,241,1)
								border-radius: 3px  
								font-size:12px
								line-height:13px
								color:#fff
								position:relative
								top:-7px
						.pay_way_h
							margin-top:5px
					.right
						.pay
							font-size: 15px
							color: #535353
							margin-right:20px
							text-align:right
							margin-top:12px
							span
								display:inline-block
								font-size: 15px
								color: #c0191f
								font-weight:700
							.sp1
								font-size: 15px
								color: #c0191f
								font-weight:700
							.sp2
								font-size: 12px
								color: #979797
								line-height:20px
								i
									font-style:normal
									font-size: 12px
									color: #c0191f
									font-weight:700
						.pay_h
							margin-top:5px
						.pay_ht
							margin-top:12px
						.iconfont
							display:inline-block
							margin-top:8px
							font-size:22px
						.icon-danxuanweixuanzhong
							color:#D3D3D3
						.icon-danxuan
							color:#af1521
						.icon-duoxuanweixuanzhong
							color:#D3D3D3
						.icon-duoxuan
							color:#C0191F

					.opacity
						position:absolute
						left:0px
						right:0px
						height:100%
						opacity:0
				.split
					width:100%
					height:5px
					background:#EBEBEB
				.ul_two
					li
						padding:10px 18px 10px 15px
						.left
							.pay_way
								margin-top:9px
								.pt
									position:relative
									top:-10px
									width:auto
									margin-right:10px
							.pay_way_identify
								margin-top:2px
				.footer
					position:fixed
					margin-top:30px
					bottom:0px
					width:100%
					.spanBox
						background:rgba(0,0,0,0.6)
						width:20px
						height:20px
						border-radius:100% 100%
						position:absolute
						top:10px
						right:10px 
						.icon-PCclose
							position:relative
							top:0px
							left:4px
							font-size:12px
							color:#d4d4d4
					img
						width:100%
						display:block
					.paymentBtn
						display:inline-block 
						text-align:center
						width:100%
						height:50px
						line-height:50px
						background: #D4D4D4
						font-size: 18px
						color: #FFFFFF
						border:none
						outline:none
						&.active
							background: #CA101A
											
							
			// PC样式
			.payment_PC
				padding:30px 40px 0px
				position:relative
				overflow:hidden
				.li_h5
					padding:10px 22px 10px 10px
					position:relative
					&.active
						background:#F7F7F7
					.left
						height:40px
						.iconfont
							margin-right:13px
						.PCpng
							margin-right:20px
							width:35px
							height:35px
							background-size:35px 35px
							position:relative
							left:4px
							top:3px
						.pay_way
							p
								display:inline-block
							.p1
								margin-top:7px
								width:72px
								margin-right:30px
								font-size: 18px
							.p2
								font-size: 14px
								span
									font-size:14px
							.icon-tishi
								color:#BA9765
								font-size:16px
								position:relative
								top:2px
						.pay_way_pc
							margin-top:-1px
							.p1
								font-size:15px
								color:#535353
								line-height:21px
								width:200px
							.p2
								font-size:12px
								color:#979797
								line-height:16px
								width:200px
								display:block
					.right
						.pay
							margin-top:10px
							font-size: 18px
							margin-right:20px
							span
								font-size: 18px
							.sp1
								font-size:18px
						.pay_h
							margin-top:0px
							.sp2
								line-height:17px
						.pay_ht
							margin-top:10px
						.iconfont
							margin-top:10px
							font-size:20px
							cursor:pointer

				.ul_two
					li
						padding:10px 22px 10px 10px
						cursor:pointer
						.left
							.pay_way 
								.p1
									margin-top:0px
							.pay_way_identify
								margin-top:9px
				.footer
					position:relative
					bottom:0px
					width:0px
					min-width:1000px
					max-width:1200px
					background:#fff
					height:150px
					margin-left:-40px
					padding:35px 0px 0px
					margin-top:28px
					img
						position:absolute
						right:40px
						top:0px
						width:600px
					.paymentBtn
						display:inline-block
						text-align:center
						position:absolute
						left:40px
						bottom:90px
						width:238px
						border-radius: 58px
						font-size: 20px
						color: #FFFFFF
						background:#D3D3D3
						cursor:pointer
						&:hover
							background:#CD474C
							transition: all .3s ease
		.modal-pc
			overflow:hidden			
			width:359px
			height:352px
			position:fixed
			left:50%
			top:50%
			padding-top:20px
			background:#fff
			margin-left:-180px
			margin-top:-191px
			z-index:20
			.alert-Alipay
				background:#fff
				margin-top:0px
				.icon-close
					font-size:12px
					font-weight:bold
					color:#90704D
					position:absolute
					right:16px
					top:16px 
					z-index:50
					cursor:pointer
			.text_box
				margin-top:290px
				.h1
					font-size: 14px
				    line-height: 19px
				    color: #535353
				    text-align: center
				    font-weight: normal
				h2
					a
						color: #90704D
		.modal_h55
			position:fixed
			left:50%
			top:50%
			transform:translate(-50%,-50%)
			background:#fff
			width:300px
			background:rgba(255,255,255,1)
			border-radius: 25px
			text-align:center
			padding:17px 0px
			z-index:20
			.msgSpan
				color:#535353
				font-size:14px
				line-height:17px
				.color
					color:#C0191F
					font-size:14px
		.mask
			position:fixed
			top:0px
			left:0px
			right:0px
			bottom:0px
			z-index:10
			background: rgba(0,0,0,0.30)
			filter:blur(10px)
</style>