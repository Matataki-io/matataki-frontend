import { ethers } from 'ethers'
import { IMulticall, IPeggedMinter } from './abi/'

export const NetworksId = {
  BSC_MAINNET: 56,
  BSC_TESTNET:  97,
  MATIC_MAINNET: 137,
  MATIC_TESTNET: 80001,
}

const ZERO = '0x0000000000000000000000000000000000001000'

const mintContract = new ethers.Contract(ZERO, IPeggedMinter)

export const TokenMinterContractAddress = {
  [NetworksId.BSC_MAINNET]: '0xCaED74043e201D7323A8B5f71035DA185A03c4dF',
  [NetworksId.BSC_TESTNET]: '0xe8142C86f7c25A8bF1c73Ab2A5Dd7a7A5C429171',
  [NetworksId.MATIC_TESTNET]: '0xc0b159b61a03c5215E4BB0718E0441D2091B6312',
  // @todo: replace when go mainnet
  [NetworksId.MATIC_MAINNET]: ZERO,
}

export const TokenBurnerContractAddress = {
  [NetworksId.BSC_MAINNET]: '0xfD1227b1c36F689E74Ab59e72004E493d88A2259',
  [NetworksId.BSC_TESTNET]: '0xEF0B6c622c63860d9C29CD5Eac442f626F2cFF1E',
  [NetworksId.MATIC_TESTNET]: '0xB88aEC75a14c750652144E3F69BAcd4CEC323C60',
  // @todo: replace when go mainnet
  [NetworksId.MATIC_MAINNET]: ZERO,
}

const MulticallContractAddress = {
  [NetworksId.BSC_MAINNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [NetworksId.BSC_TESTNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [NetworksId.MATIC_TESTNET]: '0x23E8A2e4f8160a5a685709dB72a4C35435C57118',
  // @todo: replace when go mainnet
  [NetworksId.MATIC_MAINNET]: ZERO,
}

const Multicall = new ethers.Contract(ZERO, IMulticall)

export async function mintWithPermit(provider, token, to, value, deadline, v, r, s, chainId) {
  const connectedMinter = mintContract.attach(TokenMinterContractAddress[chainId]).connect(provider)
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

export function aggerate(provider, calls) {
  return Multicall.connect(provider).attach(MulticallContractAddress[provider.network.chainId]).callStatic.aggregate(calls)
}


const CALL_ONLY_PROVIDER = {
  [NetworksId.BSC_MAINNET]: new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/', {
    name: 'BSC Mainnet',
    chainId: 56,
  }),
  [NetworksId.BSC_TESTNET]: new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
    name: 'BSC Testnet',
    chainId: 97,
  }),
  [NetworksId.MATIC_MAINNET]: new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/', {
    name: 'Matic Mainnet',
    chainId: 137,
  }),
  [NetworksId.MATIC_TESTNET]: new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/', {
    name: 'Matic Testnet',
    chainId: 80001,
  }),
}

export const isTesting = process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development'

export async function batchQueryNonceFor(queries, chain) {
  const provider = CALL_ONLY_PROVIDER[chain]
  const fragment = IPeggedMinter.getFunction('getNoncesOf')
  const calls = queries.map(({ token, who }) => ({
    target: TokenMinterContractAddress[chain],
    callData: IPeggedMinter.encodeFunctionData(fragment, [token, who])
  }))
  const [, returnData] = await aggerate(provider, calls)
  return returnData.map((bytesLike) => IPeggedMinter.decodeFunctionResult(fragment, bytesLike)).map(([ num ]) => num)
}