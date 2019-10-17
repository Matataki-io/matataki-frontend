// eslint-disable-next-line import/prefer-default-export
export const paginationUrl = {
  // 两端需要同步更新
  // home
  homeTimeRanking: 'posts/timeRanking',
  homeSupportsRanking: 'posts/supportsRanking',
  homeScoreRanking: 'posts/scoreRanking',
  homeAmountRankingEOS: 'posts/amountRanking',
  homeAmountRankingONT: 'posts/amountRanking',
  // article comments
  commentsList: 'comment/comments',
  // followlist
  followsList: 'follow/follows',
  fansList: 'follow/fans',
  // asset
  assetList: 'user/tokens',
  // user articles
  // 原创文章-使用 homeTimeRanking 接口 地址一样
  userArticlesSupportedList: 'posts/supported',
  // draftbox
  draftboxList: 'draft/drafts',
  // tag by id
  getPostByTagById: 'posts/getPostByTag',
  // buy
  buyHistory: 'order/products',
  // 用户积分日志
  userPoint: 'user/points',
  // 搜索文章
  searchArticleList: 'posts/search',
  // 搜索用户
  searchUserList: 'users/search',
  // 已经关注用户的文章
  followedPosts: 'posts/followedPosts',
  // 邀请列表，没有统计数据
  userInvitees: 'user/invitees',
  // 获取token的持仓用户列表
  tokenUserList: '/token/userlist',
  // 获取用户的持仓token列表
  tokenTokenList: '/token/tokenlist',
  // 买入粉丝币-流水明细
  tokenflow: '/token/tokenflow',
  // 我的粉丝币-流水明细
  usertokenflow: '/token/tokenflow',
  // 用户持有的粉丝币明
  tokenUserLogs: '/token/userlogs',
  // token明细
  tokenTokenLogs: '/token/tokenlogs'
}
