<template>
  <div
    slot="list"
    class="listbox"
  >
    <userTimelineNav :screen-name="screenName" />
    <div v-if="unauthorized" class="twitter-lock">
      <img src="@/assets/img/lock.png" alt="lock">
      <p>
        {{ $t('users-tweets-are-protected-and-cannot-be-viewed') }}
      </p>
    </div>
    <no-content-prompt
      :list="pull.list"
      :hide="loading || unauthorized || (timelineNotOpen || unboundTwitter && isMe($route.params.id))"
      :prompt="timelineNotOpen || unboundTwitter ? $t('twitter-timeline-not-open') : undefined"
    >
      <twitterCard
        v-for="(item, index) in pull.list"
        :key="index"
        class="timeline-card"
        :card="item.card"
        :front-queue="item.frontQueue"
      />
      <div v-if="!unauthorized && !timelineNotOpen && !unboundTwitter" class="load-more-button">
        <buttonLoadMore
          :type-index="0"
          :params="pull.params"
          :api-url="pull.apiUrl"
          :is-atuo-request="pull.isAtuoRequest"
          return-type="Array"
          :auto-request-time="pull.autoRequestTime"
          @buttonLoadMore="buttonLoadMoreRes"
          @getDataFail="getDataFail"
        />
      </div>
    </no-content-prompt>
    <div v-if="(timelineNotOpen || unboundTwitter) && isMe($route.params.id) " class="twitter-enable">
      <svg-icon icon-class="twitter" />
      <h4>
        {{ $t('simultaneously-show-your-tweets-to-Matataki') }}
      </h4>
      <div class="twitter-enable-bind">
        <p>
          {{ $t('first-step') }}：<span>{{ $t('jump-to-the-account-page-to-bind') }}</span>
        </p>
        <router-link :to="unboundTwitter ? { name: 'setting-account' } : {}">
          <el-button type="primary" :disabled="!unboundTwitter">
            {{ $t('bind-twitter-account') }}
          </el-button>
        </router-link>
      </div>

      <div class="twitter-enable-bind">
        <p>
          {{ $t('second-step') }}：
        </p>
        <el-button
          type="primary"
          :disabled="unboundTwitter"
          :loading="switchLoding"
          @click="switchUserTimeLine(1)"
        >
          {{ $t('turn-on-tweet-sync') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import buttonLoadMore from '@/components/button_load_more/index.vue'
import twitterCard from '@/components/platform_status/twitter_card'
import userTimelineNav from '@/components/user_timeline/user_timeline_nav'

export default {
  components: {
    buttonLoadMore,
    twitterCard,
    userTimelineNav
  },
  data() {
    return {
      pull: {
        params: {
          userId: this.$route.params.id,
          maxId: 0
        },
        apiUrl: 'getTwitterUserTimeline',
        list: []
      },
      loading: true, // 加载数据
      unauthorized: false,
      screenName: '',
      unboundTwitter: false,
      timelineNotOpen: false,
      switchLoding: false
    }
  },
  computed: {
    ...mapGetters(['isMe']),
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMoreRes(res) {
      this.loading = false
      try {
        this.screenName = res.data.screen_name
        if (res.data.list && res.data.list.length !== 0) {
          if (!this.pull.params.maxId) this.pull.params.maxId = res.data.list[0].id

          const list = []
          for (let i = 0; i < res.data.list.length; i++) {
            list.push({
              card: res.data.list[i],
              frontQueue: this.getFrontQueue(res.data.list, i)
            })
          }
          this.pull.list = this.pull.list.concat(list)
        }
      }
      catch (e) {
        console.error('[get twitter timeline failure] [res, e]:', res, e)
        this.$message.error(this.$t('error.getDataError'))
      }
    },
    getDataFail(res) {
      this.loading = false
      if (!res) {
        this.$message.error(this.$t('error.getDataError'))
        return
      }

      if (res.code === 11503) {
        this.unauthorized = true
      }
      else if (res.code === 11504) {
        this.unboundTwitter = true
      }
      else if (res.code === 11505) {
        this.timelineNotOpen = true
      }
      else {
        console.error('[get twitter timeline failure] res:', res)
        this.$message.error(res.message)
      }

      if (res && res.data) this.screenName = res.data.screen_name || ''
    },
    getFrontQueue(list, index) {
      let replyId = list[index].in_reply_to_status_id
      const resQueue = []
      for(let i = index + 1; i < list.length; i++) {
        if (!replyId) break
        if (list[i].id === replyId) {
          replyId = list[i].in_reply_to_status_id
          resQueue.unshift(list.splice(i, 1)[0])
          i-- // 修正因为 splice 导致的索引位移
        }
      }
      return resQueue
    },
    async switchUserTimeLine(timelineSwitch = 1) {
      try {
        this.switchLoding = true
        await this.$API.setTwitterUserTimeLineSwitch(timelineSwitch)
        this.$message.success(this.$t('success.success'))
        this.$router.go(0)
      }
      catch (e) {
        console.error('[switch user timeline failure] Error:', e)
        this.$message.error(this.$t('error.fail'))
        this.switchLoding = false
      }
    },
    async dropdownCommand(command) {
      if(command === 'closeTimeline') {
        await this.switchUserTimeLine(0)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  padding: 40px 5px;
}

.timeline-card {
  margin: 20px 0;
}

.listbox {
  padding-bottom: 1px;
  max-width: 766px;
  margin: 0 auto;
}

.twitter-lock {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0px 40px;
  img {
    height: 80px;
  }
  p {
    margin: 10px 0 0;
    color: #b2b2b2;
  }
}

.twitter-enable {
  margin: 40px 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  background: #ffffff;
  padding: 30px 20px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;

  svg {
    color: #00ACED;
    font-size: 50px;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 18px;
    margin: 0 0 0;
  }

  &-bind {
    width: 210px;
    margin: 20px 0 0;
    p {
      color: black;
      font-size: 16px;
      span {
        font-size: 12px;
        color: #b2b2b2;
      }
    }

    button {
      display: block;
      margin: 0 auto;
      width: 126px;
    }
  }
}
</style>
