import { utils } from 'ethers'
import PeggedMinterAbi from './PeggedMinter.json'
import MulticallAbi from './Multicall.json'

export const IPeggedMinter = new utils.Interface(PeggedMinterAbi)
export const IMulticall = new utils.Interface(MulticallAbi)
