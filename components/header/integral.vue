<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <svg-icon class="integral" icon-class="integral" @click="emit('jumpAccount')" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item></el-dropdown-item> -->
      <div class="integral-container">
        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">我的积分</span>
            <span class="integral-num">1980</span>
          </div>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">完善资料设置</span>
            <el-button size="mini" class="integral-btn">
              <svg-icon class="box" icon-class="box" />
              领取
            </el-button>
          </div>
          <p class="integral-des">
            完善个人资料即可领取50积分
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">老用户回馈</span>
            <el-button size="mini" class="integral-btn">
              <svg-icon class="box" icon-class="box" />
              领取
            </el-button>
          </div>
          <p class="integral-des">
            感谢老用户的支持，点击领取500积分
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">荣誉勋章</span>
            <el-button size="mini" class="integral-btn">
              <svg-icon class="box" icon-class="box" />
              领取
            </el-button>
          </div>
          <p class="integral-des">
            前1000名用户回馈，领取后会显示在个人主页中
          </p>
        </div>

        <div class="line" />

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">每日签到有奖</span>
            <el-button size="mini" class="integral-btn">
              <svg-icon class="checkin" icon-class="checkin" />
              签到
            </el-button>
          </div>
          <p class="integral-des">
            每日签到随机获得5～10积分，连续签到
            可得更多积分
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">友情好友有奖</span>
            <el-button size="mini" class="integral-btn">
              复制链接
            </el-button>
          </div>
          <div class="integral-link">
            http://wwwtest.smartsignature.io?referral=123123
          </div>
          <p class="integral-des">
            每成功邀请一名好友注册可得100积分，好友获得积分你也可以获得1/10，好友每发一篇文章你可以获得10积分
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">每日发文奖励</span>
          </div>
          <div class="integral-progress">
            <el-progress class="progress" :percentage="50" :show-text="false" :stroke-width="10" />
            10/20
          </div>
          <p class="integral-des">
            每日发文前2篇皆可获得10积分奖励
          </p>
        </div>

        <div class="integral-list">
          <div class="flex">
            <span class="integral-title">每日阅读奖励</span>
          </div>
          <div class="integral-progress">
            <el-progress class="progress" :percentage="50" :show-text="false" :stroke-width="10" />
            10/100
          </div>
          <p class="integral-des">
            每日阅读评价文章最高可得100积分奖励
          </p>
        </div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style lang="less" scoped>
.integral {
  width: 26px;
  height: 26px;
  margin: 0 40px;
  cursor: pointer;
}

.line {
  height: 1px;
  background-color: #DBDBDB;
}

.integral-container {
  width: 256px;
  padding: 0 20px;
  overflow: auto;
  max-height: 560px;
}
.integral-list {
  margin: 20px 0;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.integral-title {
  font-size:16px;
  font-weight:500;
  color: #333;
}
.integral-des {
  font-size:12px;
  font-weight:400;
  color:rgba(178,178,178,1);
  padding: 0;
  margin: 10px 0 0;
  line-height: 1.5;
}

.integral-num {
  font-size:24px;
  color:rgba(28,156,254,1);
  font-weight: bold;
}

.integral-link {
  display: flex;
  align-items: center;
  height:30px;
  background:rgba(241,241,241,1);
  border-radius:6px;
  font-size:14px;
  color:rgba(178,178,178,1);
  padding: 10px;
  margin: 10px 0;
  line-height: 1.5;
}

.integral-progress {
  margin: 10px 0;
  display: flex;
  align-items: center;
  .progress {
    margin-right: 10px;
    flex: 1;
  }
}

.integral-btn {
  background: #000;
  border-color: #000;
  color: #fff;
  &:hover {
    background: #333;
    border-color: #333;
  }
}
</style>
