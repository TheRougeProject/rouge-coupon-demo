
<template>

  <div class="right color">
    <div class="wellcome">
      <h4>Connected to {{ $eth.networkName }}</h4>
      <h5>{{ account }}</h5>
      <div class="border">
        <div class="calculate_coupun clearfix">
          <p>My coupon(s)</p>
          <div class="left a">
            <h4>COUPONS <br>ACQUIRED</h4>
            <h3>{{ acquired.length }}</h3>
          </div>
          <div class="right a">
            <h4>COUPONS<br>REDEEMED</h4>
            <h3>{{ redeemed }}</h3>
          </div>
        </div>
      </div>
      <div class="border">
        <div class="campaning_create clearfix">
          <p>Stats about my campaign(s)</p>
          <div class="left same a">
            <h4>CAMPAIGNS <br>CREATED</h4>
            <h3>{{ myCampaigns.length }}</h3>
          </div>
          <div class="right same a">
            <h4>COUPONS<br>ISSUED</h4>
            <h3>{{ myIssuance }}</h3>
          </div>
          <div class="left same b">
            <h4>COUPONS <br>ACQUIRED</h4>
            <h3>{{ myIssuance - myFree }}</h3>
          </div>
          <div class="right same b">
            <h4>COUPONS<br>REDEEMED</h4>
            <h3>{{ myRedeemed }}</h3>
          </div>
        </div>
      </div>
      <div v-if="myCampaigns.length" class="dont_haveinner2">
        <div class="scroll">
          <table v-for="campaign in myCampaigns" :key="campaign.at" cellpadding="0" cellspacing="0">
            <tr>
              <td class="a">{{ campaign.name }}</td>
              <td class="b">{{ campaign.issuance }}</td>
              <td class="c">{{ campaign.issuance - campaign.free }}</td>
              <td class="d">{{ campaign.redeemed }}</td>
            </tr>
          </table>
        </div>
        <!--  <a href="#" class="btn df1">CREATE A CAMPAIGN</a> -->
      </div>
      <div v-else class="dont_have">
        <h4>You don’t have any campaigns yet.</h4>
        <p>A campaign is one smart contract and it manages a
          set of coupons with the same characteristics. This
          version of the DemoCoupon ÐApp
          intend to ilustrate the worflow of the Rouge
          coupons with smart contracts, from their creation
          to their possible redemption.
        </p>
        <div v-if="createmode">
          <nuxt-link class="btn df1" to="/create">CREATE A CAMPAIGN</nuxt-link>
        </div>
      </div>

    </div>
  </div>

</template>

<script>

import { mapGetters } from 'vuex'

export default {
  props: {
    createmode: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters([ 'web3Version', 'account', 'myCampaigns', 'myIssuance', 'myFree', 'myRedeemed', 'acquired', 'redeemed' ])
  }
}
</script>

<style>

</style>
