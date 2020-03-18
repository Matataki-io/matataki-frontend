<template>
  <div class="card">
    <div class="card-info">
      <span class="card-type">{{ assetType }}</span>
      <h2
        :style="{ color: `${assetColor}` }"
        class="card-pricing"
      >
        {{ assetAmount }}
      </h2>
    </div>
    <div class="card-info">
      <span class="card-date">{{ friendlyDate }}</span>
    </div>
    <div class="card-info">
      <span
        v-if="!isWithdraw"
        class="card-title"
      >{{ assetTitle }}</span>
      <span
        v-else
        class="card-title"
      >
        <div
          v-if="asset.toaddress"
          class="copy-list"
          @click="copyInfo(asset.toaddress)"
        >
          {{ asset.toaddress }}
          <svg-icon
            class="icon"
            icon-class="copy"
          />
        </div>
        <div
          v-if="asset.trx"
          class="copy-list"
          @click="copyInfo(asset.trx)"
        >
          {{ asset.trx }}
          <svg-icon
            class="icon"
            icon-class="copy"
          />
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import { isNDaysAgo } from '@/common/methods';
import { precision } from '@/utils/precisionConversion'

export default {
  name: 'AssetCard',
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  computed: {
    friendlyDate() {
      // const isAppleSlave = navigator.platform.includes('iPhone');
      // const time = moment(this.asset.create_time);
      // const timeZoneOffset = moment(time.getTime() - time.getTimezoneOffset() * 60000 * (isAppleSlave ? 0 : 1));
      // return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow();

      return moment(this.asset.create_time).format('MMMDo HH:mm')
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
      return switchType[this.asset.type] + precision(this.asset.amount, this.asset.symbol) || ''
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
      return switchType[this.asset.type] || '#41b37d'
    },
    assetTitle() {
      const { title, type } = this.asset
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
      const { status, type } = this.asset
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
        transfer_out: this.$t('assetCard.transfer_out'),
        transfer_in: this.$t('assetCard.transfer_in')

        // ...pointTypes
      }
      return switchType[type]
    },
    isWithdraw() {
      return this.asset.type === 'withdraw'
    }
  },
  created() {},
  methods: {
    copyInfo(copyText) {
      this.$copyText(copyText).then(
        () => {
          this.$message.success(this.$t('success.copy'))
        },
        () => {
          this.$message.error(this.$t('error.copy'))
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.card {
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #ececec;
  &:nth-last-of-type(1) {
    border: none;
  }
  &-pricing {
    padding: 0;
    margin: 0;
    font-weight: bold;
    font-size: 22px;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-type {
    font-size: 16px;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  &-title {
    font-size: 14px;
    color:#333;
    line-height: 1.5;
    &-info {
      margin: 0 6px 0 0;
    }
    .copy-hash {
      width: 16px;
    }
  }
  &-date {
    font-size: 14px;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
}

.copy-list {
  display: flex;
  align-items: center;
  .icon {
    margin-left: 10px;
    color: #2d2d2d;
    cursor: pointer;
    font-size: 16px;
  }
}
</style>
