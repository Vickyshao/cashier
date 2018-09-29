<template>
	<div class="classifyPC_wrapper">
		<div class="classifyPC">
			<div class="main fix">
				<ul class="nav fl" ref="nav">
					<li :class="{'active':cur === 0}" @click="select(0,$event)">
						<span id="spa">全部支付方式</span><i class="iconfont" :class="{'icon-down-arrow' :cur !== 0, 'icon-top-arrow' : cur === 0}"></i>
					</li>
					<li :class="{'active':cur === 1}" @click="select(1,$event)">
						<span id="spb">全部分类</span><i class="iconfont" :class="{'icon-down-arrow' :cur !== 1, 'icon-top-arrow' : cur === 1}"></i>
					</li>
					<li :class="{'active':cur === 2}" @click="select(2,$event)">
						<span id="spc">全部状态</span><i class="iconfont" :class="{'icon-down-arrow' :cur !== 2, 'icon-top-arrow' : cur === 2}"></i>
					</li>
				</ul>
				<div class="select_time fr" @click="dateFlag($event)">
					<i class="iconfont icon-time"></i><span>筛选时间</span>
				</div>	
				<div class="search fr">
					<input type="text" placeholder="要搜索的内容" v-model="wordVal">
					<span class="iconfont icon-search" @click="searchWrod()"></span>
					<button v-if="false">搜索</button>
				</div>
							
			</div>
			<div class="selected" v-if="navHide">
				<h3 v-if="false">{{text}}</h3>
				<ul id="ul">
					<li v-for="(item, index) in itemArr" @click="search(1,item.Code,$event,index)" >{{item.Name}}</li>
				</ul>
			</div>
			
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
	  name: 'classifyPC_wrapper',
	  data () {
	  	return {
	  		allPay: [],
	  		allClass: [],
	  		allStatus: [],
	  		itemArr: [],
	  		cur: null,
	  		text: '全部支付方式',
	  		val: '',
	  		wordVal: null, // 模糊查询关键字
	  		item: null, // 临时存储数据
	  		navHide: false, //pc头部导航默认隐藏 
	  		arra: 0,
	  		arrb: 0,
	  		arrc:0,
	  		arrd:0
	  	}
	  },
	  created () {
	  	 this.$root.eventHub.$on('classData', this.arg)
	  },
	  methods: {
	  	// 显示当前选择内容
	    select (num,event) {
	       this.navHide = true 
	       if(this.isPC()){
	  	       if (num === 0) {
	  	       	   	 this.itemArr = this.allPay
	  	       	   	 this.$nextTick(function(){
	  	       	   	 	aaa(this.arra)
	  	       	   	 }) 
	   			} else if (num === 1) {
	   			   this.itemArr = this.allClass
	   			    this.$nextTick(function(){
	   			   		aaa(this.arrb)
	   			   }) 
	   			} else if (num === 2) {
	   			   this.itemArr = this.allStatus
	   			   this.$nextTick(function(){
	   			   		aaa(this.arrc)
	   			   }) 
	   			}
	   			this.cur = num
	   			if(event.target.parentNode.className === 'active'){
	  	       	 event.target.parentNode.className = ''
	  	       	 this.navHide = false
	  	       	 this.cur = null
	  	       }
	   			let This = this
	   			function aaa(arg){
	  		       	 let ul = document.getElementById('ul')
	  		       	 let aLi = ul.children
	  		       	 for(let i=0;i<aLi.length;i++){
	  		       	 	aLi[i].className = ''
	  		       	 	aLi[i].style.color = '#2F2E2E'
	  		       	 	aLi[arg].style.color = ''
	  		       	 	aLi[arg].className = 'gray'
	  		       	 	if(i !== arg){
	  		       	 		if (This.cur === 0) {
	  		       	 			aLi[This.arra].className = 'gray'
	  		       	 		} else if (This.cur === 1) {
	  		       	 		  aLi[This.arrb].className = 'gray'
	  		       	 		} else if (This.cur === 2) {
	  		       	 			aLi[This.arrc].className = 'gray'
	  		       	 		}
	  		       	 		aLi[i].onmouseover = function(){
	  		       	 			if(this.className !== 'gray'){
	  	  	       	 				this.style.color = '#C0191F'
	  	  	       	 				this.style.cursor ="pointer"
	  	  	       	 			}
	  		       	 		}
	  		       	 		aLi[i].onmouseout = function(){
	  		       	 			if(this.className === 'gray'){
	  	  	       	 				this.style.color = '#D3D3D3'
	  	  	       	 				this.style.cursor ="auto"
	  	  	       	 			}else {
	  	  	       	 				this.style.color = '#2F2E2E'
	  	  	       	 				this.style.cursor ="auto"
	  	  	       	 			}
	  		       	 		}
	  		       	 	}
	  		       	 }  
	  	 		}
	       }   
	    },
	  	arg (arg) {
          this.allPay = arg.PaymentMethods
          this.allClass = arg.PaymentType
          this.allStatus = arg.PaymentStates 
          this.itemArr = this.allPay 
	    },
	  	search (index, Code, event,iNow) {
	  	  if(this.isPC()){
		  	 	if (this.cur === 0) {
		  	 	   this.arra = iNow
		  	 	   this.arrd = iNow
		  	 	} else if (this.cur === 1) {
		  	 	   this.arrb = iNow
		  	 	   this.arrd = iNow
		  	 	} else if (this.cur === 2) {
		  	 		this.arrc = iNow
		  	 		this.arrd = iNow
		  	 	}

		  	  this.$nextTick(function(){
	  	       	 let ul = document.getElementById('ul')
	  	       	 let aLi = ul.children
	  	       	 
		 	  	  if (this.cur === 0){
		             document.getElementById('spa').innerHTML = event.target.innerHTML
		             
		           } else if (this.cur === 1) {
		             document.getElementById('spb').innerHTML = event.target.innerHTML
		                    
		           } else if (this.cur === 2) {
		             document.getElementById('spc').innerHTML = event.target.innerHTML
		           }

	  	       	 for(let i=0;i<aLi.length;i++){
	  	       	 	aLi[i].className = ''
	  	       	 	aLi[i].style.color = '#2F2E2E'
	  	       	 	aLi[this.arrd].className = 'gray'
	  	       	 	if(i !== this.arrd){
	  	       	 		if (this.cur === 0) {
	  	       	 			aLi[this.arra].className = 'gray'
	  	       	 		} else if (this.cur === 1) {
	  	       	 		  aLi[this.arrb].className = 'gray'
	  	       	 		} else if (this.cur === 2) {
	  	       	 			aLi[this.arrc].className = 'gray'
	  	       	 		}

	  	       	 		aLi[i].onmouseover = function(){
	  	       	 			if(this.className !== 'gray'){
	  	       	 				this.style.color = '#C0191F'
	  	       	 				this.style.cursor ="pointer"
		       	 				//this.style.fontWeight = 'bold'
		       	 				//this.style.transform = 'scale(1.2)'
	  	       	 			}
	  	       	 		}
	  	       	 		aLi[i].onmouseout = function(){
	  	       	 			if(this.className === 'gray'){
	  	       	 				this.style.color = '#D3D3D3'
	  	       	 				this.style.cursor ="auto"
	  	       	 				//this.style.transform = 'scale(1)'
	  	       	 				//this.style.fontWeight = 'normal'
	  	       	 			}else {
	  	       	 				this.style.cursor ="auto"
	  	       	 				this.style.color = '#2F2E2E'
	  	       	 				//this.style.fontWeight = 'normal'
	  	       	 				//this.style.transform = 'scale(1)'
	  	       	 			}
	  	       	 			
	  	       	 		}

	  	       	 	}	
	  	       	 }
	  	       	 aLi[iNow].style.color="#D3D3D3"
	  	       	 this.$root.eventHub.$emit('searcha', index, Code, this.cur)
	  	       })  
	          
	          //this.cur = null
	  	  }     	  	  
	  	},
	  	// 日期控件显示
	  	dateFlag (event) {
	  		this.$root.eventHub.$emit('dateFlag', true)
	  	},
	  	// 模糊查询
	  	searchWrod () {
	  		if (this.wordVal === this.item) {
	  			return 
	  		}
	  		this.item = this.wordVal
	  		this.$root.eventHub.$emit('keyWord', 1, '', '', this.wordVal)
	  	}
	  }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
