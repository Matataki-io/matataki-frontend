export default {
  regInviter: 66, // 每成功邀请一名好友注册，邀请者可得到xx积分
  regInvitee: 500, // 成功被邀请注册，登录即可领取xx积分
  regInviteFinished: 600, // 邀请任务完成奖励600积分
  loginNew: 300, // 所有新用户在活动期间首次登录即可领取x积分奖励
  loginOld: 1000, // 所有老用户在活动期间首次登录即可领取x积分奖励
  profile: 50, // 完善资料获取积分
  readRate: 15, // 15 = 30 / 2，阅读多少秒可以获得1积分，每30秒获得2积分
  readNew: 5, // 阅读新文章
  readNewAuthor: 1, // 阅读新文章，作者
  readAuthorRate: 0.5, // 阅读，作者获得阅读积分的1/2
  readReferralRate: 0.25, // 你邀请的好友通过阅读获得积分奖励，你额外可得1/4
  readDailyMax: 100, // 每日阅读最大积分
  readOnceMax: 10, // 阅读每篇文章可获得的最大积分
  publish: 100, // 发布文章
  publishReferral: 20, // 你邀请的好友发布新文章，你额外可得10积分
  publishDailyMax: 300 // 每日发文最大积分
}
