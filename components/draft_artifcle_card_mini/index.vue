<template>
  <!-- 卡片适用于 个人主页设置页 -->
  <div class="card fl ac jsb">
    <div class="fl content">
      <div v-if="cover" class="cover">
        <img
          :src="cover"
          :onerror="defaultCover"
          alt="cover"
        >
      </div>
      <div class="fl jc fdc info">
        <h3 class="title">
          {{ card && card.title }}
        </h3>
        <p class="date">
          <span class="time">
            {{ time }}
          </span>
          <span v-if="triggerTime && triggered !== 2" class="timed">
            <svg-icon icon-class="clock" />
            {{ triggerTime }} 发布
          </span>
          <span v-if="triggered === 2" class="timed">
            <svg-icon icon-class="clock" />
            定时发布失败
          </span>
        </p>
      </div>
    </div>
    <a
      class="del"
      href="javascript:;"
      @click.stop="$emit('del', index)"
    >{{ $t('delete') }}</a>
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
      return this.card.cover ? this.$ossProcess(this.card.cover) : ''
    },
    time() {
      if (!this.card) return ''
      const time = this.moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    triggered() {
      if (!this.card) return null
      return this.card.triggered
    },
    triggerTime() {
      if (!this.card || !this.card.trigger_time) return ''
      const time = this.moment(this.card.trigger_time)
      return isNDaysAgo(-2, time) ? time.calendar() : time.format('MMMDo HH:mm')
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  background: #fff;
  border-bottom: 1px solid #ececec;
  padding: 20px;
  .content {
    flex: 1;
    overflow: hidden;
  }
  .info {
    overflow: hidden;
    margin-right: 10px;
    flex: 1;
  }
}

.cover {
  width: 120px;
  height: 60px;
  background:rgba(0,0,0,0.05);
  border-radius: @borderRadius6;
  overflow: hidden;
  margin-right: 10px;
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
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.date {
  font-size:16px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:22px;
  padding: 0;
  margin: 0;
  .time {
    min-width: 110px;
    display: inline-flex;
    white-space: nowrap;
  }
  .timed {
    margin-left: 10px;
    color:rgba(251,104,119,1);
    white-space: nowrap;
  }
}
.del {
  width: 66px;
  background: #000;
  text-align: center;
  color: #fff;
  text-decoration: none;
  padding: 4px 0;
  cursor: pointer;
  border-radius: @borderRadius6;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 16px;
    line-height: 20px;
  }
  .date {
    font-size: 12px;
    line-height:20px;
    display: flex;
    flex-direction: column;
    .timed {
      margin-left: 0;
    }
  }
}
</style>
