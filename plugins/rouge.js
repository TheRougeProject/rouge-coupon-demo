
// import Web3 from 'web3'

import { RougeProtocol } from 'rouge.js'

// let rouge = null

const rougeHandler = $eth => () => $eth.isConnected && $eth.web3 ? RougeProtocol($eth.web3).as($eth.selectedAddress) : null

// inject rougeHandler in store and app
export default ({ app }, inject) => {
  inject('rouge', rougeHandler(app.eth))
}
