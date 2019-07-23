// https://www.eosdocs.io/resources/apiendpoints/
export const networks = {
  // eos: {
  //   protocol: 'https',
  //   blockchain: 'eos',
  //   host: 'api.eosbeijing.one',
  //   port: 443,
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  // },
  // {
  //     chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  //     protocol: "https",
  //     host: 'proxy.eosnode.tools',
  //     port: 443,
  //     httpEndpoint: "https://proxy.eosnode.tools",
  // },
  eos: {
    mainnet: [
      {
        blockchain: 'eos',
        protocol: 'https',
        host: 'nodes.get-scatter.com',
        port: 443,
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      },
      {
        blockchain: 'eos',
        protocol: 'https',
        host: 'public.eosinfra.io',
        port: 443,
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      },
      {
        blockchain: 'eos',
        protocol: 'https',
        host: 'api.eosnewyork.io',
        port: 443,
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      }
    ],
    testnet: [
      {
        protocol: 'https',
        blockchain: 'eos',
        host: 'api-kylin.eosasia.one',
        port: 443,
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
      }
    ]
  },
  bos: {
    protocol: 'https',
    blockchain: 'eos',
    host: 'hapi.bos.eosrio.io',
    port: 443,
    chainId: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86'
  }
}

export default networks
