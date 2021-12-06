export const paginationUrl = {
  // 两端需要同步更新
  // home
  homeTimeRanking: 'posts/timeRanking',
  homeSupportsRanking: 'posts/supportsRanking',
  homeScoreRanking: 'posts/scoreRanking',
  homeAmountRankingEOS: 'posts/amountRanking',
  homeAmountRankingONT: 'posts/amountRanking',
  // article comments
  // commentsList: 'comment/comments',
  commentsList: 'comment/getComments',
  // followlist
  followsList: 'follow/follows',
  fansList: 'follow/fans',
  // asset
  assetList: 'user/tokens',
  // user articles
  // 原创文章-使用 homeTimeRanking 接口 地址一样
  userArticlesSupportedList: 'posts/supported', // 页面被移除
  // draftbox
  draftboxList: 'draft/drafts',
  // tag by id
  getPostByTagById: 'posts/getPostByTag',
  // buy
  buyHistory: 'order/products',
  // 用户积分日志
  userPoint: 'user/points',
  // 搜索文章
  searchArticleList: 'search/post',
  // 搜索用户
  searchUserList: 'search/user',
  // 搜索分享
  searchShareList: 'search/share',
  // 搜索Fan票
  searchTokenList: 'search/token',
  // 已经关注用户的文章
  followedPosts: 'posts/followedPosts',
  // 邀请列表，没有统计数据
  userInvitees: 'user/invitees',
  // 获取token的持仓用户列表
  tokenUserList: '/token/userlist',
  // 获取用户的持仓token列表
  tokenTokenList: '/token/tokenlist',
  // 持通证详情
  tokenIdBalances: '/token/${id}/balances',
  // 流水明细
  tokenIdTransactions: '/token/${id}/transactions',
  // 买入Fan票-流水明细
  tokenflow: '/token/tokenflow',
  // 我的Fan票-流水明细
  usertokenflow: '/token/tokenflow',
  // 用户持有的Fan票明
  tokenUserLogs: '/token/userlogs',
  // token明细
  tokenTokenLogs: '/token/tokenlogs',
  // 所有的token 分页
  tokenAll: 'token/all',
  // 我持有的流动金
  liquidityLogs: 'token/holdLiquidity',
  // 我持有的流动金详情
  liquidityLogsDetail: 'token/myLiquidityLogs',
  // 流动金持仓用户列表
  liquidityUserList: 'token/${id}/liquidity/balances',
  // 流动金流水列表
  liquidityTransactions: 'token/${id}/liquidity/transactions',
  // 获取草稿引用列表
  draftsReferences: 'drafts/${id}/references',
  // 获取文章引用列表
  postsReferences: 'posts/${id}/references',
  // 查看本文被引用的文章列表
  postsPosts: '/posts/${id}/posts',
  // 获取收藏文章文章引用列表
  userBookmarks: 'user/bookmarks',
  // 通知
  notifications: '/notification/fetch',
  // 获取汇总后的消息列表
  notifyCenter: '/notify/event',
  // 获取汇总后的消息列表
  notifyDetails: '/notify/event/detail',
  // Fan 票相关创作
  minetokenRelated: 'minetoken/${id}/related',
  // 分享列表
  share: 'share',
  // 标签最热
  tagsHottest: 'tags/hotest',
  // 标签最新
  tagsLatest: 'tags/latest',
  // 赞赏
  postsReward: 'posts/${id}/reward',
  // 查看我所有fan票的日志记录
  tokenAllLogs: 'token/allLogs',
  // 查看我所有fan票的流动金日志记录
  tokenAllLiquidityLogs: 'token/allLiquidityLogs',
  // 获取用户的文章排名
  dbBrowseRankType: '/db/browse/rank/${type}',
  // 获取用户某个 token 的收益来源于哪些文章，并以金额倒序。
  dbIncomeSourceType: '/db/income/source/${type}',
  // 获取用户的收益历史（该用户所有文章的付费解锁和打赏收益）。
  dbIncomeHistory:'/db/income/history',
  // 获取用户的推特主页时间线（关注的人）。
  getTwitterTimeline: '/timeline/twitter',
  // 获取用户的推特用户时间线（自己）。
  getTwitterUserTimeline: '/timeline/twitter/user',
  // 收藏夹文章列表
  favPost: '/favorites/post',
}
