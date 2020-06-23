<template>
  <div class="card">
    <router-link :to="{name: 'user-id', params: { id: card.from_uid }}" target="_blank">
      <c-avatar :src="cover" />
    </router-link>
    <router-link :to="{name: 'user-id', params: { id: card.from_uid }}" target="_blank" class="username">
      {{ card.nickname || card.username }}
    </router-link>
    <span class="action">打赏了</span>
    <router-link :to="{name: 'token-id', params: { id: card.token_id }}" target="_blank" class="token">
      {{ tokenAmount }}{{ card.symbol }}
    </router-link>
    <time class="time">{{ time }}</time>
  </div>
</template>
<script>
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    cover() {
      if (!this.card) return ''
      return this.card.avatar ? this.$ossProcess(this.card.avatar, { h: 60 }) : ''
    },
    // 时间
    time() {
      let time = this.card.create_time
      return time ? this.moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    // token amount
    tokenAmount() {
      const amount = precision(this.card.amount, 'CNY', this.card.decimals)
      return this.$publishMethods.formatDecimal(amount, 4)
    },
  },
}
</script>

<style lang="less" scoped>
.card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .username {
    font-size: 16px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
    padding: 0;
    margin: 0 10px;
    text-decoration: none;
  }
  .action {
    font-size: 16px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
    padding: 0;
    margin: 0;
  }
  .token {
    font-size: 16px;
    font-weight: 500;
    color: rgba(84, 45, 224, 1);
    line-height: 22px;
    padding: 0;
    margin: 0 10px;
    text-decoration: none;
  }
  .time {
    font-size: 16px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 22px;
    padding: 0;
    margin: 0;
  }
}
</style>