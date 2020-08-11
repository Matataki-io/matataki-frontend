<template>
  <el-popover
    v-model="model"
    placement="right-start"
    width="300"
    trigger="hover"
    :disabled="disabled"
    @show="show"
    @hide="hide"
  >
    <div v-loading="loading" class="popover">
      <router-link class="avatar-popover" :to="{name: 'token-id', params: { id: tokenId }}" target="_blank">
        <img v-if="tokenLogo" :src="tokenLogo" alt="logo">
        <img v-else :src="defaultAvatar" alt="logo">
      </router-link>
      <div class="username">
        <router-link :to="{name: 'token-id', params: { id: tokenId }}" target="_blank">
          {{ tokenInfo.name }}
        </router-link>
      </div>
      <p class="introduction">{{ tokenInfo.brief }}</p>
      <div class="user-data">
        <router-link :to="{name: 'token-id', params: { id: tokenId }}" target="_blank" class="user-data-block">
          <p class="user-data-number">{{ exchangeInfo.price || 0 }}<span>CNY</span></p>
          <p class="user-data-title">当前现价</p>
        </router-link>
        <router-link :to="{name: 'token-id', params: { id: tokenId }}" target="_blank" class="user-data-block">
          <p class="user-data-number">{{ exchangeAmount || 0 }}<span>CNY</span></p>
          <p class="user-data-title">24h成交额</p>
        </router-link>
      </div>
      <div class="user-btn">
        <router-link :to="{name: 'token-id', params: { id: tokenId }}" target="_blank">
          <span class="view">查看详情</span>
          <span class="transaction">立即交易</span>
        </router-link>
      </div>
      <div class="line" />
      <div class="user-token">
        <div class="token">
          <router-link :to="{name: 'user-id', params: { id: userInfo.id }}" target="_blank" class="token-cover">
            <img v-if="userAvatar" :src="userAvatar" alt="logo">
          </router-link>
          <div class="token-info">
            <router-link :to="{name: 'user-id', params: { id: userInfo.id }}" target="_blank" class="token-name">
              {{ userInfo.nickname || userInfo.username }}
            </router-link>
            <p class="token-introduction">{{ userInfo.introduction }}</p>
          </div>
        </div>
        <router-link class="user-go" :to="{name: 'user-id', params: { id: userInfo.id }}" target="_blank">
          <svg-icon icon-class="user_avatar_popover_go" class="icon" />
        </router-link>
      </div>
    </div>
    <slot slot="reference" />
  </el-popover>
</template>

<script>
import defaultAvatar from '@/assets/img/default_avatar.png'
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    // user id
    tokenId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      currentId: -1,
      loading: false,
      followLoading: false,
      model: false,
      disabled: false,
      defaultAvatar,
      userInfo: Object.create(null),
      tokenInfo: Object.create(null),
      exchangeInfo: Object.create(null),
    }
  },
  computed: {
    userAvatar() {
      if (!this.userInfo) return ''
      return this.userInfo.avatar ? this.$ossProcess(this.userInfo.avatar, { h: 90 }) : ''
    },
    tokenLogo() {
      if (!this.tokenInfo) return ''
      return this.tokenInfo.logo ? this.$ossProcess(this.tokenInfo.logo, { h: 60 }) : ''
    },
    exchangeAmount() {
      const tokenAmount = precision(
        this.exchangeInfo.amount_24h || 0,
        'CNY',
        this.tokenInfo.decimals
      )
      return this.$publishMethods.formatDecimal(tokenAmount, 4)
    },
  },
  mounted() {
    if (process.browser) {
      this.$nextTick(() => {
        this.isHide()
      })
    }
  },
  methods: {
    // 小屏幕隐藏
    isHide() {
      try {
        let clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        if (clientWidth < 540) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    async show() {

      // 如果传进来的和历史记录的id不一样则手动清空
      if (this.tokenId !== this.currentId) {
        this.userInfo = {}
        this.tokenInfo = {}
        this.exchangeInfo = {}
      }
      
      // 如果已经有数据了 不加载loading, 但是会请求接口来保证数据是最新的
      if (this.$utils.isNull(this.userInfo)) {
        this.loading = true
      }

      // 获取用户信息
      const res = await this.$utils.factoryRequest(this.$API.minetokenId(this.tokenId))
      if (res) {
        this.userInfo = res.data.user || {}
        this.tokenInfo = res.data.token || {}
        this.exchangeInfo = res.data.exchange || {}

        this.currentId = this.tokenId
      } else {
        this.userInfo = Object.create(null)
        this.tokenInfo = Object.create(null)
        this.exchangeInfo = Object.create(null)
      }

      this.loading = false
    },
    hide() {
      console.log('hide')
    },
  }
}
</script>

<style lang="less" scoped>
.avatar-popover {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  border: 1px solid #ddd;
  box-sizing: border-box;
  margin: 0 auto;
  display: block;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f1f1f1;
  }
}

.popover {
  padding: 8px;
  .username {
    text-align: center;
    margin: 10px 0 5px 0;
    overflow: hidden;
    a {
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
      padding: 0;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .introduction {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 17px;
    padding: 0;
    margin: 0;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .user-data {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
  .user-data-block {
    text-align: center;
    margin: 0 20px;
  }
  .user-data-number {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    padding: 0;
    margin: 0;
    span {
      font-size: 10px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 14px;
      margin-left: 5px;
    }
  }
  .user-data-title {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
    padding: 0;
    margin: 0;
  }
}
.line {
  width: 100%;
  height: 1px;
  background-color: #dbdbdb;
}

.user-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 20px;
  a {
    display: block;
    height: 30px;
    line-height: 30px;
    width: 90px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 1);
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    text-align: center;
    padding: 0;
    margin: 0 10px;
    transition: all 0.1s;
    .icon {
      font-size: 14px;
    }
    &:hover {
      background-color: #000;
      color: #fff;
      .view {
        display: none;
      }
      .transaction {
        display: inherit;
      }
    }
    .transaction {
      display: none;
    }
  }
}

.token {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}
.user-token {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.token-cover {
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  border: 1px solid #ddd;
  box-sizing: border-box;
  margin: 0 auto;
  display: block;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f1f1f1;
  }
}
.token-info {
  margin-left: 5px;
  overflow: hidden;
  flex: 1;
}
.token-name {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 17px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.token-introduction {
  font-size: 12px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 17px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-go {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  background-color: #b2b2b2;
  border-radius: 50%;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.1s;
  &:hover {
    transform: translateX(2px);
  }
  .icon {
    font-size: 12px;
  }
}
</style>
