<template>
  <div class="buy-block">
    <div class="head">
      <span class="date">{{ buyTime }}</span>
      <span class="des">
        {{ $t('user.transactionComplete') }}
      </span>
    </div>

    <div
      :class="type === 'article' && 'no-padding'"
      class="container"
    >
      <!-- 文章卡片 其他卡片 -->
      <router-link
        :to="{name: 'p-id', params: { id: type === 'article' ? buy.id : buy.sign_id }}"
        class="cover"
      >
        <img
          v-if="buyCover"
          :src="buyCover"
          alt="cover"
        >
      </router-link>
      <div class="info">
        <router-link
          :to="{name: 'p-id', params: { id: type === 'article' ? buy.id : buy.sign_id }}"
          class="title"
        >
          {{ buy && buy.title }}
        </router-link>
        <p
          v-if="type === 'article'"
          class="author"
        >
          {{ buy && (buy.nickname || buy.author) }}
        </p>
        <p class="money">
          <template v-if="type === 'other'">
            {{ $t('user.unitPrice') }}
            {{ buyPrice }}
            {{ buy && buy.symbol }}
          &nbsp;&nbsp;
          </template>
          {{ $t('user.totalPrice') }}
          {{ buyAmount }}
          {{ amount }}
        </p>
      </div>
    </div>

    <template v-if="type === 'other'">
      <div
        v-for="(item, index) in buy && buy.digital_copy"
        :key="index"
        class="copy"
      >
        <span>{{ item }}</span>
        <svg-icon
          class="copy-button"
          icon-class="copy"
          @click.stop="copyText(item)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { precision } from '@/utils/precisionConversion'

export default {
  name: 'BuyCard',
  props: {
    buy: {
      type: Object,
      required: true
    },
    type: {// other article
      type: String,
      required: true
    }
  },
  computed: {
    buyAmount() {
      if (!this.buy) return 0
      if (this.type === 'article') return precision(this.buy.amount, this.buy.platform, this.buy.decimals) // 文章卡片
      else if (this.type === 'other') return precision(this.buy.amount, this.buy.symbol) // 其他卡片
      else return precision(this.buy.amount, this.buy.symbol) // 默认文章卡片
    },
    amount() {
      if (this.type === 'article') return this.buy && this.buy.platform.toUpperCase() // 文章卡片
      else if (this.type === 'other') return this.buy && this.buy.symbol.toUpperCase() // 其他卡片
      else return this.buy && this.buy.platform.toUpperCase() // 默认文章卡片
    },
    buyPrice() {
      if (!this.buy) return 0
      return precision(this.buy.price, this.buy.symbol) // 目前其他才有单价
    },
    buyTime() {
      if (!this.buy) return 0
      return moment(this.buy.create_time).format('lll')
    },
    buyCover() {
      if (!this.buy) return ''
      return this.buy.cover ? this.$ossProcess(this.buy.cover) : ''
    }
  },
  methods: {
    copyText(text) {
      this.$copyText(text).then(
        () => {
          this.$message({
            message: this.$t('success.copy'),
            type: 'success'
          })
        },
        () => {
          this.$message.error(this.$t('error.copy'))
        }
      )
    },
    jumpPage(id) {
      this.$router.push({ name: 'p-id', params: { id: id } })
    }
  }
}
</script>

<style lang="less" scoped>
.buy-block {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #ececec;
  &:nth-last-of-type(1) {
    border: none;
  }
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .date {
    font-size: 14px;
    font-weight:400;
    color: #333;
  }
  .des {
    font-size:16px;
    color: @purpleDark;
  }
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0 0 0;
    padding: 0 0 10px 0;
    .author {
      font-size: 14px;
      color: #333;
      padding: 0;
      margin: 0;
    }
    &.no-padding {
      padding: 0;
    }
  .cover {
    flex: 0 0 120px;
    overflow: hidden;
    width:120px;
    height:60px;
    background: #ececec;
    border: 1px solid #ececec;
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    flex: 1;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0 0 10px;
    overflow: hidden;
    .title {
      font-size: 18px;
      color:rgba(0,0,0,1);
      line-height:18px;
      padding: 0;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .money {
      width: 100%;
      font-size: 14px;
      color:rgba(0,0,0,1);
      text-align: right;
      padding: 0;
      margin: 0;
    }
  }
}
.copy {
    background: #f1f1f1;
    border-radius: 50px;
    display: flex;
    align-items: center;
    padding: 8px 10px;
    margin: 0;
    box-sizing: border-box;
    font-size: 14px;
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 14px;
      color:rgba(178,178,178,1);
    }

  .copy-button {
    color:rgba(178,178,178,1);
    font-size: 16px;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
