<template>
  <div class="card">
    <avatar :src="cover" size="45px" />
    <div class="fl card-info">
      <div class="fl jsb">
        <div class="fl fdc">
          <span class="username">{{ username }}</span>
          <span class="type">{{ type }}</span>
        </div>
        <span class="amount" :style="{ color: color }">{{ amount }}</span>
      </div>
      <div class="fl jsb">
        <span class="time">{{ time }}</span>
        <span class="symbol">{{ card.symbol }}</span>
      </div>
    </div>
  </div>
</template>

<script>
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
    cover() {
      if (this.isMe(this.card.from_uid)) {
        return this.card.to_avatar ? this.$API.getImg(this.card.to_avatar) : ''
      } else if (this.isMe(this.card.to_uid)) {
        return this.card.from_avatar ? this.$API.getImg(this.card.from_avatar) : ''
      } else {
        return this.card.from_avatar ? this.$API.getImg(this.card.from_avatar) : ''
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
        return '#44D7B6'
      } else if (this.isMe(this.card.to_uid)) {
        return '#FB6877'
      } else {
        return '#000000'
      }
    },
    type() {
      const { type } = this.card
      const typeList = {
        mint: '增发',
        transfer: '赠送',
        exchange_purchase: '交易所内购买',
        exchange_addliquidity: '交易所添加流动性',
        exchange_removeliquidity: '交易所删除流动性'
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
.card {
  display: flex;
  padding: 14px 20px;
  border-bottom: 1px solid #ececec;
}
.card-info {
  flex: 1;
  flex-direction: column;
  margin-left: 10px;
}
.username {
font-size:20px;
font-weight:400;
color:rgba(0,0,0,1);
line-height:28px;
}
.type {
font-size:16px;
font-weight:400;
color:rgba(178,178,178,1);
line-height:22px;
margin: 4px 0;
}
.amount {
font-size:20px;
font-weight:500;
color:#000;
line-height:28px;
}
.time {
font-size:16px;
font-weight:400;
color:rgba(178,178,178,1);
line-height:22px;
}
.symbol {
font-size:16px;
font-weight:400;
color:rgba(178,178,178,1);
line-height:22px;
}
</style>
