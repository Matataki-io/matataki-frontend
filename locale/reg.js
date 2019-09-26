const before = {
  title: '提现',
  address: '提现地址',
  inputAddress: '输入或长按黏贴地址',
  inputTag: '输入或长按粘贴标签',
  memo: '标签 MEMO',
  memoDes: '(填写错误可能导致资产损失,请仔细核对)',
  amount: '数量',
  amountDes: '(默认全部，不可修改)',
  handlingFee: '手续费',
  handlingFeeDes: '(限时由瞬MATATAKI官方支付)',
  eosDes1: '最小提币数量为：0.5 EOS。',
  eosDes2: '提现数量默认为全部EOS余额。',
  eosDes3: '如需提币到交易所，请填写正确的 memo。',
  eosDes4: '请务必确认电脑及浏览器安全，防止信息被篡改或泄露。',
  ontDes1: '最小提币数量为：1 ONT。',
  ontDes2: '提现数量默认为全部ONT余额的正整数部分。',
  ontDes3: '请务必确认电脑及浏览器安全，防止信息被篡改或泄露。',
  notBalance: '没有可以提现的余额',
  notAddress: '请输入提现地址',
  withdrawMinBalance: '提现{0}不能小于{1}',
  success: '已发起提现请求,请耐心等待提现金额到账',
  fail: '提现失败',
  prompt: '确认提现?',
  account: '我的账户',
  pendingCash: '待提现',
  totalRevenue: '总收益',
  notOnline: '即将上线，敬请期待',
  createIncome: '创作收益',
  supportIncome: '投资收益',
  supportExpenditure: '投资支出',
  assetList: '资产明细',
  balance: '钱包余额'
}

const after = {
  Title: 'cash out',
  Address: 'cash address',
  inputAddress: 'Enter or long press the paste address',
  inputTag: 'Enter or long press the paste label',
  Memo: 'label MEMO',
  memoDes: '(Filling errors may result in asset loss, please check carefully)',
  Amount: 'quantity',
  amountDes: '(Default all, not modifiable)',
  handlingFee: 'handling fee',
  handlingFeeDes: '(Limited by Instant MATATAKI official payment)',
  eosDes1: 'The minimum number of coins is: 0.5 EOS. ',
  eosDes2: 'The withdrawal amount defaults to all EOS balances. ',
  eosDes3: 'If you need to withdraw coins to the exchange, please fill in the correct memo. ',
  eosDes4: 'Please be sure to check the security of your computer and browser to prevent the information from being tampered with or leaked. ',
  ontDes1: 'The minimum number of coins is: 1 ONT. ',
  ontDes2: 'The number of withdrawals defaults to the positive integer part of all ONT balances. ',
  ontDes3: 'Please be sure to check the security of your computer and browser to prevent the information from being tampered with or leaked. ',
  notBalance: 'There is no balance that can be withdrawn',
  notAddress: 'Please enter the withdrawal address',
  withdrawMinBalance: 'Withdrawal {0} cannot be less than {1}',
  Success: 'The withdrawal request has been initiated, please be patient and wait for the cash amount to arrive',
  Fail: 'Receive failure',
  Prompt: 'Confirm withdrawal?',
  Account: 'my account',
  pendingCash: 'to be cashed out',
  totalRevenue: 'total revenue',
  notOnline: 'coming soon, please stay tuned',
  createIncome: 'creative income',
  supportIncome: 'Investment income',
  supportExpenditure: 'Investment expenditure',
  assetList: 'asset details',
  Balance: 'wallet balance'
}

const res = {}

const entriesAfter = Object.entries(after)

const keysBefore = Object.keys(before)

for (let i = 0; i < keysBefore.length; i++) {
  res[keysBefore[i]] = entriesAfter[i][1]
}

console.log(res)
