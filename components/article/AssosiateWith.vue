<template>
  <router-link :to="{name: 'token-id', params: {id: article.assosiate_with}}">
    <div class="token-detail" style="display: flex;">
      <c-token-popover :token-id="Number(minetokenToken.id)">
        <avatar :src="logo" size="60px" />
      </c-token-popover>
      <div class="token-detail-info">
        <div class="fl info-line">
          <div class="token-info-title bold">
            {{ minetokenToken.symbol || 'Loading...' }}
          </div>
          <div style="flex-direction: row;display: flex;align-items: center;">
            <div class="token-info-sub" style="font-size: 1.1rem">
              {{ minetokenToken.name }}
            </div>
            <div v-if="tags && tags.length !== 0" style="display: flex; margin-left: 0.5rem;">
              <div
                v-for="(tag, index) in tags" 
                :key="index" 
                class="tag-item" 
                style="margin-right:0.5rem;"
              >
                <div size="small" plain>
                  {{ tagPattern.find(item => item.label === tag.tag).name }}
                </div>
              </div>
            </div>
          </div>
          <span v-if="isLogined || balance" class="balance">
            {{ $t('token.owned') }}：{{ balance }} {{ minetokenToken.symbol }}
            <i class="el-icon-arrow-right" />
          </span>
        </div>
        <div class="fl info-line">
          <div class="token-info-title">
            {{ $t('token.founder') }}：
          </div>
          <div>
            <p class="token-info-sub">
              <c-user-popover :user-id="Number(minetokenToken.uid)">
                <router-link :to="{name: 'user-id', params: {id: minetokenToken.uid}}">
                  {{ minetokenUser.nickname || minetokenUser.username }}
                </router-link>
              </c-user-popover>
            </p>
          </div>
        </div>
        <div class="fl info-line">
          <div class="token-info-title">
            {{ $t('token.exchangePrice') }}：
          </div>
          <div style="display:flex;">
            <div class="token-info-sub">
              {{ minetokenExchange && minetokenExchange.price ? '¥ ' + minetokenExchange.price : '暂无价格' }}
            </div>
            <div>
              <div class="float">
                <span
                  v-if="float !== 0"
                  :class="float < 0 && 'red'"
                >
                  {{ float > 0 ? `+${float}` : float }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="fl info-line">
          <div
            class="token-info-title"
            v-html="$t('token.summary')"
          />
          <div>
            <p class="token-info-sub">
              {{ minetokenToken.brief || $t('not') }}
            </p>
          </div>
        </div>
        <div class="fl info-line balance-mobile">
          <div class="token-info-title">
            {{ $t('token.owned') }}：
          </div>
          <div>
            <p class="token-info-sub">
              {{ balance }} {{ minetokenToken.symbol }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  },
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      minetokenExchange: null,
      minetokenToken: {},
      minetokenUser: {},
      float: 0,
      balance: 0,
      tags: [],
      tagPattern: [
        {name:'个人', label: 'personal', checked: false}, 
        {name:'组织', label: 'organization', checked: false}, 
        {name: '产品', label: 'product', checked: false}, 
        { name: 'MEME', label: 'meme', checked: false}
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'isMe', 'currentUserInfo']),
    logo() {
      if (!this.minetokenToken.logo) return ''
      return this.minetokenToken.logo
        ? this.$ossProcess(this.minetokenToken.logo, { h: 160 })
        : ''
    },
    friendlyDate() {
      return this.moment(this.minetokenToken.create_time).format('lll')
    }
  },
  watch: {
    isLogined(val) {
      if (val) this.getUserBalance()
    }
  },
  created() {
    
  },
  mounted() {
    if(this.isLogined) this.getUserBalance()
    this.$API.minetokenId(this.article.assosiate_with).then(res => {
      this.minetokenExchange = res.data.exchange
      this.minetokenToken = res.data.token
      this.minetokenUser = res.data.user
      this.tags = res.data.tags
      if (this.minetokenExchange !== null) {
        this.float = this.percentage(this.minetokenExchange.change_24h)
      }
    })
  },
  methods: {
    percentage(num) {
      if (num) {
        const amount = (num * 100).toFixed(2)
        return Number(amount) > 0 ? `+${amount}` : amount
      } else return 0
    },
    getUserBalance() {
      this.$API.getUserBalance(this.article.assosiate_with).then(res2 => {
        const move = 10 ** 4
        this.balance = res2.data / move
      })
    }
  }
}
</script>
<style lang="less" scoped>

.balance {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  color: #542DE0;
}

.balance-mobile {
  display: none;
}

.info-btns {
  top: 70%;
  left: 72%;
  position: absolute;
}

.float {
  margin-left: 1rem;
  span {
      color: #15AD8B;
      white-space: nowrap;
      &.red {
        color: #FB6877;
      }
    }
}
.tag-item {
    width: 100%;
    height: 100%;
    padding: 1px 8px 1px;
    color: #542DE0;
    border-radius: 5px;
    background-color: #D6CDFF;
    margin-right: 0.5rem;  
}

.token-detail {
  position: relative;
  margin: 20px auto 0;
  padding: 20px;
  background: @white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}
.info-line {
  margin: 6px 0;
}
.token-detail-info {
  width: 100%;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 400;
  color: @black;
  line-height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.token-info-title {
  // width: 70px;
  flex: 0 0 80px;
  &.bold {
    font-weight: bold;
    font-size: 24px;
  }
}
.token-info-sub {
  padding: 0 0 0 10px;
  margin: 0;
  a {
    color: #542de0;
  }
}

@media screen and (max-width: 1200px) {
}

// 小于992
@media screen and (max-width: 992px) {

  .info-btns {
    position: absolute;
    left: 69%;
  }
}

// <600
@media screen and (max-width: 650px) {
  .balance {
    display: none;
  }
  .balance-mobile {
    display: flex;
  }

  .info-btns {
    position: relative;
    margin-top: 0px;
    left: 0px;
  }
  .token-detail {
    padding: 10px;
  }
  .token-detail-info {
    width: 100%;
  }
  .token-detail /deep/ .g-avatar {
    width: 60px !important;
    height: 60px !important;
    flex: 0 0 60px;
  }
  
  .token-detail-info {
    font-size: 14px;
  }

  .token-info-title.bold {
    font-size: 20px;
  }
}
</style>