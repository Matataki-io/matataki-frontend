import { ethers } from 'ethers'
import PeggedMinterABI from './abi/PeggedMinter.json'

const PeggedTokenMinterAddress = '0xe8142C86f7c25A8bF1c73Ab2A5Dd7a7A5C429171'

const mintContract = new ethers.Contract(PeggedTokenMinterAddress, PeggedMinterABI)

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