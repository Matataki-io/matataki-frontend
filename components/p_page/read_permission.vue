<template>
  <div
    v-if="(isTokenArticle || isPriceArticle) && !isProduct"
    v-loading="lockLoading"
    class="lock"
  >
    <div class="lock-left">
      <img
        v-if="!hasPaied"
        class="lock-img"
        src="@/assets/img/lock.png"
        alt="lock"
      >
      <img
        v-else
        class="lock-img"
        src="@/assets/img/unlock.png"
        alt="lock"
      >
    </div>
    <div class="lock-info">
      <h3 class="lock-info-title">
        {{ !hasPaied ? unlockText + $t('paidRead.article') : $t('paidRead.already') + unlockText + $t('paidRead.article') }}
      </h3>
      <div class="lock-info-subtitle">
        {{ !hasPaied ? $t('paidRead.needToReach') : $t('paidRead.hasBeenReached') }}
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('paidRead.meetAllConditions') "
          placement="top-start"
        >
          <svg-icon
            icon-class="anser"
            class="prompt-svg"
          />
        </el-tooltip>
      </div>
      <div
        v-if="!isMe(article.uid)"
        class="lock-info-des"
      >
        <ul>
          <li
            v-if="isPriceArticle"
            class="fl"
          >
            <div class="fl price">
              {{ $t('paidRead.pay') }}
              <span class="amount">{{ getArticlePrice }}</span>
              <template v-if="getPayToken.token_id !== 0">
                <router-link
                  :to="{name: 'token-id', params:{ id: getPayToken.token_id }}"
                  target="_blank"
                  class="fl"
                >
                  <avatar
                    :size="'16px'"
                    :src="$API.getImg(getPayToken.logo)"
                    class="avatar-token"
                  />
                  {{ getPayToken.symbol }} <template v-if="getPayToken.name">
                    （{{ getPayToken.name }}）
                  </template>
                </router-link>
              </template>
              <template v-else>
                <svg-icon
                  icon-class="currency"
                  class="avatar-cny"
                />
                {{ getPayToken.symbol }}
              </template>
            </div>
            <span>
              <span class="price-name">{{ $t('already-held') }}:</span>
              <span class="price-amount">{{ payTokenBalance }} {{ getPayToken.symbol }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('paidRead.purchaseHistory')"
                placement="left"
              >
                <svg-icon icon-class="anser" />
              </el-tooltip>
            </span>
          </li>
          <li
            v-if="isTokenArticle"
            class="fl"
          >
            <div class="fl price">
              {{ $t('paidRead.hold') }}
              <span class="amount">{{ needTokenAmount }}</span>
              <router-link
                :to="{name: 'token-id', params:{ id: needTokenId }}"
                target="_blank"
                class="fl"
              >
                <avatar
                  :size="'16px'"
                  :src="needTokenLogo"
                  class="avatar-token"
                />
                {{ needTokenSymbol }}（{{ needTokenName }}）
              </router-link>
            </div>
            <!-- 不显示 - 号 -->
            <span>
              <span class="price-name">{{ !tokenHasPaied ? $t('paidRead.stillNeedToHold') : $t('paidRead.alreadyHeld') }}</span>
              <span class="price-amount">{{ isLogined ? differenceToken.slice(1) : needTokenAmount }} {{ needTokenSymbol }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                content="只要满足持币条件随时可以查看全文"
                placement="left"
              >
                <svg-icon icon-class="anser" />
              </el-tooltip>
            </span>
          </li>
        </ul>
      </div>
      <div
        v-else
        class="lock-info-des"
      >
        {{ $t('paidRead.myArticles') }}
      </div>
      <div
        v-if="!hasPaied"
        class="lock-bottom"
      >
        <div class="btn-ccc">
          <!-- <span class="lock-bottom-total">{{ $t('paidRead.totalAbout') + totalCny }}{{$t('mttk-points')}}</span> -->
          <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('paidRead.tounlockThisArticle')"
                  placement="top-end"
                > -->
          <el-button
            type="primary"
            size="small"
            @click="wxpayArticleFn"
          >
            {{ unlockTextFull }}
            <!-- {{ $t('paidRead.oneKey') + unlockText }}全文 -->
          </el-button>
          <!-- </el-tooltip> -->
        </div>
        <!-- <NoticeCreator
                v-if="!readTokenExs"
                :tokenId="form.outputToken.id"
                :postId="article.id"
              /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar,
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    isTokenArticle: {
      type: Boolean,
      required: true
    },
    isPriceArticle: {
      type: Boolean,
      required: true
    },
    lockLoading: {
      type: Boolean,
      required: true
    },
    hasPaied: {
      type: Boolean,
      required: true
    },
    getArticlePrice: {
      type: Number,
      required: true
    },
    getPayToken: {
      type: Object,
      required: true
    },
    payTokenBalance: {
      type: Number,
      required: true
    },
    needTokenAmount: {
      type: Number,
      required: true
    },
    tokenHasPaied: {
      type: Boolean,
      required: true
    },
    isProduct: {
      type: Boolean,
      required: true
    },
    differenceToken: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      timer: null
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'isMe']),
    unlockText() {
      if (this.isPriceArticle) {
        return this.$t('p.buy')
      }
      return this.$t('p.unlock')
    },
    // Fan票ID
    needTokenId() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].id
      } else return -1
    },
    // 需要多少Fan票代号
    needTokenSymbol() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].symbol
      } else return ''
    },
    // 需要多少Fan票名称
    needTokenName() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].name
      } else return ''
    },
    // 需要多少Fan票LOGO
    needTokenLogo() {
      if (this.article.tokens.length !== 0) {
        return this.$ossProcess(this.article.tokens[0].logo)
      } else return ''
    },
    payTokenEnough() {
      return this.payTokenBalance >= this.getArticlePrice
    },
    unlockTextFull() {
      if (this.isPriceArticle) {
        if (this.payTokenEnough) return '一键购买全文'
        else return '余额不足，去购买'
      }
      return '一键解锁全文'
    },
  },
  watch: {
    lockLoading() {
      this.autoShowOrder()
    },
  },
  destroyed() {
    window.sessionStorage.removeItem('show-read-auth')
  },
  methods: {
    wxpayArticleFn() {
      if (!this.isLogined) {
        if (process.browser) {
          window.sessionStorage.setItem('show-read-auth', Date.now())
        }
        this.$store.commit('setLoginModal', true)
        return
      }
      window.sessionStorage.removeItem('show-read-auth')
      this.$emit('wxpayArticle')
    },
    // 自动显示创建订单窗口
    autoShowOrder() {
      if (process.browser) {
        if (!this.isLogined) {
          return
        }

        if (this.lockLoading) {
          return
        }

        try {
          let value = window.sessionStorage.getItem('show-read-auth')
          if (!value) {
            return
          }
          let lastTime = Math.floor(Number(value) / 1000)
          let currentTime = Math.floor(Number(Date.now()) / 1000)
          console.log('time', lastTime, currentTime)
          if (currentTime - lastTime <= 180) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.$emit('wxpayArticle')
              window.sessionStorage.removeItem('show-read-auth')
            }, 2000)
          } else {
            window.sessionStorage.removeItem('show-read-auth')
          }
        } catch (e) {
          console.log('e', e.toStriing())
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.lock {
  margin: 20px 0 0 0;
  background: #fff;
  border-radius: 4px;
  padding: 20px 20px 10px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: block;
    width: 100%;
    height: 10px;
    background: #ebe6ff;
  }
}

