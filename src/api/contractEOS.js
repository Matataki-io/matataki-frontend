import { eos } from './scatter'

// https://github.com/EOSIO/eosjs/tree/v16.0.9

export const CONTRACT_ACCOUNT = process.env.VUE_APP_SIGNATURE_CONTRACT

const transferEOS = ({ account = null, amount = 0, memo = '' }) => {
  if (!account) throw new Error('no account')
  return eos().transaction({
    actions: [
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [
          {
            actor: account.name,
            permission: account.authority
          }
        ],
        data: {
          from: account.name,
          to: CONTRACT_ACCOUNT,
          quantity: `${amount.toFixed(4).toString()} EOS`,
          memo
        }
      }
    ]
  })
}

export const recordOrder = ({ account = null, amount = null, oId = null, sponsor = null }) => {
  if (!amount) {
    throw new Error('amount cant be falsy')
  }
  if (!oId) {
    throw new Error('oId cant be falsy')
  }
  return transferEOS({
    account,
    amount,
    memo: sponsor ? `buy ${oId} ${sponsor}` : `buy ${oId}`
  })
}

export const recordShare = ({ account = null, amount = null, signId = null, sponsor = null }) => {
  if (!amount) {
    throw new Error('amount cant be falsy')
  }
  if (!signId) {
    throw new Error('signId cant be falsy')
  }
  return transferEOS({
    account,
    amount,
    memo: sponsor ? `support ${signId} ${sponsor}` : `support ${signId}`
  })
}

export const withdraw = ({ account = null }) => {
  if (!account) throw new Error('no account')
  return eos().transaction({
    actions: [
      {
        account: CONTRACT_ACCOUNT,
        name: 'claim',
        authorization: [
          {
            actor: account.name,
            permission: account.authority
          }
        ],
        data: { from: account.name }
      }
    ]
  })
}

/*
// https://eosio.stackexchange.com/questions/1459/how-to-get-all-the-actions-of-one-account
export const getContractActions = () => {
  const param = {
    json: true,
    account_name: CONTRACT_ACCOUNT,
    // pos: -1,
    offset: -200,
  };
  return eos().getActions(param);
};

export const getSharesInfo = async (owner) => {
  const { rows } = await eos().getTableRows({
    json: true,
    code: CONTRACT_ACCOUNT,
    scope: owner,
    table: 'shares',
    limit: 1000,
  });
  return rows;
};

export const getSignInfo = async (id) => {
  const { rows } = await eos().getTableRows({
    json: true,
    code: CONTRACT_ACCOUNT,
    scope: CONTRACT_ACCOUNT,
    table: 'signs',
    lower_bound: id,
    limit: 1,
  });
  return rows;
};

const getSignsInfo = async () => {
  const { rows } = await eos().getTableRows({
    json: true,
    code: CONTRACT_ACCOUNT,
    scope: CONTRACT_ACCOUNT,
    table: 'signs',
    limit: 10000,
  });
  return rows;
};

const getPlayerBills = async (owner) => {
  const { actions } = await eos().getActions({
    json: true,
    account_name: owner,
    // pos: -1,
    offset: -100,
  });
  // console.log("player actions",actions);
  return actions;
};
*/
export const getPlayerIncome = async name => {
  const { rows } = await eos().getTableRows({
    json: true,
    code: CONTRACT_ACCOUNT,
    scope: name,
    table: 'players',
    limit: 1
  })
  // console.debug('getPlayerIncome : ', rows);
  return rows
}
/*
async function getGoods() {
  const { rows } = await eosapi().getTableRows({
    json: true,
    code: CONTRACT_ACCOUNT,
    scope: CONTRACT_ACCOUNT,
    table: 'goods',
    limit: 10000,
  });
  return rows;
}
*/
