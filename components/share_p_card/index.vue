<template>
  <router-link :to="cardUrl" class="card" target="_blank">
    <div v-if="card.cover" class="card-cover">
      <img :src="coverSrc" :alt="card.title">
    </div>
    <div class="card-content">
      <p :class="!shareCard && 'card-sharehall'" class="card-text">
        {{ card.title || '暂无' }}
      </p>
      <div class="card-more">
        <div v-if="cardType !== 'edit'" class="card-info">
          <span v-if="!shareCard">
            <svg-icon icon-class="eye" class="icon" />{{ card.real_read_count }}
          </span>
          <span v-if="!shareCard">
            <svg-icon icon-class="like_thin" class="icon" />{{ card.likes }}
          </span>
          <span v-if="!shareCard">
            <img
              v-if="card.pay_symbol || card.token_symbol"
              class="lock-img"
              src="@/assets/img/lock.png"
              alt="lock"
            >{{ lock }}
          </span>
        <!-- <span>
          <svg-icon icon-class="lock" class="icon"></svg-icon>120&nbsp;CNY
        </span> -->
        </div>
        <div v-if="cardType !== 'edit' && $route.name === 'sharehall'" class="card-operate">
          <svg-icon @click="copy(card.url, $event)" class="icon" icon-class="copy" />
          <svg-icon @click="ref(card.url, $event)" class="icon" icon-class="quote" />
        </div>
      </div>
    </div>
    <span v-if="!shareCard && cardType === 'edit'" @click="removeCard" class="card-remove">
      <i class="el-icon-close icon" />
    </span>
  </router-link>
</template>

<script>
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    cardType: {
      type: String,
      default: 'edit' // edit read
    },
    idx: {
      type: Number,
      default: 0
    },
    card: {
      type: Object,
      required: true
    },
    // 如果是分享卡片 隐藏删除按钮
    shareCard: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardUrl() {
      if (this.cardType === 'edit') return {}
      else return { name: 'p-id', params: { id: this.card.ref_sign_id } }
    },
    coverSrc() {
      if (this.card.cover) return this.$API.getImg(this.card.cover)
      return ''
    },
    lock() {
      if (this.card.pay_symbol) {
        return `${precision(this.card.pay_price, 'CNY', this.card.pay_decimals)} ${this.card.pay_symbol}`
      } else if (this.card.token_symbol) {
        return `${precision(this.card.token_amount, 'CNY', this.card.token_decimals)} ${this.card.token_symbol}`
      } else {
        return ''
      }
    }
  },
  methods: {
    removeCard(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      if (this.cardType !== 'edit') return
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'message-box__mobile'
      }).then(() => {
        this.$emit('removeShareLink', this.idx)
      }).catch(() => {})
      return false
    },
    copy(val, e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.$copyText(val).then(
        () => this.$message.success(this.$t('success.copy')),
        () => this.$message.error(this.$t('error.copy'))
      )
      return false
    },
    ref(val, e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.$emit('ref', val)
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  background: #EAEAEA;
  border-radius: 6px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  color: #000;
  &-cover {
    width: 120px;
    height: 60px;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 10px;
    flex: 0 0 120px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-more {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-operate {
    display: flex;
    align-items: center;
    .icon {
      cursor: pointer;
      padding: 4px 6px;
      font-size: 14px;
      color: @purpleDark;
      &:nth-child(2) {
        font-size: 16px;
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 60px;
    width: 100%;
  }
  &-text {
    font-size:15px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height:18px;
    flex: 1;
    max-height: 36px;
    overflow: hidden;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    // white-space: pre-wrap;
    white-space: normal;
    padding: 0;
    margin: 0;
    &.card-sharehall {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  &-info {
    display: flex;
    span {
      font-size:14px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
      margin-left: 10px;
      .icon {
        color:rgba(178,178,178,1);
        padding: 0;
        margin: 0 4px 0 0;
      }
      &:nth-child(1) {
        margin-left: 0;
      }
    }
  }
  &-remove {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #000;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon {
      font-size: 14px;
    }
  }
}
.lock-img {
  margin: 0 4px 0 0;
  height: 13px;
}
.lock-text {
  color: #b2b2b2;
  font-size: 14px;
  line-height: 22px;
  margin: 0 0 0 4px;
}
</style>
