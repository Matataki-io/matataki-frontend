<template>
  <div class="mastodon-poll">
    <div v-for="(item, index) in options" :key="index" class="mastodon-poll-entry">
      <p class="mastodon-poll-entry-label">
        <span class="mastodon-poll-entry-label-percent">
          {{ getPercent(item.votes_count) }}%
        </span>
        <span class="mastodon-poll-entry-label-name">
          {{ item.title }}
        </span>
      </p>
      <el-progress
        :percentage="getPercent(item.votes_count)"
        :show-text="false"
        color="#2b90d9"
      />
    </div>
    <p class="mastodon-poll-footer">
      {{ votersCount }}人 · {{ expiresAt }}
    </p>
  </div>
</template>

<script>

export default {
  props: {
    // 卡片数据
    poll: {
      type: Object,
      required: true
    }
  },
  computed: {
    votesCount () {
      return this.poll && this.poll.votes_count || 0
    },
    votersCount () {
      return this.poll && this.poll.voters_count || 0
    },
    options () {
      return this.poll && this.poll.options || []
    },
    expiresAt () {
      if (!this.poll) return ''
      const time = this.moment(this.poll.expires_at)
      if (this.poll.expired || this.$utils.isNDaysAgo(0, time)) return '已关闭'
      if (this.$utils.isNDaysAgo(-2, time)) return time.fromNow() + '结束'
      if (this.$utils.isNDaysAgo(-365, time)) return time.format('MMMDo') + '结束'
      return time.format('YYYY MMMDo') + '结束'
    }
  },
  methods: {
    getPercent (value) {
      return Math.round(value / this.votesCount * 100) || 0
    }
  }
}
</script>

<style lang="less" scoped>
.mastodon-poll {

  &-entry {
    margin: 0 0 10px;

    &-label {
      padding: 6px 0;
      margin: 0;

      &-percent {
        width: 45px;
        display: inline-block;
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
        color: black;
      }

      &-name {
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        color: black;
      }
    }
  }

  &-footer {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: black;
  }
}
</style>