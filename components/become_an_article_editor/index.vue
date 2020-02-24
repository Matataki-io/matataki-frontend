<template>
  <div v-if="(isTokenArticle || isPriceArticle) && !isProduct" v-loading="lockLoading" class="lock">
    <div class="lock-left">
      <img v-if="!hasPaied" class="lock-img" src="@/assets/img/lock.png" alt="lock">
      <img v-else class="lock-img" src="@/assets/img/unlock.png" alt="lock">
    </div>
    <div class="lock-info">
      <h3 class="lock-info-title">
        {{ !hasPaied ? `${unlockText}编辑权限` : `已${unlockText}编辑权限` }}
      </h3>
      <h5 class="lock-info-subtitle">
        {{ !hasPaied ? '您需要达成以下解锁条件' : '您已达成以下解锁条件' }}
        <el-tooltip effect="dark" content="满足全部条件后即可编辑文章。" placement="top-start">
          <svg-icon icon-class="anser" class="prompt-svg" />
        </el-tooltip>
      </h5>
      <p v-if="!isMe(article.uid)" class="lock-info-des">
        <ul>
          <li v-if="isPriceArticle" class="fl">
            <div class="fl price">
              支付
              <span class="amount">{{ getArticlePrice }}</span>
              <svg-icon icon-class="currency" class="avatar-cny" />
              CNY
            </div>
            <el-tooltip effect="dark" content="支付解锁的文章可在“购买记录”中永久查看。" placement="left">
              <svg-icon icon-class="anser" />
            </el-tooltip>
          </li>
          <li v-if="isTokenArticle" class="fl">
            <div class="fl price">
              持有
              <span class="amount">{{ needTokenAmount }}</span>
              <router-link :to="{name: 'token-id', params:{ id:needTokenId }}" target="_blank" class="fl">
                <avatar :size="'16px'" :src="needTokenLogo" class="avatar-token" />
                {{ needTokenSymbol }}（{{ needTokenName }}）
              </router-link>
            </div>
            <!-- 不显示 - 号 -->
            <span> {{ !tokenHasPaied ? '还需持有' : '已持有' }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }} {{ needTokenSymbol }}</span>
          </li>
        </ul>
      </p>
      <p v-else class="lock-info-des">
        自己发布的文章
      </p>
      <div v-if="!hasPaied" class="lock-bottom">
        <span class="lock-bottom-total">总计约{{ totalCny }}CNY</span>
        <el-tooltip effect="dark" content="点击后支付即可一键解锁此文内容" placement="top-end">
          <el-button
            @click="wxpayArticle"
            type="primary"
            size="small"
          >
            一键{{ unlockText }}
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import moment from 'moment'
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'
import { isNDaysAgo } from '@/utils/momentFun'
import { tagColor } from '@/utils/tag'
import { xssFilter } from '@/utils/xss'

export default {
  name: 'ArticleCard',
  components: {
    avatar
  },
  props: {
    // 文章数据
    article: {
      type: Object,
      required: true
    },
    // 是否已解锁（购买）全文
    hasPaied: {
      type: Boolean,
      default: false
    },
    // 是否已解锁（购买）全文
    tokenHasPaied: {
      type: Boolean,
      default: false
    },
    differenceToken: {
      type: String,
      default: '0'
    },
    totalCny: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isTokenArticle: true,
      isPriceArticle: true,
      isProduct: false,
      lockLoading: false,
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    unlockText() {
      if (this.isPriceArticle) {
        return '购买'
      }
      return '解锁'
    },
    getArticlePrice() {
      if (this.isPriceArticle && this.article.prices[0]) {
        const ad = this.article.prices[0]
        return this.$utils.fromDecimal(ad.price)
      } else {
        return 0
      }
    },
    // 需要多少Fan票
    needTokenAmount() {
      if (this.article.tokens.length !== 0) {
        return precision(this.article.tokens[0].amount, 'CNY', this.article.tokens[0].decimals)
      } else return 0
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
    }
  },
  methods: {
    wxpayArticle() {
      this.$message.warning('警告哦，这个功能还在开发中')
    }
  }
}
</script>

<style lang="less" scoped>
.lock {
  background: #fff;
  display: flex;
  &-left {
    align-self: flex-start;
    margin-right: 10px;
  }
  .lock-img {
    width: 46px;
  }
  &-info {
    width: 100%;
    &-title {
      font-size: 22px;
      color: #000000;
      padding: 0;
      margin: 4px 0;
    }
    &-subtitle {
      font-size: 16px;
      color: #B2B2B2;
      padding: 0;
      margin: 8px 0;
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
      color:rgba(178,178,178,1);
      margin-left: 6px;
      &.amount {
        color: #000000;
        margin-left: 5;
        min-width: 36px;
      }
    }
    a {
      color:#542DE0;
    }
    .price {
      flex: 1;
    }
  }
  &-bottom {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    border-top: 1px solid #DBDBDB;
    margin-top: 10px;
    padding-top: 10px;
    &-total {
      font-size: 14px;
      color: #B2B2B2;
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
    color:#DBDBDB;
  }
}

.avatar {
  &-token {
    margin: 0 5px;
  }
  &-cny {
    margin: 0 6px;
  }
}

.prompt-svg-token { 
  padding-left: 8px;
}
</style>
