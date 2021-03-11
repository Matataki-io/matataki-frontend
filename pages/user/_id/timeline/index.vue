<template>
  <userPage>
    <div slot="list">
      <!-- row main -->
      <div class="row">
        <div class="recommend">
          <div class="ra-box">
            <!-- 平台筛选器 -->
            <section v-if="isLogined" class="head ra-head" @click="sidebarSwitch.filter = !sidebarSwitch.filter">
              <h3 class="head-title">
                {{ $t('platform-screening') }}
              </h3>
              <i
                class="el-icon-caret-bottom ra-head-caret"
                :class="sidebarSwitch.filter && 'ra-caret-unfold'"
              />
            </section>
            <div
              v-if="isLogined"
              v-loading="filterLoading && sidebarSwitch.filter"
              class="ra-content platform-filters"
              :class="sidebarSwitch.filter && 'ra-content-unfold'"
            >
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                class="checkbox-all"
                @change="handleCheckAllChange"
              >
                {{ $t('select-all') }}
              </el-checkbox>
              <el-divider />
              <el-checkbox-group
                v-model="checkedCities"
                class="fl checkbox-group"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="action in actionTypes"
                  :key="action.key"
                  class="checkbox"
                  :label="action.key"
                >
                  {{ action.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <!-- have 登录 -->
        <div>
          <p v-if="pull.list.length === 0 && !filterLoading" class="not-content">
            {{ actions.length > 0 ? $t('notContent') : $t('filter-item-cannot-be-empty') }}
          </p>
          <div
            v-for="(item, index) in pull.list"
            :key="index"
            class="timeline-card"
          >
            <div v-if="!item.card">
              {{ $t('error.getDataError') }}: {{ item.id }}
            </div>
            <timelineCard
              v-else-if="item.platform === 'matataki' && item.card && item.card.channel_id === 1"
              show-logo
              :card="item.card"
            />
            <dynamicCard
              v-else-if="item.platform === 'matataki' && item.card && item.card.channel_id === 3"
              :key="index"
              :data="item.card"
              @ref-push="refPush"
            />
            <twitterCard
              v-else-if="item.platform === 'twitter'"
              show-logo
              :card="item.card"
              :front-queue="item.frontQueue"
              :from-user="getSourceUser(item)"
              :stats="item.stats"
              @click-like="likeEvent"
            />
            <bilibiliCard
              v-else-if="item.platform === 'bilibili'"
              :data="item.card"
              :from-user="getSourceUser(item)"
              :stats="item.stats"
              @click-like="likeEvent"
            />
            <mastodonCard
              v-else-if="item.platform === 'mastodon'"
              :data="item.card"
              :from-user="getSourceUser(item)"
              :stats="item.stats"
              @click-like="likeEvent"
            />
            <div v-else>
              {{ $t('unsupported-platform-type') }}: {{ item.platform }}
            </div>
          </div>
          <div class="load-more-button">
            <buttonLoadMore
              :type-index="0"
              :params="pull.params"
              :api-url="pull.apiUrl"
              :is-atuo-request="pull.isAtuoRequest"
              :auto-request-time="autoRequestTime"
              @buttonLoadMore="buttonLoadMoreRes"
              @getDataFail="getDataFail"
            />
          </div>
        </div>
      </div>
      <inputDialog v-model="showInputDialog" :preset="inputDialogPreset" />
    </div>
  </userPage>
</template>

<script>
// import throttle from 'lodash/throttle'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

import { getCookie } from '@/utils/cookie'

import userPage from '@/components/user/user_page.vue'
import inputDialog from '@/components/dynamic/input_dialog'
import timelineCard from '@/components/timeline_card/index.vue'
import twitterCard from '@/components/platform_status/twitter_card'
import bilibiliCard from '@/components/platform_status/bilibili_card'
import mastodonCard from '@/components/platform_status/mastodon_card'
import buttonLoadMore from '@/components/aggregator_button_load_more/index.vue'
import dynamicCard from '@/components/dynamic/card'

export default {
  components: {
    userPage,
    inputDialog,
    timelineCard,
    twitterCard,
    bilibiliCard,
    mastodonCard,
    buttonLoadMore,
    dynamicCard
  },
  data() {
    return {
      userInfo: {}, // 用户信息
      pull: {
        params: { page: 1, filters: undefined },
        apiUrl: process.env.VUE_APP_MATATAKI_CACHE + `/status/user/timeline/${this.$route.params.id}`,
        list: [],
      },
      usersLoading: false,
      usersRecommendList: [],
      userPlatformList: [],
      userPlatformListLoading: false,
      filterLoading: true,
      isIndeterminate: true,
      checkAll: true,
      checkedCities: [],
      actionTypes: [
        {
          key: 'matataki',
          label: 'Matataki'
        },
        {
          key: 'twitter',
          label: 'Twitter'
        },
        {
          key: 'bilibili',
          label: '哔哩哔哩'
        },
        {
          key: 'mastodon',
          label: 'Mastodon'
        },
        {
          key: 'telegram_channel',
          label: 'Telegram Channel'
        }
      ],
      actions: null,
      autoRequestTime: 0,
      sidebarSwitch: {
        filter: false,
        authorList: false
      },
      showInputDialog: false,
      inputDialogPreset: null
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'isMe']),
  },
  watch: {
    isLogined(newState) {
      if (newState) {
        this.getCurrentUserInfo()
        this.getUserPlatformList()
      }
    },
    actions (val) {
      this.pull.params.filters = JSON.stringify(val) || undefined
    }
  },
  created() {
    this.initActions()
    if (process.browser) {
      if (this.isLogined) {
        this.getCurrentUserInfo()
      }
    }
  },
  mounted() {

    this.getUserPlatformList()
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    async getCurrentUserInfo() {
      try {
        this.userInfo = await this.getCurrentUser()
      } catch (e) {
        console.log(e)
      }
    },
    // 点击更多按钮返回的数据
    buttonLoadMoreRes(res) {
      this.filterLoading = false
      try {
        if (res.data && res.data.list && res.data.list.length !== 0) {
          const list = []
          for (let i = 0; i < res.data.list.length; i++) {
            const entry = res.data.list[i]
            list.push({
              card: this.tryJsonParse(entry.data),
              frontQueue: [],
              id: entry.id,
              platform: entry.platform,
              platform_user: entry.platform_user,
              platform_user_id: entry.platform_user_id,
              platform_username: entry.platform_username,
              stats: {
                like: entry.like,
                liked: entry.liked
              }
              // frontQueue: this.getFrontQueue(res.data, i)
            })
            if (entry.platform === 'bilibili') {
              console.log('stype：', JSON.parse(entry.data).desc.stype)
            }
          }
          this.pull.list = this.pull.list.concat(list)
        }
      }
      catch (e) {
        console.error('[get aggregator timeline failure] [res, e]:', res, e)
        this.$message.error(this.$t('error.getDataError'))
      }
    },
    getDataFail(res) {
      this.filterLoading = false
      if (!res) {
        console.error('[get aggregator timeline failure]')
        this.$message.error('获取聚合时间线失败')
      }
      else {
        console.error('[get aggregator timeline failure] res:', res)
        this.$message.error(this.$t(res.message))
      }
    },
    tryJsonParse(str) {
      if (!str) return null
      try {
        return JSON.parse(str)
      }
      catch (e) {
        console.warn('转换动态列表 JSON 时出现错误：', e)
        return null
      }
    },
    // 获取推荐作者
    // usersRecommend: throttle(async function () {
    //   this.usersLoading = true
    //   const params = {
    //     amount: 5
    //   }
    //   await this.$API
    //     .usersRecommend(params)
    //     .then(res => {
    //       if (res.code === 0) {
    //         this.usersRecommendList = res.data
    //       } else {
    //         console.log(`获取推荐用户失败${res.message}`)
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    //     .finally(() => {
    //       setTimeout(() => {
    //         this.usersLoading = false
    //       }, 300)
    //     })
    // }, 800),
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
    async dropdownCommand(command) {
      if(command === 'deauthorize') {
        await this.deleteAuthorize(0)
      }
      else if(command === 'reauthorize') {
        this.$router.push({ name: 'authorize-twitter' })
      }
    },
    async deleteAuthorize() {
      try {
        await this.$API.deleteTwitterAccessToken()
        this.$message.success(this.$t('success.success'))
        this.$router.go(0)
      }
      catch (e) {
        console.error('[delete authorize failure] Error:', e)
        this.$message.error(this.$t('error.fail'))
      }
    },
    async getUserPlatformList () {
      this.userPlatformListLoading = true
      const url = process.env.VUE_APP_MATATAKI_CACHE + '/status/subscriptions'
      const headers = {}
      const accessToken = getCookie('ACCESS_TOKEN')
      if (!accessToken) return this.userPlatformListLoading = false
      if (accessToken) headers['x-access-token'] = accessToken
      try {
        const { data: res } = await axios.get(url, { headers })
        this.userPlatformList = res && res.data ? res.data : []
      }
      catch (e) {
        console.error('[Get user dplatform list failure]:', e)
        this.$message.error('获取关注者的第三方平台信息失败')
      }
      this.userPlatformListLoading = false
    },
    getSourceUser (info) {
      if (!info) return null
      switch (info.platform) {
        case 'bilibili':
          return this.userPlatformList.find(item => item.bilibili_id === info.platform_user_id)
        case 'twitter':
          return this.userPlatformList.find(item => item.twitter_name === info.platform_username)
        case 'mastodon':
          return this.userPlatformList.find(item => {
            if (!item.mastodon_uesr) return
            const fullUsername = `${item.mastodon_uesr.id}@${item.mastodon_uesr.domain.replace(/^(https?:\/\/)/gm, '')}`
            return item.mastodon_uesr && (fullUsername === info.platform_user)
          })
        default:
          return null
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.actionTypes.map(action => action.key) : []
      this.isIndeterminate = false
      this.actions = this.checkedCities
      this.updateList()
      this.updateQuery('filters', JSON.stringify(this.checkedCities))
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.actionTypes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.actionTypes.length
      this.actions = value
      this.updateList()
      this.updateQuery('filters', JSON.stringify(value))
    },
    initActions() {
      let actions = this.$route.query.filters
      if(actions) {
        this.actions = JSON.parse(this.$route.query.filters)
        this.checkedCities = this.actions
      }
      else {
        this.checkedCities = this.actionTypes.map(action => action.key)
        this.actions = this.checkedCities
      }
      this.isIndeterminate = this.checkedCities.length > 0 && this.checkedCities.length < this.actionTypes.length
      this.checkAll = this.checkedCities.length === this.actionTypes.length
    },
    updateQuery(key, val) {
      const query = { ...this.$route.query }
      query[key] = val
      this.$router.replace({ query })
    },
    updateList() {
      this.filterLoading = true
      this.pull.list = []
      this.autoRequestTime = Date.now()
    },
    async likeEvent({type, platform, dynamicId}) {
      const url = process.env.VUE_APP_MATATAKI_CACHE + '/status/interactive/' + type
      const headers = {}
      const accessToken = getCookie('ACCESS_TOKEN')
      if (!accessToken) return this.$t('error.pleaseLogin')
      if (accessToken) headers['x-access-token'] = accessToken

      try {
        const { data: res } = await axios.post(url, { platform, dynamicId }, { headers })
        if (!res.code) {
          this.$message.success(this.$t('likeSuccess'))
        }
        else this.$message.error(res.error)
      }
      catch (e) {
        console.error('[Like failed]:', e)
        this.$message.error(this.$t('fail'))
      }
    },
    refPush(url) {
      this.inputDialogPreset = {
        reference: url
      }
      this.showInputDialog = true
    }
  }
}
</script>


<style lang="less" scoped>
.head {
  height: 24px;
  margin: 10px 20px 10px;

  &-title {
    margin: 0;
    padding: 0;
    font-size: 15px;
  }
}

.recommend {
  .ra-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    .change {
      width: 20px;
      height: 20px;
      background: @purpleDark;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
      &-icon {
        width: 72%;
      }
    }
    .ra-head-random {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      color: @purpleDark;
      cursor: pointer;
    }
    &-caret {
      display: inline;
      font-size: 20px;
      transition: transform 0.4s;
      &.ra-caret-unfold {
        transform: rotate(180deg);
      }
    }
  }
  .ra-box {
    transition: all ease 0.3s;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 1);
    border-radius: @br10;
    overflow: hidden;
    .ra-content {
      transition: all ease 0.3s;
      padding: 0 20px 0;
      max-height: 0;
      &.ra-content-unfold {
        max-height: 115px;
        padding: 0 20px 10px;
      }
    }
  }

  @keyframes turn{
    0%{transform:rotate(0deg);}
    100%{transform:rotate(-360deg);}
  }
}

