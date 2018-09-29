<template>
	<div class="order_wrapper" id="order_wrapper">
		<div class="order_h5" :class="{'order_PC':isPC()}">
			<!--移动头部内容-->
			<v-checkstand :title='title' :show='true' :userName = 'userName' :IsAnonymous= 0 ></v-checkstand>
			<!--PC分类搜索组件-->
			<v-classifypc v-show="isPC()" :dataArr="dataArr" ></v-classifypc>
			<!--移动端搜索内容-->
			<v-select :selectShow="selectShow"></v-select>
			<!--H5分类搜索组件-->
			<v-classifyH5 v-show="!isPC()"></v-classifyH5>
			<!--公共错误弹框-->
			<v-modal :prom="prom"></v-modal>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	import CheckStand from '@/components/checkstand/CheckStand'
	import Select from '@/components/select/Select'
	import ClassifyPC from '@/components/classifyPC/ClassifyPC'
	import ClassifyH5 from '@/components/classifyH5/ClassifyH5'
	import Modal from '@/components/modal/Modal'
	export default {
	  name: 'order_wrapper',
	  data () {
	  	return {
	  		title: '订单',
	  		selectShow: true,
	  		dataArr: {'name': '123'},
	  		prom: null, // 错误提示信息
	  		userName:''
	  	}
	  },
	  created () {
	  	this.$root.loading = true
	  	this.fetchData()
	  	this.userInfo()
	  },
	  mounted () {
	  	document.getElementById('app').className = ''
	  	//let order = document.getElementsByClassName('order_wrapper')[0]
	  	//if(order.offsetHeight  < window.screen.availHeight){
	  	//	order.style.height = (window.screen.availHeight -55) + 'px'
	  	//}
	  	this.$nextTick(function(){
	  	  //console.log(document.getElementById('app'))
	  	  //console.log(document.getElementById('app').offsetHeight)
	  	})
	  	
	  },
	  methods:{
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
		  	userInfo: async function () {
		  	  let params = {
		  	  }
		  	  const res = await this.$root.http.post('/mvc/user/GetCurUserInfo', params,this)
		  	  if (res.data.Flag === 1) {
		  	       this.userName = res.data.Data.UserName
		  	  } else if (res.data.Flag === 0 ){
		  	     this.$root.bool = true
		  	     this.prom = res.data.Msg
		  	  }
		  	}
	  },
	  components: {
	  	'v-checkstand': CheckStand,
	  	'v-select': Select,
	  	'v-classifypc': ClassifyPC,
	  	'v-classifyH5': ClassifyH5,
	  	'v-modal': Modal
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>

</style>