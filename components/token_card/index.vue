<template>
  <router-link :to="{name: 'token-id', params: { id: card.id }}" class="fl card">
    <div>
      <avatar :src="cover" size="45px" />
    </div>
    <div class="fl cards-content">
      <div class="card-info">
        <div>
          <h2 class="card-info-symbol">
            {{ card.symbol || '暂无' }}
          </h2>
        </div>
        <p class="card-info-name">
          {{ card.name || '暂无' }}
        </p>
        <p class="card-info-name brief">
          {{ card.brief || '暂无' }}
        </p>
      </div>
      <div class="card-data">
        <div class="card-data-column">
          <p class="card-data-amount">
            {{ unitPrice }} CNY
          </p>
        </div>
        <div class="card-data-column">
          <p class="card-data-amount">
            {{ cnyReserve }} CNY
          </p>
        </div>
        <div class="card-data-column">
          <p class="card-data-amount">
            {{ exchangeAmount }} CNY
          </p>
        </div>
      </div>
      <div class="card-user">
        <router-link :to="{name: 'user-id', params: { id: card.uid }}" class="fl ac">
          <avatar :src="coverUser" size="30px" />
          <span class="card-username">{{ card.nickname || card.username }}</span>
        </router-link>
      </div>
    </div>
  </router-link>
</template>
<script>
import moment from 'moment'
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'

export default {
  components: {
    avatar
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    cover() {
      return this.card.logo ? this.$ossProcess(this.card.logo, { h: 60 }) : ''
    },
    coverUser() {
      return this.card.avatar ? this.$ossProcess(this.card.avatar, { h: 60 }) : ''
    },
    cnyReserve() {
      const tokenamount = precision(this.card.liquidity || 0, 'CNY', this.card.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    unitPrice() {
      const amount = this.card.amount || 0
      const liquidity = this.card.liquidity || 0

      if (amount === 0) return 0

      return (liquidity / amount).toFixed(this.card.decimals)
    },
    exchangeAmount() {
      const tokenamount = precision(this.card.exchange_amount || 0, 'CNY', this.card.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    friendlyDate() {
      const time = moment(this.card.create_time)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  }
}
</script>
<style lang="less" scoped>
.card {
  padding: 20px 0;
  border-bottom: 1px solid #dbdbdb;
  color: #000;
  text-decoration: none;
  // &:nth-last-child(1) {
  //   border-bottom: 1px solid #dbdbdb;
  // }
}
.cards-content {
  flex: 1;
  margin-left: 10px;
}

.card-info {
  width: 360px;
  &-symbol {
    font-size:20px;
    font-weight:400;
    color: @black;
    line-height:28px;
    padding: 0;
    margin: 0;
  }
  &-name {
    font-size:14px;
    font-weight:400;
    color:@gray;
    line-height:20px;
    padding: 0;
    margin: 4px 0 0 0;
    &.brief {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}

.card-data {
  width: calc(100% - 660px);

  &-column {
    float: left;
    width: 33%;
    height: 100%;
  }

  &-amount {
    text-align: center;
    font-size: 16px;
    margin: 0;
    line-height: 76px;
  }
}

.card-user {
  width: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: column;
}
.card-username {
  margin-left: 6px;
  font-size:14px;
  font-weight:400;
  color: @black;
  line-height:20px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}
.card-user-icon {
  display: flex;
  flex: 1;
  align-items: flex-end;
}
.card-create-time {
  margin: auto 0 0 auto;
}
</style>
