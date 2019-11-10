
import Vue from 'vue'

import Web3 from 'web3'

export const state = () => ({
  versionSupported: '0.20',
  web3Error: null,
  // gasCreate: 5000778,
  // this is a demo, this is obviously not a recommended method
  attestor: '0x955d20aedce1227941b12fa27aa1c77af758e10c',
  attestorPkey: 'c81c5128f1051be82c1896906cb1e283e07ec99e8ff53c5d02ea78cf5e7cc790',
  scheme: '0x0201ff01',
  account: null,
  rougeVersion: null,
  factoryAddress: null,
  rgeBalance: null,
  campaigns: [],
  campaignData: {},
  coupons: [],
  acquired: [],
  redeemed: 0
})

export const mutations = {
  unshiftCampaigns (state, address) {
    if (!state.campaigns.includes(address)) state.campaigns.unshift(address)
  },
  setCampaignData (state, {address, data}) {
    Vue.set(state.campaignData, address, data) // reactive only using Vue.set
  },
  set_web3Error (state, web3Error) {
    state.web3Error = web3Error
  },
  set_rougeVersion (state, payload) {
    state.rougeVersion = payload
  },
  set_factoryAddress (state, payload) {
    state.factoryAddress = payload
  },
  set_account (state, payload) {
    state.account = payload
  },
  set_rgeBalance (state, balance) {
    state.rgeBalance = balance
  },
  reset_all (state) {
    state.web3Error = null
    state.campaigns = []
    state.campaignData = {}
    state.coupons = []
    state.acquired = []
    state.redeemed = 0
  },
}

export const getters = {
  scheme: state => state.scheme,
  web3Error: state => state.web3Error,
  attestor:  state => Web3.utils.toChecksumAddress(state.attestor),
  attestorPkey:  state => state.attestorPkey,
  rougeVersion: state => state.rougeVersion,
  factoryAddress: state => state.factoryAddress ? Web3.utils.toChecksumAddress(state.factoryAddress) : null,
  account: state => state.account ? Web3.utils.toChecksumAddress(state.account) : null,
  rgeBalance: state => state.rgeBalance,
  campaignData: state => address => state.campaignData[address] || { address: address, issued: false },
  allCampaigns: (state, getters) => state.campaigns.map( a => getters.campaignData(a) ),
  totalIssuance: (state, getters) => state.campaigns.reduce((total, a) => total + getters.campaignData(a).issuance, 0),
  totalFree: (state, getters) => state.campaigns.reduce((total, a) => total + getters.campaignData(a).free, 0),
  totalRedeemed: (state, getters) => state.campaigns.reduce((total, a) => total + getters.campaignData(a).redeemed, 0),
  myCampaigns: (state, getters) => getters.allCampaigns.filter(c => getters.account === c.issuer),
  myIssuance: (state, getters) => getters.myCampaigns.reduce((total, c) => total + c.issuance, 0),
  myFree: (state, getters) => getters.myCampaigns.reduce((total, c) => total + c.free, 0),
  myRedeemed: (state, getters) => getters.myCampaigns.reduce((total, c) => total + c.redeemed, 0),
  coupons: (state, getters) => getters.allCampaigns.filter(c => c.issued && !c.expired && !c.has && c.free > 0),
  acquired: (state, getters) => getters.allCampaigns.filter(c => c.issued && !c.expired && c.has),
  redeemed: (state, getters) => getters.acquired.reduce((total, x) => total + x.used ? 1 : 0, 0)
}

