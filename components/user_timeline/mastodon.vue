<template>
  <div
    slot="list"
    class="listbox"
  >
    <userTimelineNav />
    <no-content-prompt
      :list="pull.list"
      :hide="loading || (unboundBilibili && isMe($route.params.id))"
      :prompt="unboundBilibili ? '未开启哔哩哔哩时间线' : undefined"
    >
      <mastodonCard
        v-for="(item, index) in pull.list"
        :key="index"
        class="timeline-card"
        :data="item"
      />
      <!-- <div v-if="!unboundBilibili" class="load-more-button">
        <buttonLoadMore
          :type-index="0"
          :params="pull.params"
          :api-url="pull.apiUrl"
          :is-atuo-request="pull.isAtuoRequest"
          return-type="Object"
          :auto-request-time="pull.autoRequestTime"
          @buttonLoadMore="buttonLoadMoreRes"
          @getDataFail="getDataFail"
        />
      </div> -->
    </no-content-prompt>
    <div v-if="unboundBilibili && isMe($route.params.id) " class="twitter-enable">
      <svg-icon icon-class="bilibili_tv" />
      <h4>
        将你的 Mastodon 动态同步展示到 Matataki
      </h4>
      <div class="twitter-enable-bind">
        <p>
          第一步：<span>使用 Matataki Auth 绑定</span>
        </p>
        <router-link :to="unboundBilibili ? { name: 'setting-account' } : {}">
          <el-button type="primary" :disabled="!unboundBilibili">
            绑定 Mastodon 账号
          </el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// import buttonLoadMore from '@/components/aggregator_button_load_more/index.vue'
import mastodonCard from '@/components/platform_status/mastodon_card'
import userTimelineNav from '@/components/user_timeline/user_timeline_nav'

import mastodonFakeData from './mastodonFakeData.json'

export default {
  components: {
    // buttonLoadMore,
    mastodonCard,
    userTimelineNav
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 12,
          start: ''
        },
        apiUrl: `${process.env.VUE_APP_MATATAKI_CACHE}/status/user-timeline/bilibili/${this.$route.params.id}`,
        list: [

        ]
      },
      loading: true, // 加载数据
      unboundBilibili: false,
      switchLoding: false,
      uuid: 0,
      mastodonFakeData: mastodonFakeData
    }
  },
  computed: {
    ...mapGetters(['isMe']),
  },
  mounted () {
    this.buttonLoadMoreRes({
      code: 0,
      data: {
        list: this.mastodonFakeData,
        count: 300
      }
    })
  },
  methods: {
    // 点击更多按钮返回的数据
    buttonLoadMoreRes(res) {
      this.loading = false
      try {
        this.uuid = Number(res.data.uuid)
        if (res.data.list && res.data.list.length !== 0) {
          console.log('[mastodon timeline]:', res.data.list)
          this.pull.list = this.pull.list.concat(res.data.list)
        }
      }
      catch (e) {
        console.error('[get bilibili timeline failure] [res, e]:', res, e)
        this.$message.error(this.$t('error.getDataError'))
      }
    },
    getDataFail(res) {
      this.loading = false
      if (!res) {
        this.$message.error(this.$t('error.getDataError'))
        return
      }
      else if (res.code === 1100) {
        this.unboundBilibili = true
      }
      else {
        console.error('[get bilibili timeline failure] res:', res)
        this.$message.error(res.message)
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
    color: #1b95e0;
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
    }
  }
}
</style>
