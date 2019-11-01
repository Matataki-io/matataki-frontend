<template>
  <div class="card">
    <div class="user-info">
      <router-link class="avatar" :to="{ name: 'token-id', params: { id: card.token_id } }">
        <avatar :src="cover" size="45px" />
      </router-link>
      <div>
        <div class="nickname">{{ card.name }}</div>
        <div class="gray">{{ type }}</div>
        <div class="time">{{ time }}</div>
      </div>
    </div>
    <div class="token-info">
      <div>
        <div :class="[ 'fall-rise', amountClass(card.liquidity) ]">{{ cnyAmount }}</div>
        <div class="gray">CNY</div>
      </div>
      <div>
        <div :class="[ 'fall-rise', amountClass(card.liquidity) ]">{{ tokenAmount }}</div>
        <div class="gray">{{ card.symbol }}</div>
      </div>
      <div>
        <div :class="[ 'fall-rise', tokenClass(card.liquidity) ]">{{ liquidityAmount }}</div>
        <div class="gray">流动金Token</div>
      </div>
    </div>
    <!-- <div class="fl card-info">
      <div class="fl jsb">
        <div class="fl fdc">
          <router-link class="username" :to="{ name: 'user-id', params: { id: id } }">
            {{ username }}
          </router-link>
          <span class="type">{{ type }}</span>
        </div>
        <span class="amount" :style="{ color: color }">{{ amount }}</span>
      </div>
      <div class="fl jsb">
        <span class="time">{{ time }}</span>
        <span class="symbol">{{ card.symbol }}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { mapGetters } from 'vuex'
import { precision } from '@/utils/precisionConversion'

import avatar from '@/components/avatar/index.vue'

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
      return this.$API.getImg(this.card.logo)
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
        return '#44D7B6'
      } else if (this.isMe(this.card.to_uid)) {
        return '#FB6877'
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #ececec;
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .avatar {
    font-size:20px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:28px;
    margin-right: 20px;
  }
}
.token-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  div {
    margin-left: 20px;
  }
}

.gray {
  font-size:16px;
  font-weight:400;
  color:#B2B2B2;
  line-height:22px;
}
.fall-rise {
  font-size:20px;
  font-weight:700;
  line-height:28px;
}
.black {
  color:#000000;
}
.green {
  color:#44D7B6;
}
.red {
  color:#FB6877;
}
.time {
  .gray();
  font-size: 14px;
}
.nickname {
  font-size: 20px;
  color: #000;
  font-weight: 400;
  line-height: 28px;
}
</style>
