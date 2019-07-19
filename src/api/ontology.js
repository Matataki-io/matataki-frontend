/* eslint-disable */
import { dappName, ontology } from '@/config';

// https://github.com/backslash47/OEPs/blob/oep-dapp-api/OEP-6/OEP-6.mediawiki

const isAPP = /Edge|Firefox|Opera|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// try...catch 放在 npm 包的使用入口的位置

const toolkit = {
  ab2str: (buf) => String.fromCharCode.apply(null, new Uint8Array(buf)),
  hexstring2ab:  (str) => {
    const result = [];

    while (str.length >= 2) {
      result.push(parseInt(str.substring(0, 2), 16));
      str = str.substring(2, str.length);
    }

    return result;
  },
  reverseHex: (hex) => {
    if (hex.length % 2 !== 0) {
      throw new Error(`Incorrect Length: ${hex}`);
    }
    let out = '';
    for (let i = hex.length - 2; i >= 0; i -= 2) {
      out += hex.substr(i, 2);
    }
    return out;
  },
};

const API = {
  client: null,
  async setClient() {
    if (this.client) return;
    if (isAPP) {
      const { client } = await import(/* webpackChunkName: "ontology-cyanobridge" */ 'cyanobridge');
      client.registerClient();
      this.client = client;
    } else {
      const { client } = await import(/* webpackChunkName: "ontology-ontology-dapi" */ 'ontology-dapi');
      client.registerClient({});
      this.client = client;
    }
  },
  // Network
  async getBalance({ address }) {
    if (!this.client) await this.setClient();
    const { client } = this;
    try {
      if (isAPP) {
        const url = process.env.NODE_ENV === 'production' 
          ? `https://${ontology.currentUsingNode}:10334`
          : `http://${ontology.currentUsingNode}:20334`;
        const response = await fetch(`${url}/api/v1/balance/${address}`);
        // console.debug(response);
        const { Result } = await response.json();
        // console.debug(Result);
        const { ong: ONG, ont: ONT } = Result;
        // console.debug({ ONG, ONT });
        return ({ ONG, ONT });
      }
      return client.api.network.getBalance({ address }); // done
    } catch(error) {
      console.error('ontology.js 內部錯誤，請查閱 npm 包的 doc 釐清 : ', error);
      throw error;
    }
  },
  // Asset
  async getAccount() {
    if (!this.client) await this.setClient();
    const { client } = this;
    const params = {
      dappName,
      dappIcon: '' // some url points to the dapp icon
    };
    try {
      let address = null;
      if (isAPP) {
        const { result } = await client.api.asset.getAccount(params);
        address = result;
      } else {
        address = await client.api.asset.getAccount();
      }
      return address;
    } catch(error) {
      console.error('ontology.js 內部錯誤，請查閱 npm 包的 doc 釐清 : ', error);
      throw error;
    }
  },
  // Message
  async signMessage({ message }) {
    if (!this.client) await this.setClient();
    const { client } = this;
    const params = {
      type: 'account', // account or identity that will sign the message
      dappName, // dapp's name
      dappIcon: '', // some url that points to the dapp's icon
      message, // message sent from dapp that will be signed by native client
      expired: new Date('2020-01-01').getTime(), // expired date of login // todo
      callback: '' // callback url of dapp
    };
    try {
      let signature = null;
      if (isAPP) {
        const { result } = await client.api.message.login(params);
        const { publickey: publicKey, signature: data } = result;
        signature = { publicKey, data };
      } else {
        signature = await client.api.message.signMessage({ message });
      }
      return signature;
    } catch(error) {
      console.error('ontology.js 內部錯誤，請查閱 npm 包的 doc 釐清 : ', error);
      throw error;
    }
  },
  // SmartContract
  async invoke({
    scriptHash, operation, args, gasPrice, gasLimit, requireIdentity
  }) {
    if (!this.client) await this.setClient();
    const { client } = this;
    const config = {
      "login": true,
      "message": "invoke smart contract",
      "url": ""  
    }
    const params = {
      scriptHash,
      operation,
      args,
      gasPrice, gasLimit,
      payer: await this.getAccount(),
      config,
    }
    try {
      return isAPP
        ? client.api.smartContract.invoke(params) // done
        : client.api.smartContract.invoke({
          scriptHash, operation, args, gasPrice, gasLimit, requireIdentity
        }); // done
    } catch(error) {
      console.error('ontology.js 內部錯誤，請查閱 npm 包的 doc 釐清 : ', error);
      throw error;
    }
  },
};


export default API;
export { toolkit };