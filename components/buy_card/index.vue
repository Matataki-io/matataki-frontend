<template>
  <div class="buy-block">
    <div class="head">
      <span class="date">{{ buyTime }}</span>
      <span class="des">
        {{ $t('user.transactionComplete') }}
      </span>
    </div>

    <div class="container">
      <div class="cover" @click.stop="jumpPage(buy && buy.sign_id)">
        <img v-if="buyCover" :src="buyCover" alt="cover">
      </div>
      <div class="info">
        <p class="title" @click.stop="jumpPage(buy && buy.sign_id)">
          {{ buy && buy.title }}
        </p>
        <p class="money">
          {{ $t('user.unitPrice') }}
          {{ buyPrice }}
          {{ buy && buy.symbol }}
          &nbsp;&nbsp;
          {{ $t('user.totalPrice') }}
          {{ buyAmount }}
          {{ buy && buy.symbol }}
        </p>
      </div>
    </div>

    <div v-for="(item, index) in buy && buy.digital_copy" :key="index" class="copy">
      <span>{{ item }}</span>
      <svg-icon class="copy-button" icon-class="copy" @click.stop="copyText(item)" />
    </div>
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
    }
  },
  computed: {
    buyAmount() {
      if (!this.buy) return 0
      return precision(this.buy.amount, this.buy.symbol)
    },
    buyPrice() {
      if (!this.buy) return 0
      return precision(this.buy.price, this.buy.symbol)
    },
    buyTime() {
      if (!this.buy) return 0
      return moment(this.buy.create_time).format('lll')
    },
    buyCover() {
      if (!this.buy) return ''
      return this.buy.cover ? this.$API.getImg(this.buy.cover) : ''
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
  width: 100%;
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