.lock {
  background: #fff;
  display: flex;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);
  &-left {
    align-self: flex-start;
    margin-right: 10px;
  }

  .lock-img {
    width: 36px;
  }

  &-info {
    width: 100%;

    &-title {
      font-size: 18px;
      color: #000000;
      padding: 0;
      margin: 2px 0;
      font-weight: 500;
    }

    &-subtitle {
      font-size: 14px;
      color: #b2b2b2;
      padding: 0;
      margin: 0;
      font-weight: 400;
    }
  }

  &-info-des {
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      color: rgba(178, 178, 178, 1);
      margin-left: 6px;

      &.amount {
        color: #000000;
        margin-left: 5px;
        min-width: 36px;
      }
    }

    a {
      color: #542de0;
    }

    .price {
      flex: 1;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 14px;
    }
    .price-name {
      font-size: 14px;
      margin-left: 0;
    }
    .price-amount {
      font-size: 16px;
      margin-left: 0;
    }
  }

  &-bottom {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    border-top: 1px solid #e9e9e9;
    margin-top: 10px;
    padding-top: 10px;

    &-total {
      font-size: 14px;
      color: #b2b2b2;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 0 0;
    width: 100%;

    li {
      margin-bottom: 10px;
    }
  }

  .help-icon {
    color: #dbdbdb;
  }
}

.lock-line {
  text-align: center;
  position: relative;

  .lock-text {
    font-size: 14px;
    color: #b2b2b2;
    font-weight: 400;
  }

  .icon-arrow {
    color: #b2b2b2;
  }

  .lock-line-full {
    position: absolute;
    top: -80px;
    left: 0;
    right: 0;
    background: linear-gradient(0, #fff 0, #ffffff61 100%);
    width: 100%;
    height: 70px;
  }
}
</style>