.row {
  max-width: 766px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 40px;
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotate {
  animation: rotate 0.8s ease-in-out infinite;
}

.home-banner {
  margin-top: 10px;
}

.timeline-card {
  margin-top: 20px;
}

.not-content {
  text-align: center;
  margin: 40px 0 0 0;
  font-size: 16px;
  color: #333;
  letter-spacing: 1px;
}

.topnav {
  display: flex;
  align-items: center;
  &-tag {
    margin-right: 20px;
    color: black;
    a {
      color: #B2B2B2;
      &:hover {
        color: #737373;
      }
    }
  }
}

.apply-authorize {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0 40px;
  padding: 0 20px;
  p {
    text-align: center;
  }
}

.flex-support {
  flex: 1;
}

.clickable {
  padding: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  color: black;
  line-height: 26px;
  font-size: 12px;
  white-space: nowrap;
  margin-right: 5px;
  &:hover {
    color: #542DE0;
    background: #e5e9ef;
  }
}

.user-platform-list {
  max-height: 330px;
  min-height: 45px;
  overflow-y: auto;
  padding: 20px 14px 20px 20px !important;

  &::-webkit-scrollbar {
    width: 17px;
    height: 18px;
  }
  &::-webkit-scrollbar-thumb {
      height: 6px;
      border: 4px solid rgba(0, 0, 0, 0);
      background-clip: padding-box;
      border-radius: 20px;
      -webkit-border-radius: 20px;
      background-color: rgba(0, 0, 0, 0.15);
      box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05);
      -webkit-box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05);
  }
  &::-webkit-scrollbar-button {
      width: 0;
      height: 0;
      display: none;
  }
  &::-webkit-scrollbar-corner {
      background-color: transparent;
  }
}

.platform-filters {
  .checkbox-group {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 90px);
    grid-gap: 10px;

    .checkbox {
      margin-top: 5px;
    }
  }

  .checkbox-all {
    margin: 0;
  }

  .el-divider--horizontal {
    margin: 10px 0;
  }
}

// 页面小于
@media screen and (max-width: 1350px) {
  .recommend {
    .ra-box-rimless {
      margin-right: 90px;
    }
  }
}

@media screen and (max-width: 600px) {
  .timeline-card {
    margin-top: 10px;
  }
}

@media screen and (max-width: 520px) {
  .banner-title {
    font-size: 18px;
    line-height: 24px;
  }
  .banner-description {
    font-size: 12px;
    line-height: 14px;
    margin: 10px 0 0 0;
  }
  .welcome {
    align-items: center;
    padding-right: 0;
  }
  .welcome-text {
    text-align: center;
  }
  .welcome-people {
    display: none;
  }
  .welcome-description-time {
    margin-right: 0;
  }
}
</style>