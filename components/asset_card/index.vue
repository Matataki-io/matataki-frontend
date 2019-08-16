<template>
  <div class="card">
    <div class="card-info">
      <span class="card-type">{{ assetType }}</span>
      <h2 class="card-pricing" :style="{ color: `${assetColor}` }">
        {{ assetAmount }}
      </h2>
    </div>
    <div class="card-info">
      <span class="card-date">{{ friendlyDate }}</span>
    </div>
    <div class="card-info">
      <span v-if="!isWithdraw" class="card-title">{{ assetTitle }}</span>
      <span v-else class="card-title">
        <div
          v-if="asset.toaddress"
          class="copy-list"
          @click="copyInfo(asset.toaddress)"
        >
          {{ asset.toaddress }}
          <div class="copy">
            <svg-icon class="icon" icon-class="copy" />
            复制
          </div>
        </div>
        <div
          v-if="asset.trx"
          class="copy-list"
          @click="copyInfo(asset.trx)"
        >
          {{ asset.trx }}
          <div class="copy">
            <svg-icon class="icon" icon-class="copy" />
            复制
          </div>
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
        reading_dislike: '+'
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
        support_expenses: '#44D7B6',
        buy_expenses: '#44D7B6',
        fission_income: '#FB6877',
        referral_income: '#FB6877',
        author_sale_income: '#FB6877',
        author_supported_income: '#FB6877',
        withdraw: '#000000',
        buyad: '#44D7B6',
        earn: '#FB6877'
      }
      return switchType[this.asset.type] || '#FB6877'
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
        0: '提现待处理',
        1: '提现待确认',
        2: '提现成功',
        3: '提现失败',
        4: '提现审核中',
        5: '提现审核失败'
      }
      const pointTypes = {
        reading: '阅读获取SS积分', // 用户阅读
        beread: '文章被阅读获取SS积分', // 读者的文章被阅读
        publish: '发布文章获取SS积分', // 发布文章
        reading_new: '阅读新文章获取SS积分', // 用户阅读新文章，额外获得的
        beread_new: '新文章被阅读获取SS积分', // 读者的新文章被阅读，额外获得的
        reading_like: '阅读获取SS积分',
        reading_dislike: '阅读获取SS积分'
      }
      const switchType = {
        withdraw: switchStatus[status],
        support_expenses: '投资支出',
        buy_expenses: '购买支出',
        fission_income: '投资裂变收入',
        referral_income: '推荐收入',
        author_sale_income: '销售收入',
        author_supported_income: '被投资收入',
        buyad: '公告牌支出',
        earn: '公告牌收入',
        ...pointTypes
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
          this.$message({
            message: '复制成功',
            type: 'success'
          })
        },
        () => {
          this.$message.error('复制失败')
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.card {
  margin: 10px 0;
  box-sizing: border-box;
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #DBDBDB;
  &:nth-last-of-type(1) {
    border: none;
  }
  &-pricing {
    padding: 0;
    margin: 0;
    font-size:20px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-type {
    font-size:18px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:28px;
  }
  &-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &-title {
    font-size:16px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:22px;
    &-info {
      margin: 0 6px 0 0;
    }
    .copy-hash {
      width: 16px;
    }
  }
  &-date {
    font-size:16px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:22px;
  }
}

.copy-list {
  display: flex;
  align-items: center;
  .copy {
    border-radius: 20px;
    margin-left: 6px;
    background: #dbdbdb;
    color: #fff;
    padding: 2px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    .icon {
      margin-right: 4px;
    }
  }
}
</style>
