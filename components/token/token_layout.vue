<template>
  <div class="token">
    <g-header />

    <div class="mw container-padding">
      <div class="fl token-detail">
        <avatar size="120px" />
        <div class="token-detail-info">
          <div class="fl info-line">
            <div class="token-info-title bold">
              DDDDDDDDDDDD
            </div>
            <div>
              <p class="token-info-sub">
                「KOJIMAcoin」
              </p>
            </div>
          </div>
          <div class="fl info-line">
            <div class="token-info-title">
              创始人：
            </div>
            <div>
              <p class="token-info-sub">
                KOJIMAPRODUCTION
              </p>
            </div>
          </div>
          <div class="fl info-line">
            <div class="token-info-title">
              简&emsp;介：
            </div>
            <div>
              <p class="token-info-sub">
                KOJIMAcoin是由鼎鼎大名的小岛工作室所设置的粉丝币。被广大币圈  玩家所看好，一推出币价便直线上涨。
              </p>
            </div>
          </div>
        </div>
        <el-button size="small" class="share-btn" icon="el-icon-share">
          分享
        </el-button>
      </div>
    </div>

    <el-row class="mw token-container">
      <el-col :span="18">
        <div class="introduction">
          <h2 class="token-title">
            介绍
          </h2>
          <p class="token-introduction">
            KOJIMAcoin是由鼎鼎大名的小岛工作室所设置的粉丝币。被广大币圈玩家所看好，一推出币价便直线上涨。被誉为下一个比特币，大家快来买，绝对不是割韭菜，啦啦啦～KOJIMAcoin是由鼎鼎大名的小岛工作室所设置的粉丝币。被广大币圈玩家所看好，一推出币价便直线上涨。被誉为下一个比特币，大家快来买，绝对不是割韭菜，啦啦啦～KOJIMAcoin是由鼎鼎大名的小岛工作室所设置的粉丝币。被广大币圈玩家所看好，一推出币价便直线上涨。被誉为下一个比特币，大家快来买，绝对不是割韭菜，啦啦啦～KOJIMAcoin是由鼎鼎大名的小岛工作室所设置的粉丝币。被广大币圈玩家所看好，一推出币价便直线上涨。
          </p>
        </div>

        <div class="total">
          <h2 class="token-title">
            数据统计
          </h2>
          <div class="fl total-content">
            <div class="token-data">
              <p class="token-num">
                15000<sub>kjc</sub>
              </p>
              <p class="token-name">
                发行总量
              </p>
            </div>

            <div class="token-data">
              <p class="token-num">
                15000<sub>kjc</sub>
              </p>
              <p class="token-name">
                流动金池
              </p>
            </div>

            <div class="token-data">
              <p class="token-num">
                15000<sub>kjc</sub>
              </p>
              <p class="token-name">
                24h成交量
              </p>
            </div>

            <div class="token-data">
              <p class="token-num">
                15000<sub>kjc</sub>
              </p>
              <p class="token-name">
                24h涨跌幅
              </p>
            </div>

            <div class="token-data">
              <p class="token-num">
                15000<sub>kjc</sub>
              </p>
              <p class="token-name">
                现价
              </p>
            </div>
          </div>
        </div>

        <div class="detail">
          <mineTokensNav />
          <div class="line" />
          <slot />
        </div>
      </el-col>
      <el-col :span="6">
        <router-link class="exchange" :to="{name: 'exchange'}">
          <svg-icon
            class="tokens"
            icon-class="token"
          />
          粉丝币交易所
        </router-link>

        <div class="about">
          <h2 class="token-title">
            相关网站
          </h2>

          <ul>
            <li>
              <a href="">https://materialmaterialmaterialmaterial.io/</a>
            </li>
            <li>
              <a href="">https://material.io/</a>
            </li>
            <li>
              <a href="">https://material.io/</a>
            </li>
            <li>
              <a href="">https://material.io/</a>
            </li>
          </ul>
        </div>

        <div class="social">
          <h2 class="token-title">
            社交账号
          </h2>

          <div class="social-btn">
            <div v-for="item in 14" :key="item" class="circle">
              <div class="circle-btn">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <div class="share">
          <h2 class="token-title">
            分享挂件
          </h2>
          <el-input
            v-model="tokenWidget"
            class="token-widget"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import avatar from '@/components/avatar/index.vue'
import mineTokensNav from '@/components/user/minetokens_nav.vue'

export default {
  components: {
    avatar,
    mineTokensNav
  },
  data() {
    return {
      tokenWidget: 'http://localhost:8080/token/15'
    }
  }
}
</script>
<style lang="less" scoped>

.token {
  .minHeight();
}

.token-detail {
  position: relative;
  margin: 20px auto 0;
  padding: 20px;
  background: @white;
  border-radius: @br10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}
.info-line {
  margin: 6px 0;
}
.token-detail-info {
  width: 60%;
  margin-left: 10px;
  font-size:16px;
  font-weight:400;
  color: @black;
  line-height:22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.token-info-title {
  // width: 70px;
  flex: 0 0 70px;
  &.bold {
    font-weight: bold;
  }
}
.token-info-sub {
  padding: 0 0 0 10px;
  margin: 0;
}
.share-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.token-container {
  margin: 20px auto 40px;
}

.introduction {
  background: @white;
  padding: 20px;
  border-radius: @br10;
}

.token-title {
  font-size:24px;
  font-weight:bold;
  color:@black;
  line-height:33px;
  padding: 0;
  margin: 0;
}
.token-introduction {
  font-size:16px;
  font-weight:400;
  color:@black;
  line-height:22px;
  padding: 0;
  margin: 20px 0 0;
}

.total,
.detail,
.about,
.social,
.share {
  background: @white;
  padding: 20px;
  border-radius: @br10;
  margin: 20px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.total-content {
  margin-top: 20px;
}

.token-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
  &:nth-last-child(1) {
    margin-right: 0;
  }
}
.token-num {
  font-size:24px;
  font-weight:bold;
  color: @purpleDark;
  line-height:28px;
  padding: 0;
  margin: 0;
}
.token-name {
  font-size:14px;
  color: @black;
  line-height:20px;
  padding: 0;
  margin: 6px 0 0;
}

.exchange {
  border-radius:20px;
  display: block;
  background: @purpleDark;
  text-align: center;
  color: @white;
  font-size: 16px;
  line-height: 22px;
  padding: 10px 0;
  .tokens {
    font-size: 18px;
  }
}

.about ul {
  padding: 0;
  margin: 10px 0 0;
  overflow: hidden;
  li {
    list-style: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 10px 0;
    a {
      font-size:16px;
      color:@black;
      line-height:22px;
    }
  }
}

.social-btn {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
}
.circle {
  // flex: 0 0 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 10px 8px 0;
  &:nth-child(5n) {
    margin-right: 0;
  }
}
.circle-btn {
  width: 40px;
  height: 40px;
  background-color: @black;
  flex: 0 0 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: @white;
  box-sizing: border-box;
  cursor: pointer;
}
.token-widget {
  margin-top: 20px;
}
.line {
  height: 1px;
  background: #dbdbdb;
  margin: 20px 0;
}
</style>
