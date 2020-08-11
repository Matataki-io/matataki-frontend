<template>
  <div class="card">
    <div class="card-info fl ac jsb">
      <span class="card-type">{{ assetType }}</span>
      <span :style="{ color: `${assetColor}` }" class="card-pricing">
        {{ assetAmount }}
      </span>
    </div>
    <div class="card-info">
      <time class="card-time">{{ $utils.formatTime(data.create_time) }}</time>
    </div>
    <div v-if="data.type !== 'recharge'" class="card-info">
      <div class="card-username">
        <span v-if="fromUsername">{{ fromUsername }}</span>
        <svg-icon v-if="fromUsername && toUsername" icon-class="transfer" class="icon" />
        <span v-if="toUsername">{{ toUsername }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    fromUsername() {
      // 如果转入 交换顺序
      if (this.data.type === 'transfer_in' && this.data.amount >= 0) {
        return this.data.to_nickname || this.data.to_username
      }
      return this.data.from_nickname || this.data.from_username
    },
    // 如果转入 交换顺序
    toUsername() {
      if (this.data.type === 'transfer_in' && this.data.amount >= 0) {
        return this.data.from_nickname || this.data.from_nickname
      }
      return this.data.to_nickname || this.data.to_username
    },
    assetAmount() {
      const pointTypes = {
        reading: '+', // 用户阅读
        beread: '+', // 读者的文章被阅读
        publish: '+', // 发布文章
        reading_new: '+', // 用户阅读新文章，额外获得的
        beread_new: '+', // 读者的新文章被阅读，额外获得的
        reading_like: '+',
        reading_dislike: '+',
        // 人民币
        recharge: '+',
        transfer_out: '',
        transfer_in: '+'
      }
      const switchType = {
        support_expenses: '',
        buy_expenses: '',
        fission_income: '+',
        referral_income: '+',
        author_sale_income: '+',
        author_supported_income: '+',
        withdraw: '',
        buyad: '',
        earn: '+',
        ...pointTypes
      }
      return switchType[this.data.type] + precision(this.data.amount, this.data.symbol) || ''
    },
    assetColor() {
      const switchType = {
        support_expenses: '#d74e5a',
        buy_expenses: '#d74e5a',
        fission_income: '#41b37d',
        referral_income: '#41b37d',
        author_sale_income: '#41b37d',
        author_supported_income: '#41b37d',
        withdraw: '#000000',
        buyad: '#d74e5a',
        earn: '#41b37d',
        // 人民币
        recharge: '#41b37d',
        transfer_out: '#d74e5a',
        transfer_in: '#41b37d'
      }
      return switchType[this.data.type] || '#41b37d'
    },
    assetTitle() {
      const { title, type } = this.data
      // 有内容显示内容
      if (title) return title
      // 没有内容根据类型判断
      if (type === 'buyad' || type === 'earn') return '来自 -Smart Billboard-'
      // 如果是广告牌
      else return '' // 防止不是广告牌 但是字段也为空
    },
    assetType() {
      // type='withdraw'：0 待处理 1已转账待确认 2成功 3失败， 4审核 5审核拒绝
      // type=其他：只有2，表示成功
      const { status, type, from_platform, to_platform } = this.data
      const switchStatus = {
        0: this.$t('assetCard.0'),
        1: this.$t('assetCard.1'),
        2: this.$t('assetCard.2'),
        3: this.$t('assetCard.3'),
        4: this.$t('assetCard.4'),
        5: this.$t('assetCard.5')
      }
      // const pointTypes = {
      //   reading: '阅读获取积分', // 用户阅读
      //   beread: '文章被阅读获取积分', // 读者的文章被阅读
      //   publish: '发布文章获取积分', // 发布文章
      //   reading_new: '阅读新文章获取积分', // 用户阅读新文章，额外获得的
      //   beread_new: '新文章被阅读获取积分', // 读者的新文章被阅读，额外获得的
      //   reading_like: '阅读获取积分',
      //   reading_dislike: '阅读获取积分',
      //   login: '回馈奖励'
      // }
      const switchType = {
        withdraw: switchStatus[status],
        support_expenses: this.$t('assetCard.support_expenses'),
        buy_expenses: this.$t('assetCard.buy_expenses'),
        fission_income: this.$t('assetCard.fission_income'),
        referral_income: this.$t('assetCard.referral_income'),
        author_sale_income: this.$t('assetCard.author_sale_income'),
        author_supported_income: this.$t('assetCard.author_supported_income'),
        buyad: this.$t('assetCard.buyad'),
        earn: this.$t('assetCard.earn'),
        // 人民币
        recharge: this.$t('assetCard.recharge'),
        transfer_out: '转账',
        transfer_in: '转账'
        // ...pointTypes
      }

      let from = from_platform ? from_platform.toLocaleLowerCase() : ''
      let to = to_platform ? to_platform.toLocaleLowerCase() : ''

      if (from === 'cny' || to === 'cny') {
        return '交易'
      }
      return switchType[type]
    },
  },
  created() {},
  methods: {
  }
}
</script>

<style scoped lang="less">
.card {
  box-sizing: border-box;
  padding: 20px 0;
  border-bottom: 1px solid #ececec;
  &:nth-last-of-type(1) {
    border: none;
  }
  &-pricing {
    font-size:20px;
    font-weight:500;
    line-height:28px;
    color: #333;
  }
  &-type {
    font-size:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:22px;
  }
  &-info {
    width: 100%;
    margin-top: 20px;
    &:nth-child(1) {
      margin-top: 0;
    }
  }
  &-username {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      font-size:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:22px;
    }
    .icon {
  margin: 0 4px;
    }
  }
  &-time {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
}

</style>
