
<template>
  <userPage>
    <div
      slot="list"
      class="listbox"
    >
      <div v-if="screenName" class="user-mark">
        <p>
          <svg-icon icon-class="twitter" />
          Twitter:
          <a :href="`https://twitter.com/${screenName}`" target="_blank">
            @{{ screenName }}
          </a>
        </p>
        <el-dropdown
          v-if="isMe($route.params.id)"
          trigger="click"
          class="clickablebox"
          @command="dropdownCommand"
        >
          <span class="clickable">
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="closeTimeline">
              关闭推文同步
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-if="unauthorized" class="twitter-lock">
        <img src="@/assets/img/lock.png" alt="lock">
        <p>
          用户的推文受到保护，无法查看
        </p>
      </div>
      <no-content-prompt
        :list="pull.list"
        :hide="loading || unauthorized || (timelineNotOpen || unboundTwitter && isMe($route.params.id))"
        :prompt="timelineNotOpen || unboundTwitter ? '未开启 Twitter 时间线' : undefined"
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
          将你的推文同步展示到 Matataki
        </h4>
        <div class="twitter-enable-bind">
          <p>
            第一步：<span>跳转至账户页面进行绑定</span>
          </p>
          <router-link :to="unboundTwitter ? { name: 'setting-account' } : {}">
            <el-button type="primary" :disabled="!unboundTwitter">
              绑定推特账号
            </el-button>
          </router-link>
        </div>
        
        <div class="twitter-enable-bind">
          <p>
            第二步：
          </p>
          <el-button
            type="primary"
            :disabled="unboundTwitter"
            :loading="switchLoding"
            @click="switchUserTimeLine(1)"
          >
            开启推文同步
          </el-button>
        </div>
      </div>
    </div>
  </userPage>
</template>

<script>
import { mapGetters } from 'vuex'

import userPage from '@/components/user/user_page.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import twitterCard from '@/components/twitter_card'
import { extractChar } from '@/utils/reg'

export default {
  components: {
    userPage,
    buttonLoadMore,
    twitterCard
  },
  head() {
    return {
      title: `${this.userData.nickname || this.userData.username}的 Twitter 时间线`,
      meta: [
        { hid: 'description', name: 'description', content: `${this.userData.introduction}` },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: `${this.userData.nickname || this.userData.username}的 Twitter 时间线` },
        { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: `${this.userData.introduction}` },
        { hid: 'twitter:url', name: 'twitter:url', property: 'twitter:url', content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}/twitter` },
        { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.$API.getImg(this.userData.avatar) },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: '瞬MATATAKI' },
        { hid: 'og:title', name: 'og:title', property: 'og:title', content: `${this.userData.nickname || this.userData.username}的 Twitter 时间线` },
        { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', name: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}/twitter` },
        { hid: 'og:image', name: 'og:image', property: 'og:image', content: this.$API.getImg(this.userData.avatar) },
        { hid: 'og:description', name: 'description', property: 'og:description', content: `${this.userData.introduction}` }
        /* end */
      ],
    }
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
      userData: Object.create(null),
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
  async asyncData({ $axios, route, req }) {
    // 获取cookie token
    let accessToekn = ''
    // 请检查您是否在服务器端
    if (process.server) {
      const cookie = req && req.headers.cookie ? req.headers.cookie : ''
      const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
      accessToekn = token ? token[0] : ''
    }
    const res = await $axios({
      url: `/user/${route.params.id}`,
      methods: 'get',
      headers: { 'x-access-token': accessToekn }
    })
    if (res.code === 0) {
      return {
        userData: res.data || Object.create(null)
      }
    } else {
      console.error(res.message)
    }
  },
  created() {
    if (process.browser) {
      this.setWeChatShare()
    }
  },
  methods: {
    // 设置微信分享
    setWeChatShare() {
      this.$wechatShare({
        title: `${this.userData.nickname || this.userData.username}的 Twitter 时间线`,
        desc: this.userData.introduction || '暂无',
        imgUrl: this.userData.avatar ? this.$ossProcess(this.userData.avatar) : ''
      })
    },
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
      console.log(index, list.length)
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
}

.user-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  height: 58px;
  p {
    color: black;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    svg {
      color: #1b95e0;
      margin-right: 5px;
    }
    a {
      color: #1b95e0;
      text-decoration: none;
      &:hover {
        color: #1b95e0;
        text-decoration: underline;
      }
    }
  }
  .clickablebox {
    position: absolute;
    right: 20px;
  }
  .clickable {
    padding: 0 5px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    color: #99a2aa;
    line-height: 26px;
    font-size: 12px;
    white-space: nowrap;
    &:hover {
      color: #542DE0;
      background: #e5e9ef;
    }
  }
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
      width: 126px;
    }
  }
}
</style>
