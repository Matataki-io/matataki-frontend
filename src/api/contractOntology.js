import API from './ontology'
import * as config from '@/config'

// eslint-disable-next-line import/prefer-default-export
export const recordOrder = async ({
  owner = null,
  oId = null,
  symbol = null,
  amount = null,
  num = null,
  sponsor = null
}) => {
  if (!owner) {
    throw new Error('owner cant be null')
  }
  if (!oId) {
    throw new Error('oId cant be null')
  }
  if (!symbol) {
    throw new Error('symbol cant be null')
  }
  if (!amount) {
    throw new Error('amount cant be null')
  }
  if (!num) {
    throw new Error('num cant be null')
  }

  const { scriptHash, gasLimit, gasPrice } = config.ontology
  const args = [
    { type: 'String', value: owner },
    { type: 'String', value: `oId:${oId}` },
    { type: 'String', value: symbol },
    { type: 'Integer', value: amount },
    { type: 'String', value: amount.toString() }
  ]
  if (sponsor) args.push({ type: 'String', value: sponsor })
  const response = await API.invoke({
    scriptHash,
    operation: 'RecordShare',
    args,
    gasLimit,
    gasPrice
  })
  console.log(response)
  return response
}

// eslint-disable-next-line import/prefer-default-export
export const recordShare = async ({
  owner = null,
  signId = null,
  symbol = null,
  amount = null,
  sponsor = null
}) => {
  if (!owner) {
    throw new Error('owner cant be null')
  }
  if (!signId) {
    throw new Error('signId cant be null')
  }
  if (!symbol) {
    throw new Error('symbol cant be null')
  }
  if (!amount) {
    throw new Error('amount cant be null')
  }

  const { scriptHash, gasLimit, gasPrice } = config.ontology
  // console.debug(signId.toString());
  const args = [
    { type: 'String', value: owner },
    { type: 'String', value: signId.toString() },
    { type: 'String', value: symbol },
    { type: 'Integer', value: amount },
    { type: 'String', value: amount.toString() }
  ]
  if (sponsor) args.push({ type: 'String', value: sponsor })
  const response = await API.invoke({
    scriptHash,
    operation: 'RecordShare',
    args,
    gasLimit,
    gasPrice
  })
  console.log(response)
  return response
}

/*
const getSign = async (signId) => {
  let result = null;
  // console.log('x1.');
  if (!isAPP) {
    result = await client.api.smartContract.invokeRead({
      scriptHash,
      operation: 'getSign',
      args: [{
        type: 'Integer',
        value: signId,
      }],
      gasLimit,
      gasPrice,
    });
  } else {
    result = await client.api.smartContract.invokeRead({
      scriptHash,
      operation: 'getSign',
      args: [{
        type: 'Integer',
        value: signId,
      }],
      gasLimit,
      gasPrice,
    });
  }

  console.log('result: ', JSON.stringify(result));


  const { ab2str, hexstring2ab, reverseHex } = toolkit;

    const langarr.push([
        parseInt(reverseHex(`${result[0]}`), 16),
        parseInt(reverseHex(`${result[1]}`), 16),
        ab2str(hexstring2ab(`${result[2]}`)),
        countryPointsJson[i].code
      ])
    }

    const globals = [
      parseInt(reverseHex(`${results[0]}`), 16),
      ab2str(hexstring2ab(`${results[1]}`)),
      results[2] ? parseInt(reverseHex(`${results[2]}`), 16) : 0,
    ]

}; */
