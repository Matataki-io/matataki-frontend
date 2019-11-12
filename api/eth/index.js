/**
 * @author Frank Wei<frank@frankwei.xyz>
 * Contact me if you have any questions.
 */
import sigUtil from 'eth-sig-util'

/**
 * Connect 函数
 * 从 MetaMask v7 开始, 隐私模式默认开启
 * 授权前网站无法访问用户解锁的钱包
 * 特此请求授权
 *  */
function connect() {
  if (typeof window.ethereum !== 'undefined') {
    // the browser should injected metamask
  }
  return window.ethereum.enable() // Return A Promise, require user authorization
}

/**
 * @returns {Promise<number>} 返回当前插件的网络ID
 */
function fetchId() {
  return new Promise((resolve, reject) => {
    window.web3.currentProvider.sendAsync({
      method: 'net_version',
      params: [],
      jsonrpc: '2.0'
    }, (err, result) => {
      if (err) { reject(err) }
      resolve(result.result)
    })
  })
}

async function signToLogin() {
  const netId = await fetchId()
  let from = window.web3.eth.accounts[0]
  if (!from) {
    await connect()
    from = window.web3.eth.accounts[0]
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
    domain: { name: 'Matataki 瞬', version: '1', chainId: netId, verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' },
    message
  })

  console.log(msgParams)
  const params = [from, msgParams]
  const result = await signTypedDataV3Async({ params, from })
  // Send the signature back to backend
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

export { signToLogin }
