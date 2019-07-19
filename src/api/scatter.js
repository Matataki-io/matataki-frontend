/* eslint-disable */
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import * as config from '@/config';
import PriceFormatter from './priceFormatter';

ScatterJS.plugins(new ScatterEOS());

// const account = 'signature.bp';
const currentNetwork = config.network.eos.mainnet[0];
// api https://get-scatter.com/docs/api-create-transaction

// @trick: use function to lazy eval Scatter eos, in order to avoid no ID problem.
export const eos = () => ScatterJS.scatter.eos(currentNetwork, Eos, { expireInSeconds: 60 });

const network = ScatterJS.Network.fromJson({
  blockchain:'eos',
  chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  host:'nodes.get-scatter.com',
  port:443,
  protocol:'https'
});

const API = {
  async getBalancesByContract({ tokenContract = 'eosio.token', accountName, symbol }) {
    return eos().getCurrencyBalance(tokenContract, accountName, symbol);
  },
  account() { return ScatterJS.account('eos'); },
  connect() { return ScatterJS.connect(config.dappName, { network }); },
  loginScatterAsync() { return ScatterJS.getIdentity({ accounts: [currentNetwork] }); },
  logout() { return ScatterJS.forgetIdentity(); },
  suggestNetworkAsync() { return ScatterJS.suggestNetwork(currentNetwork); },
  getArbitrarySignature(publicKey, data, memo) { 
    return ScatterJS.getArbitrarySignature(publicKey, data, memo);
  },
  async getPublicKey() { return ScatterJS.getPublicKey('eos'); },
  /*
  transferEOSAsync({
    to,
    memo = '',
    amount = 0,
  }) {
    return eos().transfer(
      currentEOSAccount().name,
      to,
      PriceFormatter.formatPrice(amount),
      memo, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  },
  async transferTokenAsync({
    to,
    memo = '',
    amount = 0,
    tokenContract = 'eosio.token',
  }) {
    const contract = await eos().contract(tokenContract);

    return contract.transfer(
      currentEOSAccount().name,
      to,
      amount,
      memo, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  }, */
};

export default API;
