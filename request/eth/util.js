/**
* Connect 函数
* 从 MetaMask v7 开始, 隐私模式默认开启
* 授权前网站无法访问用户解锁的钱包
* 特此请求授权
*  */
function connect() {
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

export { fetchId, connect }