export const actions = {
  nuxtServerInit () {
    // auto init ?
  },
  init ({ dispatch, state }, $eth) {
    if (!$eth.isConnected) {
      $eth.on('connected',  () => dispatch('updateContext'))
      $eth.on('networkChanged', () => dispatch('updateContext'))
      $eth.on('accountsChanged', () => dispatch('updateAccount'))
      $eth.connect()
    } else if ($eth.isConnected && state.campaigns.length < 1) {
      // retry
      dispatch('updateContext')
    }
  },
  async updateContext ({ getters, state, commit, dispatch }) {
    const rouge = this.$rouge()
    commit('set_rougeVersion', await rouge.factory$.version)
    if (state.versionSupported !== getters.rougeVersion) {
      console.log(`PROTOCOL ERROR, found version ${getters.rougeVersion} != ${state.versionSupported}`)
      commit('set_web3Error', 'Wrong protocol version, demo no supported. contact support')
      return
    }
    commit('set_factoryAddress', await rouge.factory$.address)
    dispatch('updateAccount')
  },
  async updateAccount ({ commit, dispatch }) {
    const rouge = this.$rouge()
    if (!rouge) return Promise.reject(new Error('rouge not set up'))
    commit('reset_all')
    commit('set_account', rouge.account$.address)
    const balance = await rouge.RGE$.balanceOf(rouge.account$.address)
    commit('set_rgeBalance', balance.toString())
    dispatch('load_all_campaigns')
  },
  async createCampaign (store, params) {
    const rouge = this.$rouge()
    if (!rouge) return Promise.reject(new Error('rouge not set up'))
    console.log(`Issuer ${rouge.account$.address} creating new campaign...`)
    return rouge.createCampaign({
      auths: [ rouge.AUTH$.Acquisition, rouge.AUTH$.Redemption ],
      ...params
    })
  },
  async load_all_campaigns ({ dispatch, state }) {
    const rouge = this.$rouge()
    if (!rouge) {
      console.log('abort load_campaigns: rouge not set up')
      return
    }
    const all = await rouge.getCampaignList({ scheme: state.scheme })
    for (const address of all) {
      if (!state.campaigns.includes(address)) {
        dispatch('load_campaign', address)
      }
    }
  },
  async load_campaign ({ getters, commit, state }, address) {
    const rouge = this.$rouge()
    if (!rouge) {
      console.log('abort load_campaign: rouge not set up')
      return
    }
    try {
      const campaign = rouge.campaign$(address)
      const version = await campaign.version
      if (version !== state.versionSupported) return
      // console.log(`found campaign at ${address} v. ${version}`)

      var c = {at: address, issuance: 0, free: 0, acquired: 0, redeemed: 0, has: 0, used: 0}

      c.at_pp = c.at.substr(0, 4) + '...' + c.at.substr(38, 4)

      const results = await Promise.all([ campaign.state, campaign.info ])

      // abi.encodePacked(issuer, scheme, campaignExpiration, name);
      c.scheme = results[1].slice(42, 50)

      // only demo campaign should be listed
      if ('0x' + c.scheme !== state.scheme) return
      console.log(`found campaign at ${address} scheme ${c.scheme}`)

      c.issuer = Web3.utils.toChecksumAddress(results[1].slice(0, 42))
      c.issuer_pp = c.issuer.substr(0, 4) + '...' + c.issuer.substr(38, 4)

      c.expiration = Web3.utils.hexToNumber('0x' + results[1].slice(50, 114))
      c.name = Web3.utils.hexToAscii('0x' + results[1].slice(114))

      // abi.encodePacked(issuance, issued, available, acquired, redeemed);
      c.issued = Web3.utils.hexToNumber(results[0].slice(10, 12)) > 0
      if (c.issued) {
        c.issuance = Web3.utils.hexToNumber(results[0].slice(0, 10))
        c.free = Web3.utils.hexToNumber('0x' + results[0].slice(12, 20))
        c.acquired = Web3.utils.hexToNumber('0x' + results[0].slice(20, 28))
        c.redeemed = Web3.utils.hexToNumber('0x' + results[0].slice(28, 36))
      }

      c.lastLoaded = new Date().getTime() / 1000
      c.expired = c.lastLoaded > c.expiration

      if (c.issued && c.issuer !== getters.account) {
        c.has = await campaign.hasNote
        c.used = await campaign.hasRedeemed
      } else {
        c.has = false
        c.used = false
      }
      // console.log('calculating data...', address, c)

      commit('setCampaignData', { address, data: c })
      commit('unshiftCampaigns', address)

    } catch(e) {
      console.log('problem', e)
    }

  }
}
