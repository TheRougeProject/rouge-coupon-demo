<template>
  <main>
    <div class="pad">
      <div class="home_page">
        <div class="container">
          <div class="content1 clearfix">
            <div class="left">
              <div class="logo"><a href="#"><img src="/images/logo-coupon@2x.png" alt="couponlogo"></a></div>
              <h1>Secure your coupon with<br> the blockchain</h1>
              <div class="pragraph">
                <p><a target="_blank" href="https://rouge.network/">The Rouge protocol</a> is an open-source blockchain voucher and note protocol.</p>
                <p><b>The Coupon Demo</b> ÐApp is using the protocol and the library <a target="_blank" href="https://www.npmjs.com/package/rouge.js">rouge.js</a> to illustrate the use-case of coupons.</p>
              </div>
            </div>
            <div class="right">
              <div class="content">
                <h3>Disclaimer</h3>
                <h6>
                  <b>The Coupon Demo</b> is — as the name suggests — a demonstration of the coupon
                  workflow and concepts developed in the Rouge Project white paper.
                  <span :class="{ warning: $eth.isConnected && !$eth.isTestNetwork }">
                    It is recommended to connect it to a TEST
                    blockchain (Ethereum Ropsten or POA Sokol).  This
                    ÐApp is just a demo software and THERE IS NO
                    WARRANTY OF ANY KIND (you may lose all ETH, RGE or any
                    tokens involved).
                  </span>
                </h6>
              </div>
            </div>
          </div>
          <div class="content2 clearfix">
            <div class="left">

              <h6>Wallet* detected: <span v-if="$eth.isConnected">{{ $eth.walletType }}</span><span v-else class="warning">None</span></h6>
              <h6 v-if="$eth.isConnected">Ethereum network found: {{ $eth.networkName }}</h6>
              <h6 v-if="$eth.isConnected">
                <span v-if="$eth.selectedAddress">Logged in with
                  <a target="_blank" :href="$eth.explorer('address', $eth.selectedAddress)">{{ $eth.selectedAddress }}</a>
                </span>
                <span v-else class="warning">Not logged in</span>
              </h6>
              <h6>RougeFactory contract found:
                <span v-if="factoryAddress">Yes (<a target="_blank" :href="$eth.explorer('address', factoryAddress)">{{ factoryAddress }}</a>)
                </span>
                <span v-else class="warning">NO</span>
              </h6>
              <h6 v-if="rougeVersion">Protocol/Factory version: <span>{{ rougeVersion }}</span></h6>

              <div v-if="!$eth.walletType" class="demo_btn">
                <a target="_blank" href="https://metamask.io/" class="btn">GET METAMASK (Desktop) *</a><b> Or</b>
                <a target="_blank" href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid" class="btn">GET NIFTY (Desktop) *</a><b> Or</b>
                <a target="_blank" href="https://trustwalletapp.com/" class="btn">GET TRUST (Mobile) *</a>
              </div>
              <div v-else class="demo_btn">
                <span v-if="web3Error">
                  <a href="#" class="btn">{{ web3Error }}</a>
                </span>
                <span v-else>
                  <nuxt-link class="btn df1" to="/dashboard">START DEMO</nuxt-link>
                </span>
              </div>

              <h6>* Tested with <a target="_blank" href="https://metamask.io/">MetaMask</a>, <a target="_blank" href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid">Nifty</a> and <a target="_blank" href="https://trustwalletapp.com/">Trust</a></h6>
              <h6>* Please contact us if you want to use this demo using <a target="_blank" href="https://github.com/ethereumjs/testrpc">testrpc</a> or <a href="https://github.com/ethereum/go-ethereum/wiki/geth">geth</a></h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

</template>

<script>

import { mapGetters } from 'vuex'

export default {
  layout: 'home',
  computed: {
    ...mapGetters([ 'web3Error', 'rougeVersion', 'factoryAddress' ])
  },
  mounted () {
    this.$store.dispatch('init', this.$eth)
  },
  methods: {
    goToRoute: function (p) {
      this.$router.push({path: p})
    }
  }
}

</script>

<style lang="postcss">

.warning {
  background-color: #990000;
}

</style>
