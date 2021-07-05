import { utils } from 'ethers'
import PeggedMinterAbi from './PeggedMinter.json'
import MulticallAbi from './Multicall.json'
import FactoryV2Abi from './FactoryV2.json'
import ERC20Abi from './ERC20.js'

export const IPeggedMinter = new utils.Interface(PeggedMinterAbi)
export const IMulticall = new utils.Interface(MulticallAbi)
export const IFactoryV2 = new utils.Interface(FactoryV2Abi)
export const ERC20 = new utils.Interface(ERC20Abi)
