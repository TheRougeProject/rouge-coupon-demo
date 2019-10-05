<template>

  <main>

    <Loading />

    <div v-if="web3Error" class="da_board web3Error">
      <div class="overview">
        <div class="create_page">
          <h4>You need to be connected to a compatible Ethereum wallet to use <b>The Coupon Demo</b></h4>
          <p>{{ web3Error }}</p>
          <nuxt-link class="btn df1" to="/">HELP</nuxt-link>
        </div>
      </div>
    </div>

    <div v-else class="dashboard clearfix">

      <div class="moblile_v">
        <h2>CREATE A CAMPAIGN</h2>
      </div>

      <div class="left">

        <div class="create_page">

          <div v-if="success" class="c_page">
            <h2>Create and Issue Coupons</h2>
            <h4>{{ message }}</h4>
            <nuxt-link class="btn df1" to="/dashboard">BACK TO DASHBOARD</nuxt-link>
          </div>

          <div v-else class="c_page">
            <h2>Create and Issue Coupons</h2>
            <p>
              A campaign is one smart contract and it manages a set of
              coupons with the same characteristics. This 3rd version
              of The Coupon Demo ÐApp intend to ilustrate the worflow
              of the Rouge coupons with smart contracts, from their
              creation to their possible redemption. The expiration
              date of a campaign in this demo is 2 weeks after
              creation.
            </p>
            <p>
              To create a campaign, you need to deposit at least <b>n</b> times 0.1 RGE tokens, <b>n</b> being the number of the coupons (issuance) of the campaign.
            </p>
            <p class="pragraph">
              <span v-if="rgeBalance < 0.1">
                You don't have enough RGE tokens (0.1 RGE minimum per coupon) at your account {{ account }} to create a campaign.
                <span v-if="$eth.isTestNetwork">
                  Please visit our <a target="_blank" href="http://faucet.rouge.network/">faucet</a> to get RGE tokens for the Ropsten or POA Sokol testnet networks.
                </span>
              </span>
            </p>
            <h4>COUPON CAMPAIGN PARAMETERS</h4>

            <p>You have now {{ tokenformat(rgeBalance) }} RGE tokens.</p>

            <div class="form">
              <div class="field">
                <label for="name">Name</label>
                <input v-model.trim="name" type="text" name="name" placeholder="Campaign name">
              </div>
              <div class="field">
                <label for="issuance">Coupons issuance</label>
                <input v-model.number="issuance" type="number" name="issuance" placeholder="issuance (number of coupons in the campaign)" min="1" max="5">
              </div>
              <div class="field">
                <label for="deposit">RGE tokens deposit</label>
                <input v-model.number="deposit" type="number" name="deposit" placeholder="deposit (0.1 * issuance minimum)" :min="0.1 * issuance" step="0.1">
              </div>
              <p>
                IMPORTANT NOTE: The create button will submit two
                successive transactions to your connected Ethereum network:
                the first one to create the contract representing the
                campaign and the second to issue all the coupons.
              </p>

              <div class="righta">
                <div>
                  <!--  <a href="#">VIEW CAMPAIGN</a><br> XXX -->
                  <span><a href="#" class="btn df1" @click="createCampaign()">CREATE A NEW CAMPAIGN</a></span>
                </div>
              </div>
            </div>
            <p class="warning">{{ message }}</p>

          </div>
        </div>

      </div>

      <SideBar v-if="!web3Error" :createmode="false" />

    </div>
  </main>

</template>

<script>

import { mapGetters } from 'vuex'

import Loading from '~/components/Loading.vue'
import SideBar from '~/components/SideBar.vue'

import { RougeProtocol } from 'rouge.js'

export default {
  components: {
    Loading, SideBar
  },
  data () {
    return {
      message: '',
      name: '',
      issuance: null,
      deposit: null,
      success: null,
      debug: ''
    }
  },
  computed: {
    ...mapGetters([ 'web3Error', 'account', 'scheme', 'web3Version', 'attestor', 'rgeBalance' ]),
  },
  mounted () {
    this.$store.dispatch('init', this.$eth)
  },
  methods: {
    tokenformat: function (n) {
      if (n === null) {
        return '?'
      }
      const d = 2
      return parseInt(n/1000000).toFixed(d).replace(/./g, function (c, i, a) {
        return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c
      })
    },
    createCampaign: async function () {
      // e.preventDefault()
      this.message = ''
      if (!this.$eth.selectedAddress) {
        this.message = 'No connected account!'
        return false
      }
      if (!this.name) {
        this.message = 'Please enter the coupon name'
        return false
      }
      if (!this.issuance || this.issuance < 1 || this.issuance > 5) {
        this.message = 'Issuance should be between 1 and 5'
        return false
      }
      const min = this.issuance * 0.1
      if (!this.deposit || this.deposit < min) {
        this.message = `With an issuance of ${this.issuance} coupon(s), RGE deposit should be at least ${min}`
        return false
      }
      this.$children[0].start()
      try {
        const params = {
          scheme: this.scheme, // only demo scheme
          issuance: this.issuance,
          tokens: this.deposit * 10 ** 6,
          name: this.name,
          expiration: Math.trunc((new Date()).getTime() / 1000) + 60 * 60 * 24 * 7, // 7 days
          attestor: this.attestor,
          auths: [ RougeProtocol.AUTH$.Acquisition, RougeProtocol.AUTH$.Redemption ]
        }
        const campaign = await this.$store.dispatch('createCampaign', params)

        this.$children[0].finish()
        this.message = `Congrats! Campaign created and ${this.issuance} coupon(s) issued at address ${await campaign.address}...`
        this.success = 1
        this.$store.dispatch('load_campaign', await campaign.address)
      } catch (e) {
        this.message = e
      }
    }
  }
}
</script>

<style lang="postcss">

.c_page {

  h3 {
    color: #fff;
  }

}

.field {

  margin-bottom: 1em;

  label {
    color: #fff;
    width: 250px;
    padding-top: 0.8vw;
    margin-bottom: 0.8vw;
    display: block;
    float: left;
  }
}

</style>
