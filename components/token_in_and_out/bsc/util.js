export function depositStatusRenderer(statusCode) {
  const EnumForPeggedAssetDeposit = {
    /**
         * 开始初始状态为0
         * 触发了BURN EVENT（回收跨链Token）为1
         * BURN EVENT 被 6 个区块确认了，为 2
         * 数据库和Rinkeby Fan票转入账户交易创建，为3
         * RINKEBY 的交易到账（被确认）了，为4
         */
    START: 0,
    BURN_EVENT_CREATED: 1,
    BURN_EVENT_CONFIRMED: 2,
    RINKEBY_DEPOSIT_CREATED: 3,
    RINKEBY_DEPOSIT_CONFIRMED: 4,
  }
  switch(statusCode) {
    case EnumForPeggedAssetDeposit.START: return '开始'
    case EnumForPeggedAssetDeposit.BURN_EVENT_CREATED: return { message: '等待网络确认' }
    case EnumForPeggedAssetDeposit.BURN_EVENT_CONFIRMED: return  { message: '已确认，等待转账' }
    case EnumForPeggedAssetDeposit.RINKEBY_DEPOSIT_CREATED: return  { message: '已转账，等待Rinkeby网络确认' }
    case EnumForPeggedAssetDeposit.RINKEBY_DEPOSIT_CONFIRMED: return  { message: '已到账' }
    default: return { message: '订单异常，请联系 Matataki 支持' }
  }
}