#app
	.active
		max-width:100%
	.classifyPC_wrapper
		.classifyPC
			border-top:1px solid #EBEBEB
			border-bottom:1px solid #EBEBEB
			.main
				//padding-right:23px
				padding:0px 17px
				max-width:1000px
				min-width:1000px
				margin:0 auto

				.nav
					li
						display:inline-block
						padding:0px 17px
						margin-right:42px
						height:46px
						cursor:pointer
						span
							display:inline-block
							font-size: 16px
							color: #2F2E2E
							margin-right:11px
							line-height:46px
						i
							display:inline-block
							font-size:10px
							color:#C4A958
						&:last-child
							margin-right:0px
						&.active
							background: #F8F8F8
				.search
					width:216px
					margin-right:7px
					margin-top:8px
					background: #F8F8F8
					border-radius: 29px
					text-align:right
					padding:5px 20px 5px 14px
					.icon-search
						font-size:20px
						cursor:pointer
						color:#BA9765
						position:relative
						left:10px
					input
						font-size: 14px
						color: #535353
						outline:none
						background: #F9F9F9
						padding:0px 8px
						float:left
						margin-top:2px
					button
						outline:none
						font-size: 16px
						color: #BA9765
						line-height:35px
						border:none
						background: #F9F9F9
						cursor:pointer
				.select_time
					width:110px
					text-align:right
					cursor:pointer
					padding-right:17px
					position:relative
					top:-1px
					i
						display:inline-block
						font-size:20px
						margin-right:9px
						line-height:46px
						position:relative
						top:2px
						color:#BA9765
					span
						display:inline-block
						font-size: 16px
						color: #2F2E2E
						line-height:46px
			.selected
				background: #F9F9F9
				position:relative
				top:-1px
				h3
					font-size: 16px
					color: #D4D4D4
					line-height:44px
				ul
					padding-left:30px
					max-width:970px
					min-width:970px
					margin:0 auto
					li
						display:inline-block
						font-size: 16px
						color: #2F2E2E
						
						line-height:44px
						margin-right:74px
						&.gray
							color:#D3D3D3
					li:last-child
						margin-right:0px
						
			


</style>