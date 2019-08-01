<template>
  <!-- 卡片适用于 个人主页设置页 -->
  <div class="card">
    <div class="cover">
      <img :src="cover" alt="cover" :onerror="defaultCover">
    </div>
    <h3 v-clampy="2" class="title">
      {{ card && card.title }}
    </h3>
    <p class="date">
      {{ time }}
      <a v-if="isDraftCard" class="del" href="javascript:;" @click.stop="$emit('del', index)">删除</a>
    </p>
  </div>
</template>

<script>
import { isNDaysAgo } from '@/utils/momentFun'

export default {
  props: {
    card: {
      type: Object,
      default: () => {}
    },
    isDraftCard: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      defaultCover: `this.src="${require('@/assets/img/article_bg.svg')}"`
    }
  },
  computed: {
    cover() {
      // console.log(this.card)
      if (!this.card) return ''
      return this.card.cover ? this.$backendAPI.getAvatarImage(this.card.cover) : ''
    },
    time() {
      if (!this.card) return ''
      const time = this.moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  width:242px;
}

.cover {
  width: 100%;
  height:121px;
  background:rgba(0,0,0,0.05);
  border-radius: @borderRadius6;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.title {
  font-size:20px;
  font-weight:500;
  color:rgba(0,0,0,1);
  line-height:28px;
  padding: 0;
  margin: 20px 0 10px 0;
  min-height: 56px;
}
.date {
  font-size:16px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:22px;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .del {
    width: 67px;
    background: #000;
    text-align: center;
    color: #fff;
    text-decoration: none;
    padding: 4px 0;
    cursor: pointer;
    border-radius: @borderRadius6;
  }
}
</style>
