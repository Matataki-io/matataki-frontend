<template>
  <div>
    <div class="fl card-info">
      <div class="fl">
        <router-link
          :to="{ name: 'user-id', params: { id: id } }"
          class="username"
        >
          {{ username || 'Zero' }}
        </router-link>
        <div class="tx-hash">
          <txHash
            v-if="card.tx_hash"
            :hash="card.tx_hash"
            size="16px"
          />
        </div>
        <div class="type">
          {{ type }}
        </div>
        <div class="time">
          {{ time }}
        </div>
        <div
          :style="{ color: color }"
          class="amount"
        >
          {{ amount }}
          <span class="symbol">
            {{ card.symbol }}
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
    id() {
      if (this.isMe(this.card.from_uid)) {
        return this.card.to_uid
      } else if (this.isMe(this.card.to_uid)) {
        return this.card.from_uid
      } else {
        return this.card.from_uid
      }
    },
    cover() {
      if (this.isMe(this.card.from_uid)) {
        return this.card.to_avatar ? this.$ossProcess(this.card.to_avatar) : ''
      } else if (this.isMe(this.card.to_uid)) {
        return this.card.from_avatar ? this.$ossProcess(this.card.from_avatar) : ''
      } else {
        return this.card.from_avatar ? this.$ossProcess(this.card.from_avatar) : ''
      }
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
      const { type } = this.card
      const typeList = {
        mint: '增发',
        transfer: '赠送',
        exchange_purchase: '交易',
        exchange_addliquidity: '添加流动性',
        exchange_removeliquidity: '删除流动性'
      }
      return typeList[type] || '其他'
    }
  },
  created() {
    // console.log('card', this.card)
  },
  methods: {}
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
.username {
  font-size:16px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:28px;
  margin-right: 4px;
}
.tx-hash {
  display: flex;
  align-items: center;
  flex: 1;
}
.type {
  font-size:14px;
  font-weight:400;
  color:#B2B2B2;
  line-height:22px;
  margin: 4px 0;
  width: 170px;
}
.amount {
  font-size:16px;
  font-weight:500;
  color:#000;
  line-height:28px;
  width: 150px;
  text-align: right;
}
.time {
  font-size:13px;
  font-weight:400;
  color:#B2B2B2;
  line-height:22px;
  width: 255px;
  margin: 4px 0;
}
.symbol {
  font-size:14px;
  font-weight:400;
  color:#B2B2B2;
  line-height:22px;
}
</style>
