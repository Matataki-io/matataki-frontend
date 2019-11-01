<template>
  <div class="token">
    <g-header />

    <div class="mw container-padding">
      <div class="fl token-detail">
        <avatar :src="logo" size="120px" />
        <div class="token-detail-info">
          <div class="fl info-line">
            <div class="token-info-title bold">
              {{ minetokenToken.symbol }}
            </div>
            <div>
              <p class="token-info-sub">
                {{ minetokenToken.name }}
              </p>
            </div>
          </div>
          <div class="fl info-line">
            <div class="token-info-title">
              创始人：
            </div>
            <div>
              <p class="token-info-sub">
                <router-link :to="{name: 'user-id', params: {id: minetokenToken.uid}}">
                  {{ minetokenUser.nickname || minetokenUser.username }}
                </router-link>
              </p>
            </div>
          </div>
          <div class="fl info-line">
            <div class="token-info-title">
              简&emsp;介：
            </div>
            <div>
              <p class="token-info-sub">
                {{ minetokenToken.brief || '暂无' }}
              </p>
            </div>
          </div>
        </div>
        <el-button size="small" class="share-btn" icon="el-icon-share" @click="shareModalShow = true">
          分享
        </el-button>
        <a
          class="help-link"
          href="https://www.matataki.io/p/977"
          target="_blank"
        >什么是粉丝币?</a>
      </div>
    </div>

    <el-row class="mw token-container">
      <el-col :span="18">
        <div class="introduction">
          <h2 class="token-title">
            介绍
          </h2>
          <p class="token-introduction">
            {{ minetokenToken.introduction || '暂无' }}
          </p>
        </div>

        <div class="total">
          <h2 class="token-title">
            数据统计
          </h2>
          <div class="fl total-content">
            <div class="token-data">
              <p class="token-num">
                {{ amount }}<sub>{{ minetokenToken.symbol }}</sub>
              </p>
              <p class="token-name">
                发行总量
              </p>
            </div>

            <div class="token-data">
              <p class="token-num">
                {{ cnyReserve }}<sub>CNY</sub>+{{ tokenReserve }}<sub>{{ minetokenToken.symbol }}</sub>
              </p>
              <p class="token-name">
                流动金池
              </p>
            </div>

            <div class="token-data">
              <p class="token-num">
                {{ volume }}<sub>{{ minetokenToken.symbol }}</sub>
              </p>
              <p class="token-name">
                24h成交量
              </p>
            </div>

            <div class="token-data">
              <p class="token-num" :style="{color: color}">
                {{ change }}
              </p>
              <p class="token-name">
                24h涨跌幅
              </p>
            </div>

            <div class="token-data">
              <p class="token-num">
                {{ price }}<sub>CNY</sub>
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
          <ul v-if="resourcesWebsites.length !== 0">
            <li v-for="(item, index) in resourcesWebsites" :key="index">
              <a target="_blank" :href="item">{{ item }}</a>
            </li>
          </ul>
          <span v-else class="not">暂无</span>
        </div>

        <div class="social">
          <h2 class="token-title">
            社交账号
          </h2>

          <div v-if="resourcesSocialss.length !== 0" class="social-btn">
            <div v-for="(item, index) in resourcesSocialss" :key="index" class="circle">
              <socialIcon :show-tooltip="true" :icon="item.type" :content="item.content" />
            </div>
          </div>
          <span v-else class="not">暂无</span>
        </div>

        <div class="share">
          <h2 class="token-title">
            分享挂件
          </h2>
          <el-input
            v-model="tokenWidget"
            class="token-widget"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
          />
        </div>
      </el-col>
    </el-row>
    <Share
      :share-modal-show="shareModalShow"
      :img="logo"
      :minetoken-token="minetokenToken"
      :minetoken-user="minetokenUser"
      @input="val => shareModalShow = val"
    />
  </div>
</template>
<script>
import avatar from '@/components/avatar/index.vue'
import mineTokensNav from '@/components/user/minetokens_nav.vue'
import Share from '@/components/token/token_share.vue'
import socialIcon from '@/components/social_icon/index.vue'
import socialTypes from '@/config/social_types.js'
import { precision } from '@/utils/precisionConversion'

export default {
  components: {
    avatar,
    mineTokensNav,
    Share,
    socialIcon
  },
  data() {
    return {
      shareModalShow: false,
      tokenWidget: `<iframe width="100%" height="200px" src='${process.env.VUE_APP_URL}/widget/token/?id=${this.$route.params.id}' frameborder=0></iframe>`,
      minetokenToken: Object.create(null),
      minetokenUser: Object.create(null),
      minetokenExchange: Object.create(null),
      resourcesSocialss: [],
      resourcesWebsites: []
    }
  },
  computed: {
    logo() {
      if (!this.minetokenToken.logo) return ''
      return this.minetokenToken.logo ? this.$API.getImg(this.minetokenToken.logo) : ''
    },
    amount() {
      const tokenamount = precision(this.minetokenToken.total_supply || 0, 'CNY', this.minetokenToken.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    tokenReserve() {
      const tokenamount = precision(this.minetokenExchange.token_reserve || 0, 'CNY', this.minetokenToken.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    cnyReserve() {
      const tokenamount = precision(this.minetokenExchange.cny_reserve || 0, 'CNY', this.minetokenToken.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    volume() {
      const tokenamount = precision(this.minetokenExchange.volume_24h || 0, 'CNY', this.minetokenToken.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    change() {
      if (this.minetokenExchange.change_24h) {
        return (this.minetokenExchange.change_24h * 100).toFixed(2) + '%'
      } else return '0%'
    },
    price() {
      // const tokenamount = precision(this.minetokenExchange.price || 0, 'CNY', this.minetokenToken.decimals)
      // return this.$publishMethods.formatDecimal(tokenamount, 4)
      return this.minetokenExchange.price || 0
    },
    color() {
      // 显示转换
      const amount = parseFloat(this.change)
      if (amount < 0) return 'rgb(266, 70, 69)'
      else if (amount > 0) return 'rgb(74, 151, 42)'
      else return 'rgb(153, 153, 153)'
    }

  },
  created() {
    this.minetokenId(this.$route.params.id)
    this.minetokenGetResources(this.$route.params.id)
  },
  methods: {
    async minetokenId(id) {
      await this.$API.minetokenId(id).then(res => {
        if (res.code === 0) {
          this.minetokenToken = res.data.token || Object.create(null)
          this.minetokenUser = res.data.user || Object.create(null)
          this.minetokenExchange = res.data.exchange || Object.create(null)
        } else {
          this.$message.success(res.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    async minetokenGetResources(id) {
      await this.$API.minetokenGetResources(id).then(res => {
        if (res.code === 0) {
          const socialFilter = res.data.socials.filter(i => socialTypes.includes(i.type)) // 过滤
          const socialFilterEmpty = socialFilter.filter(i => i.content) // 过滤
          this.resourcesSocialss = socialFilterEmpty
          this.resourcesWebsites = res.data.websites
        } else {
          this.$message.success(res.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
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
    font-size: 24px;
  }
}
.token-info-sub {
  padding: 0 0 0 10px;
  margin: 0;
  a {
    color: @black;
  }
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
  flex-wrap: wrap;
}

.token-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 40px 10px 0;
  &:nth-last-child(1) {
    margin-right: 0;
  }
}
.token-num {
  font-size:20px;
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
      text-decoration: underline;
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

.not {
  color: #333;
  font-style: 14px;
  padding-top: 20px;
  display: inline-block;
}

.help-link {
  font-size: 14px;
  color: #868686;
  text-decoration: underline;
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>
