import Web3 from 'web3'
import { fetchId, connect } from './util'
/**
 * @author Frank Wei<frank@frankwei.xyz>
 * Contact me if you have any questions.
 * This script is intented to run in client side
 */

if (process.browser) {
  // window is undefined 因为nuxt.js在服务器端渲染
  // 服务器渲染环境时 process.browser 为 false，浏览器端为true
  window.addEventListener('load', async () => {
    if (window.ethereum && window.web3) {
      // Modern dapp browsers...
      window.web3 = new Web3(window.ethereum)
      try {
        await connect()
        const accounts = await window.web3.eth.getAccounts()
      } catch (error) {
        // @todo: handle User denied account access...
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      window.web3 = new Web3(window.web3.currentProvider)
      // Acccounts always exposed
      window.web3.eth.sendTransaction({/* ... */ })
    } else {
      // Non-dapp browsers...
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  })
}

async function signToLogin() {
  const netId = await fetchId()
  let [from] = await window.web3.eth.getAccounts()
  if (!from) {
    await connect()
    from = await window.web3.eth.getAccounts()
  }
  const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
  ]

  const message = {
    from,
    time: new Date().getTime()
  }
  const msgParams = JSON.stringify({
    types: {
      EIP712Domain,
      Login: [
        { name: 'from', type: 'address' },
        { name: 'time', type: 'uint256' }
      ]
    },
    primaryType: 'Login',
    domain: {
      name: 'Matataki 瞬',
      version: '1',
      chainId: netId,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    },
    message
  })

  console.log(msgParams)
  const params = [from, msgParams]
  const signature = await signTypedDataV3Async({ params, from })
  console.info(`User signed the login request, signature is ${signature}`)
  return { signature, msgParams }
}

/**
 * 调用 'eth_signTypedData_v3' 在 MetaMask
 * 可以看一下 EIP-712: https://eips.ethereum.org/EIPS/eip-712
 * @param {Object} obj - An object that contains two fields: `params` and `from`.
 * @param {Object} obj.params - Parameter for MetaMask to sign a message.
 * @param {string} obj.from - User's address to sign the message.
 * @returns {Promise<string>} The signature that user signed with TypedData
 */
function signTypedDataV3Async({ params, from }) {
  return new Promise((resolve, reject) => {
    window.web3.currentProvider.sendAsync({
      method: 'eth_signTypedData_v3',
      params,
      from
    }, (err, result) => {
      if (err) reject(err)
      if (result.error) reject(result.error)
      if (result.error) return reject(result)
      resolve(result.result)
    })
  })
}

export { signToLogin, connect }
