import { networks } from './network'

const dappName = 'Smart Signature'
const network = networks
const ontology = {
  currentUsingNode: null,
  nodes: {
    mainNetwork: ['dappnode1.ont.io', 'dappnode2.ont.io', 'dappnode3.ont.io', 'dappnode4.ont.io'],
    testNetwork: {
      polaris: [
        'polaris1.ont.io',
        'polaris2.ont.io',
        'polaris3.ont.io',
        'polaris4.ont.io',
        'polaris5.ont.io'
      ]
    }
  },
  scriptHash: process.env.VUE_APP_SCRIPT_HASH,
  gasLimit: 20000,
  gasPrice: 500
}

ontology.currentUsingNode =
  process.env.NODE_ENV === 'production'
    ? ontology.nodes.mainNetwork[0]
    : ontology.nodes.testNetwork.polaris[0]

const i18n = [
  {
    locale: 'zh',
    aliases: ['zh', 'zh-cn', 'zh-hk', 'zh-sg', 'zh-tw']
  },
  {
    locale: 'en',
    aliases: [
      'en',
      'en-us',
      'en-au',
      'en-bz',
      'en-ca',
      'en-ie',
      'en-jm',
      'en-nz',
      'en-ph',
      'en-za',
      'en-tt',
      'en-gb',
      'en-zw'
    ]
  },
  {
    locale: 'ja',
    aliases: ['jp', 'ja', 'ja-jp']
  },
  {
    locale: 'ko',
    aliases: ['ko']
  }
]

export { dappName, network, ontology, i18n }
