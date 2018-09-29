<template>
  <div class="main" id="main">
    <v-checkstand :title='title' :Data="Data" :show="true" :userName = 'userName' :IsAnonymous = 'IsAnonymous' :HeadDiv = "HeadDiv"></v-checkstand>
    <div class="box-shadow" :class="{'highlight':isPC()}">
        <v-pay :Data="Data"></v-pay>
        <v-payment :Data="Data" :payCode = "arg"></v-payment>
    </div>
    <!--<v-copyright></v-copyright>-->
    <v-modal :prom="prom"></v-modal>
  </div>
</template>
<script type="text/ecmascript-6">
import CheckStand from '@/components/checkstand/CheckStand'
import Pay from '@/components/pay/Pay'
import Payment from '@/components/payment/Payment'
import Copyright from '@/components/copyright/Copyright'
import Modal from '@/components/modal/Modal'
export default {
  name: 'maina',
  data () {
    return {
      title: '首旅如家收银台',
      Data: {},
      arg: 'test',
      prom: null, // 错误提示信息
      userName: null,
      IsAnonymous:null, //1 表示散客  0表示正常用户
      HeadDiv:0
    }
  },
  created () {
    if (this.$route.query.code) {
      this.arg = this.$route.query.code
    };
    this.$root.eventHub.$on('reFlash',this.fetchData)
  },
  computed:{

  },
  mounted () {
   this.$root.loading = true
    if (window.location.search) {
      this.arg = this.getQueryString('code')
    }
    this.fetchData();
  },
  methods: {
    getQueryString (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
        let r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
     },
     fetchData: async function () {
       let params = {
          'code': this.arg
       }
       const res = await this.$root.http.post('/mvc/pay/QueryPayInfos', params,this)
       if (res.data.Flag === 1) {
            this.Data = res.data.Data;
            this.userName = this.Data.CustomerAccount.UserName
            this.setCookie('WalletMoney',this.Data.CustomerAccount.WalletMoney)
            this.setCookie('IsAnonymous',this.Data.PayDetailInfo.IsAnonymous)
            this.IsAnonymous = this.Data.PayDetailInfo.IsAnonymous //
            this.setCookie('IsHideHeadDiv',this.Data.PayDetailInfo.IsHideHeadDiv)
            this.HeadDiv = this.Data.PayDetailInfo.IsHideHeadDiv
       } else if (res.data.Flag === 0 ){
          this.$root.bool = true
          this.prom = res.data.Msg
       }
     }
  },
  components: {
    'v-checkstand': CheckStand,
    'v-pay': Pay,
    'v-payment': Payment,
    'v-copyright': Copyright,
    'v-modal': Modal
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>

</style>
