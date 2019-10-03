<template>

  <main>

    <div class="dashboard clearfix">

      <div v-if="web3Error" class="da_board web3Error">
        <div class="overview">
          <div class="create_page">
            <h4>You need to be connected to a compatible Ethereum wallet to use <b>The Coupon Demo</b></h4>
            <p class="pragraph">{{ web3Error }}</p>
            <nuxt-link class="btn df1" to="/">HELP</nuxt-link>
          </div>
        </div>
      </div>

      <div v-else class="left">

        <div class="moblile_v">
          <h4>DASHBOARD</h4>
          <p>Your Issuer N° is:</p>
          <h6>{{ account }}</h6>
        </div>

        <div class="da_board">
          <h4>OVERVIEW  <span v-if="transactLog" class="transact"> {{ transactLog }} </span></h4>
          <div class="overview clearfix">
            <div class="camn c1">
              <h4>ALL CAMPAIGNS CREATED</h4>
              <h3>{{ allCampaigns.length }}</h3>
            </div>
            <div class="camn c2">
              <h4>ALL COUPONS ISSUED</h4>
              <h3>{{ totalIssuance }}</h3>
            </div>
            <div class="camn c3">
              <h4>ALL COUPONS ACQUIRED</h4>
              <h3>{{ totalIssuance - totalFree }}</h3>
            </div>
            <div class="camn c4">
              <h4>ALL COUPONS REDEEMED</h4>
              <h3>{{ totalRedeemed }}</h3>
            </div>
          </div>

          <!--OVERVIEW :: END-->
          <div class="camp_coupon">
            <div class="campaaing clearfix" style="@media(max-width:639px){height: 600px}">
              <h4>CAMPAIGNS</h4>
              <div class="scrollbar style-2 cam_detail">
                <div class="scroll">
                  <div v-for="campaign in allCampaigns" :key="campaign.at" class="cham_det">
                    <table v-if="campaign.issued" cellpadding="0" cellspacing="0" :class="campaign.issuer === account ? 'bg_ch' : ''">
                      <tr>
                        <td class="a1"><a target="_blank" :href="$eth.explorer('address',campaign.at)">{{ campaign.name }}</a> {{ campaign.expired ? ' (expired)' : '' }}</td>
                        <td class="a2">{{ campaign.issuer === account ? 'My campaign' : 'Issued by:' }}</td>
                        <td class="a3"><a target="_blank" :href="$eth.explorer('address',campaign.issuer)">{{ campaign.issuer === account ? '' : campaign.issuer_pp }}</a></td>
                        <td class="a4">{{ campaign.issuance }}</td>
                        <td class="a5">{{ campaign.issuance - campaign.free }}</td>
                        <td class="a6">{{ campaign.redeemed }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="av_coupon">
              <h4>AVAILABLE COUPONS</h4>
              <div class="scrollbar style-2 avlable_cop">
                <div class="scroll">
                  <div v-for="coupon in coupons" :key="coupon.at" class="avlable_cop-det a">
                    <table v-if="coupon.issuer != account" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="cop1"><a target="_blank" :href="$eth.explorer('address', coupon.at)">{{ coupon.at_pp }}</a></td>
                        <td class="cop2">{{ coupon.name.substr(0,10) }}</td>
                        <td class="cop3">Issued by: </td>
                        <td class="cop4"><a target="_blank" :href="$eth.explorer('address', coupon.issuer)">{{ coupon.issuer_pp }}</a></td>
                        <td class="cop5"><a href="#" @click="acquireCoupon(coupon)">Acquire</a></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="acquired.length" class="av_coupon">
              <h4>MY ACQUIRED COUPONS</h4>
              <div class="scrollbar style-2 avlable_cop nm">
                <div class="scroll">
                  <div v-for="coupon in acquired" :key="coupon.at" class="avlable_cop-det b">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td :class="coupon.used ? 'cop1' : 'cop1 f'"><a target="_blank" :href="$eth.explorer('address', coupon.at)">{{ coupon.at_pp }}</a></td>
                        <td class="cop2">{{ coupon.name.substr(0,10) }}</td>
                        <td class="cop3">Issued by: </td>
                        <td class="cop4"><a target="_blank" :href="$eth.explorer('address', coupon.issuer)">{{ coupon.issuer_pp }}</a></td>
                        <td v-if="coupon.used" class="cop5 open_two open6 none"><a href="#">REDEEMED</a></td>
                        <td v-else class="cop5  open_one btn5"><a href="#" @click="redeemCoupon(coupon)">REDEEM</a></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <SideBar v-if="!web3Error" :createmode="true" />

    </div>
  </main>

</template>

<script>

import { mapGetters } from 'vuex'

import SideBar from '~/components/SideBar.vue'

import { authHashProtocolSig } from 'rouge.js'

const delay = t => new Promise(resolve => setTimeout(resolve, t))

export default {
  components: {
    SideBar
  },
  data () {
    return {
      transactLog: null,
      msg: [],
      message: null
    }
  },
  computed: {
    ...mapGetters([ 'web3Error', 'rouge', 'allCampaigns', 'totalIssuance', 'totalFree', 'totalRedeemed', 'coupons', 'acquired', 'redeemed', 'attestor', 'attestorPkey', 'account' ]),
  },
  mounted () {
    this.init()
  },
  methods: {
    init: async function () {
      await this.$store.dispatch('init', this.$eth)
    },
    acquireCoupon: async function (coupon) {
      this.message = ''
      this.msg = []
      try {
        if (!this.account || coupon.expired || coupon.has ) return false

        const sign = authHashProtocolSig('acceptAcquisition', coupon.at, this.account, '0x' + this.attestorPkey)
        const campaign = this.rouge.campaign$(coupon.at)

        if (!await campaign.as(this.attestor).canDistribute) {
          throw new Error('attestor is not authorized')
        }

        const receipt = await campaign.as(this.account).acquireNote(this.attestor, sign)
        this.transactLog = `tx ${receipt.transactionHash} succeeded`
      } catch (e) {
        this.transactLog = ''
        console.log(e)
        return
      }
      delay(2000) // could receive tx before call are updated ...
      this.$store.dispatch('load_campaign', coupon.at)
    },
    redeemCoupon: async function (coupon) {
      this.message = ''
      this.msg = []
      try {
        if (!this.account || coupon.expired || coupon.used ) return false
        console.log(this.account, coupon.at)
        const sign = authHashProtocolSig('acceptRedemption', coupon.at, this.account, '0x' + this.attestorPkey)
        const campaign = this.rouge.campaign$(coupon.at)

        if (!await campaign.as(this.attestor).canSignRedemption) {
          throw new Error('attestor is not authorized')
        }

        const receipt = await campaign.as(this.account).redeemNote(this.attestor, sign)
        this.transactLog = `tx ${receipt.transactionHash} succeeded`
      } catch (e) {
        this.transactLog = ''
        console.log(e)
        return
      }
      delay(2000) // could receive tx before call are updated ...
      this.$store.dispatch('load_campaign', coupon.at)
    }
  }
}
</script>

<style lang="postcss">


</style>
