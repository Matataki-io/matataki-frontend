import { ethers } from 'ethers'
import { IMulticall, IPeggedMinter } from './abi/'

const PeggedTokenMinterAddress = '0xe8142C86f7c25A8bF1c73Ab2A5Dd7a7A5C429171'

const mintContract = new ethers.Contract(PeggedTokenMinterAddress, IPeggedMinter)
const BscMulticall = new ethers.Contract('0xe348b292e8eA5FAB54340656f3D374b259D658b8', IMulticall)

export async function mintWithPermit(provider, token, to, value, deadline, v, r, s) {
  const connectedMinter = mintContract.connect(provider)
  try {
    const result = await connectedMinter.mintPeggedTokenWithPermit(token, to, value, deadline, v, r, s)
    return result
  } catch (error) {
    if (error.code === -32603) {
      throw new Error('网络错误，请检查一下网络。如果网络正确，可能是: 1. 这个许可证可能已经激活了 2. 之前发给收款人的许可证还没激活')
    }
    if (error.code === 4001) throw new Error('你拒绝了签名，交易取消')
    console.error(error)
    throw error
  }
}


const BinanceSmartChain = {
  MAINNET: {
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    chainId: 56,
    platformCurrency: 'BNB',
  },
  TESTNET: {
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    chainId: 97,
    platformCurrency: 'BNB',
  },
}


export function aggerate(provider, calls) {
  return BscMulticall.connect(provider).callStatic.aggregate(calls)
}

const BSC_CALL_ONLY_PROVIDER = {
  MAINNET: new ethers.providers.JsonRpcProvider(BinanceSmartChain.MAINNET.rpcUrl, {
    name: 'BSC Mainnet',
    chainId: BinanceSmartChain.MAINNET.chainId,
  }),
  TESTNET: new ethers.providers.JsonRpcProvider(BinanceSmartChain.TESTNET.rpcUrl, {
    name: 'BSC Testnet',
    chainId: BinanceSmartChain.TESTNET.chainId,
  })
}

export async function batchQueryNonceFor(queries) {
  const provider = BSC_CALL_ONLY_PROVIDER.TESTNET
  const fragment = IPeggedMinter.getFunction('getNoncesOf')
  console.log('getNoncesOf', fragment)
  console.info('queries', queries)
  const calls = queries.map(({ token, who }) => ({
    target: PeggedTokenMinterAddress,
    callData: IPeggedMinter.encodeFunctionData(fragment, [token, who])
  }))
  console.log('calls', calls)
  const [, returnData] = await aggerate(provider, calls)
  return returnData.map((bytesLike) => IPeggedMinter.decodeFunctionResult(fragment, bytesLike)).map(([ num ]) => num)
}