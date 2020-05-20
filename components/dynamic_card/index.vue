<template>
  <div class="card">
    <!-- head -->
    <section class="card-head">
      <c-avatar :src="avatarImg" />
      <span class="card-name">{{ card.nickname || card.author }}</span>
      <span class="card-description">发布了新作品</span>
    </section>

    <!-- main -->
    <section class="card-main">
      <div class="card-cover">
        <img v-lazy="coverImg" alt="cover">
      </div>
      <div class="card-text">
        <h2 class="card-title">
          {{ card.title }}
        </h2>
        <p class="card-content">{{ card.short_content }}</p>
      </div>
    </section>

    <!-- footer -->
    <section class="card-footer">
      <span class="card-time">{{ time }}</span>
      <div class="card-info">
        <div class="card-info-block">
          <img
            v-if="card.require_holdtokens || card.require_buy"
            class="lock-img"
            src="@/assets/img/lock.png"
            alt="lock"
          >
          <span class="card-info-text">{{ lock }}</span>
        </div>
        <div class="card-info-block">
          <i class="el-icon-view icon" />
          <span class="card-info-text">{{ read }}</span>
        </div>
        <div class="card-info-block">
          <svg-icon icon-class="like" class="icon" />
          <span class="card-info-text">{{ likes }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    },
  },
  computed: {
    // 头像
    avatarImg() {
      return this.card.avatar ? this.$ossProcess(this.card.avatar, { h: 90 }) : ''
    },
    // 封面
    coverImg() {
      return this.card.cover ? this.$ossProcess(this.card.cover, { h: 200 }) : ''
    },
    // 时间
    time() {
      const time = moment(this.card.create_time)
      return time ? time.format('YYYY-MM-DD HH:mm:ss') : ''
    },
    likes() {
      if (!this.card || !this.card.likes) return 0
      if (this.card.likes > 9999) { return Math.round(this.card.likes / 10000) + '万' }
      return this.card.likes
    },
    read() {
      if (!this.card || !this.card.read) return 0
      if (this.card.read > 9999) { return Math.round(this.card.read / 10000) + '万' }
      return this.card.read
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
  }
}
</script>

<style lang="less" scoped>
.card {
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.card-head {
  display: flex;
  align-items: center;
}
.card-name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 22px;
  padding: 0;
  margin: 0 0 0 10px;
}
.card-description {
  font-size: 16px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 22px;
  padding: 0;
  margin: 0 0 0 10px;
}

// main
.card-main {
  margin: 20px 0;
  display: flex;
}
.card-cover {
  width: 200px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
  flex: 0 0 200px;
  border-radius: 4px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.card-text {
  margin-left: 20px;
  flex: 1;
  overflow: hidden;
  .card-title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 28px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-content {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    padding: 0;
    margin: 10px 0 0 0;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 60px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}

// footer
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-time {
  font-size: 14px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 20px;
  padding: 0;
  margin: 0;
}
.card-info {
  display: flex;
  align-items: center;
  &-block {
    margin-right: 20px;
    &:nth-last-of-type(1) {
      margin-right: 0;
    }
  }

  &-text {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    padding: 0;
    margin: 0;
  }
  .icon {
    color: rgba(178, 178, 178, 1);
    font-size: 14px;
  }
  .lock-img {
    margin: 0 4px 0 0;
    height: 14px;
  }
}
</style>