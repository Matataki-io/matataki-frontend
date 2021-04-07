import { Contract, utils } from 'ethers'
import { TokenBurnerContractAddress } from '@/utils/ethers'
import ERC20WithPermitABI from './ERC20WithPermit.json'
import TokenBurnerABI from './TokenBurner.json'

export async function signERC2612Permit(provider, token, owner, spender, value, _deadline = 30) {
  const now = new Date().getTime()
  const afterWhenFail = now + (1000 * 60 * _deadline)
  const deadline = Math.floor(afterWhenFail / 1000)
  const tokenContract = new Contract(token, ERC20WithPermitABI, provider)
  const [ name, nonce, chainId ] = await Promise.all([
    tokenContract.name(),
    tokenContract.nonces(owner),
    provider.getChainId()
  ])
  const domain = {
    name,
    version: '1',
    chainId,
    verifyingContract: token
  }
  console.info(domain)
  const types = {
    'Permit': [{
      'name': 'owner',
      'type': 'address'
    },
    {
      'name': 'spender',
      'type': 'address'
    },
    {
      'name': 'value',
      'type': 'uint256'
    },
    {
      'name': 'nonce',
      'type': 'uint256'
    },
    {
      'name': 'deadline',
      'type': 'uint256'
    }
    ]
  }
  const sig = await provider._signTypedData(domain, types, { owner, spender, value, nonce, deadline })
  const { r, s, v } = utils.splitSignature(sig)
  return { sig: { r, s, v }, owner, spender, value, nonce, deadline }
}


export function approve(provider, token, to, value = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF') {
  const tokenContract = new Contract(token, ERC20WithPermitABI, provider)
  return tokenContract.approve(to, value)
}

export function burn(signer, token, uid, amount) {
  const { chainId } = signer.provider.network
  const BurnerContract = new Contract(TokenBurnerContractAddress[chainId], TokenBurnerABI, signer)
  return BurnerContract.burn(token, uid, amount)
}