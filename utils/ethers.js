import { ethers } from 'ethers'
import PeggedMinterABI from './abi/PeggedMinter.json'

const PeggedTokenMinterAddress = '0xe8142C86f7c25A8bF1c73Ab2A5Dd7a7A5C429171'

const mintContract = new ethers.Contract(PeggedTokenMinterAddress, PeggedMinterABI)

export async function mintWithPermit(provider, token, to, value, deadline, v, r, s) {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  const connectedMinter = mintContract.connect(provider)
  const result = await connectedMinter.mintPeggedTokenWithPermit(token, to, value, deadline, v, r, s)
  return result
}