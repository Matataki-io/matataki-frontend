<template>
  <div class="card">
    <div class="fl card-info">
      <div class="fl">
        <div class="type">
          {{ type }}
          <txHash
            v-if="card.tx_hash"
            :hash="card.tx_hash"
            size="16px"
          />
        </div>
        <div class="time">
          {{ time }}
        </div>
        <div :class="[ 'fall-rise', amountClass(cnyAmount) ]">
          {{ cnyAmount }}
          <span class="symbol">
            CNY
          </span>
        </div>
        <div :class="[ 'fall-rise', amountClass(tokenAmount) ]">
          {{ tokenAmount }}
          <span class="symbol">
            {{ card.symbol }}
          </span>
        </div>
        <div :class="[ 'fall-rise end', amountClass(liquidityAmount) ]">
          {{ liquidityAmount }}
          <span class="symbol">
            {{ $t('liquid-gold-token') }}
          </span>
        </div>
      </div>
    </div>
    <div class="card-m">
      <div class="line line-name-time">
        <span class="card-m-type">
          {{ type }}
          <txHash
            v-if="card.tx_hash"
            :hash="card.tx_hash"
            class="card-m-icon"
            size="16px"
          />
        </span>
        <time class="card-m-time">{{ time }}</time>
      </div>
      <div class="line line-symbol">
        <span :class="amountClass(tokenAmount)" class="card-m-amount">
          {{ tokenAmount }}
          <span>
            {{ card.symbol }}
          </span>
        </span>
        <span :class="amountClass(cnyAmount)" class="card-m-amount">
          {{ cnyAmount }}
          <span>
            CNY
          </span>
        </span>
      </div>
      <div class="line line-bottom line-symbol" :class="amountClass(liquidityAmount)">
        <span class="card-m-liquidity">
          {{ liquidityAmount }}
          <span>
            {{ $t('liquid-gold-token') }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { precision } from '@/utils/precisionConversion'

import txHash from '@/components/tx_hash_popover/index'

export default {
  components: {
    txHash
  },
  props: {
    card: {
      type: Object,
      required: true
    },
  },
  computed: {
    ...mapGetters(['isMe']),
    time() {
      return this.moment(this.card.create_time).format('YYYY-MM-DD HH:mm:ss')
    },
    cnyAmount() {
      const { liquidity, cny_amount, decimals } = this.card
      let type = ''
      if (liquidity > 0) type = '-'
      if (liquidity < 0) type = '+'
      return type + this.$utils.fromDecimal(cny_amount, decimals)
    },
    tokenAmount() {
      const { liquidity, token_amount, decimals } = this.card
      let type = ''
      if (liquidity > 0) type = '-'
      if (liquidity < 0) type = '+'
      return type + this.$utils.fromDecimal(token_amount, decimals)
    },
    liquidityAmount() {
      const { liquidity, decimals } = this.card
      let type = ''
      if (liquidity > 0) type = '+'
      // 不需要判断负数
      return type + this.$utils.fromDecimal(liquidity, decimals)
    },
    cover() {
      return this.$ossProcess(this.card.logo)
    },
    username() {
      if (this.isMe(this.card.from_uid)) {
        return this.card.to_nickname || this.card.to_username
      } else if (this.isMe(this.card.to_uid)) {
        return this.card.from_nickname || this.card.from_username
      } else {
        return this.card.from_nickname || this.card.from_username
      }
    },
    amount() {
      const tokenamount = precision(this.card.amount, 'CNY', this.card.decimals)
      const amount = this.$publishMethods.formatDecimal(tokenamount, 4)

      if (this.isMe(this.card.from_uid)) {
        return '-' + amount
      } else if (this.isMe(this.card.to_uid)) {
        return '+' + amount
      } else {
        return amount
      }
    },
    color() {
      if (this.isMe(this.card.from_uid)) {
        return '#d74e5a'
      } else if (this.isMe(this.card.to_uid)) {
        return '#41b37d'
      } else {
        return '#000000'
      }
    },
    type() {
      const { liquidity } = this.card
      if (liquidity > 0) {
        return '添加流动性'
      } else {
        return '删除流动性'
      }
    }
  },
  created() {
    // console.log('card', this.card)
  },
  methods: {
    tokenClass(amount) {
      if (amount > 0) {
        return 'green'
      } else if (amount < 0) {
        return 'red'
      } else {
        return 'black'
      }
    },
    amountClass(amount) {
      amount = Number(amount)
      if (amount > 0) {
        return 'red'
      } else if (amount < 0) {
        return 'green'
      } else {
        return 'black'
      }
    }
  }
}
</script>

<style scoped lang="less">
.card {
  .card-m .line-bottom,
  .card-info {
    border-bottom: 1px solid #b2b2b2;
  }

  &:nth-last-child(1) .card-m .line-bottom,
  &:nth-last-child(1) .card-info {
    border-bottom: none;
  }
}

.solid-line {
  background-color: #b2b2b2;
  width: 900px;
  height: 1px;
  margin: 0 auto;
}
.card-info {
  flex: 1;
  flex-direction: column;
  margin: 0 20px;
  padding: 14px 0;
}
.gray {
  font-size: 14px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 22px;
}
.fall-rise {
  font-size: 16px;
  font-weight: 500;
  color: #000;
  line-height: 28px;
  width: 142px;
  &.end {
    width: 180px;
    text-align: right;
  }
}
.black {
  color: #000000;
}
.green {
  color: @green;
}
.red {
  color: @red;
}
.time {
  .gray();
  font-size: 14px;
  margin: 4px 0;
  width: 225px;
}
.type {
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 28px;
  flex: 1;
}
.symbol {
  font-size: 14px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 22px;
}

.card-m {
  display: none;
  padding: 0 20px;
  margin: 0 -20px;
  background: #f1f1f1;

  .line {
    padding: 20px 0 0px;
  }
  .line-bottom {
    padding: 20px 0 20px;
  }
  .line-name-time {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .line-symbol {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  &-name {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
    overflow: hidden;
    max-width: 120px;
    margin-right: 4px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &-type {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  &-time {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
  }
  &-icon {
    .eth_mini_icon {
      vertical-align: inherit;
    }
  }
  .card-m-amount {
    font-size: 14px;
    font-weight: 500;
    color: rgba(224, 32, 32, 1);
    line-height: 20px;
    margin-left: 10px;
    &:nth-child(1) {
      margin-left: 0;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 20px;
      margin-left: 4px;
    }
  }
  .card-m-liquidity {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 20px;
      margin-left: 4px;
    }
  }
}

@media screen and (max-width: 768px) {
  .card {
    background: #f1f1f1;
  }
  .card-info {
    display: none;
  }
  .card-m {
    display: block;
  }
}
</style>
