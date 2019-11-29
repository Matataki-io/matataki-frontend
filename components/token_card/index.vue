<template>
  <div class="fl card">
    <router-link :to="{name: 'token-id', params: { id: card.id }}">
      <avatar :src="cover" size="45px" />
    </router-link>
    <div class="fl cards-content">
      <div class="card-info">
        <router-link :to="{name: 'token-id', params: { id: card.id }}">
          <h2 class="card-info-symbol">
            {{ card.symbol || '暂无' }}
          </h2>
        </router-link>
        <p class="card-info-name">
          {{ card.name || '暂无' }}
        </p>
        <p class="card-info-name">
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
        <!-- <div class="card-user-icon">
          持仓占位
        </div> -->
        <span class="card-create-time">{{ friendlyDate }}</span>
      </div>
    </div>
  </div>
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
      return this.card.logo ? this.$API.getImg(this.card.logo) : ''
    },
    coverUser() {
      return this.card.avatar ? this.$API.getImg(this.card.avatar) : ''
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
