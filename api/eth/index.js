// import Web3 from 'web3'
import sigUtil from 'eth-sig-util'

// const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
/**
 * From MetaMask v7 , privacy mode will be open by default
 * blocking the dapp from direct access of user pubkey,
 * so we need user to authorize us
 *  */
function connect() {
  if (typeof window.ethereum !== 'undefined') {
    // the browser should injected metamask
  }
  return window.ethereum.enable() // Return A Promise, require user authorization
}

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
  signTypedDataV3({ from, params, msgParams })
}

// safer than v1
function signTypedDataV3({ params, from, msgParams }) {
  window.web3.currentProvider.sendAsync({
    method: 'eth_signTypedData_v3',
    params,
    from
  }, function (err, result) {
    if (err) return console.dir(err)
    if (result.error) {
      alert(result.error.message)
    }
    if (result.error) return console.error('ERROR', result)
    console.log('TYPED SIGNED:' + JSON.stringify(result.result))

    const recovered = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: result.result })

    if (recovered) {
      alert('Successfully ecRecovered signer as ' + from)
    } else {
      alert('Failed to verify signer when comparing ' + result + ' to ' + from)
    }
  })
}

export { signToLogin }
