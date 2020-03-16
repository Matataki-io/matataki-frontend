<template>
  <div>
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
            流动金Token
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="!end"
      class="solid-line"
    />
  </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
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
    end: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['isMe']),
    time() {
      return moment(this.card.create_time).format('MMMDo HH:mm')
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
.solid-line {
  background-color: #B2B2B2;
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
  font-size:14px;
  font-weight:400;
  color:#B2B2B2;
  line-height:22px;
}
.fall-rise {
    font-size:16px;
    font-weight:500;
    color:#000;
    line-height:28px;
    width: 142px;
    &.end {
      width: 180px;
      text-align: right;
    }
}
.black {
  color:#000000;
}
.green {
  color:@green;
}
.red {
  color:@red;
}
.time {
  .gray();
  font-size: 14px;
  margin: 4px 0;
  width: 225px;
}
.type {
  font-size:16px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:28px;
  flex: 1;
}
.symbol {
  font-size:14px;
  font-weight:400;
  color:#B2B2B2;
  line-height:22px;
}
</style>
