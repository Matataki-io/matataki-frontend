<template>
  <div class="timeline">
    <!-- banner -->
    <div v-if="isLogined" class="banner">
      <section class="banner-main">
        <h2 class="banner-title">
          欢迎加入瞬Matataki
        </h2>
        <h2 class="banner-title bold">
          一个 <span>公开</span> <span>永存</span> 的数字作品库
        </h2>
        <p class="banner-description">个<span>/</span>性<span>/</span>化<span>/</span>动<span>/</span>态<span>/</span>时<span>/</span>间<span>/</span>轴</p>
        <img src="@/assets/img/dynamic_banner_people.png" alt="people" class="banner-people">
        <img src="@/assets/img/dynamic_banner_decoration.png" alt="decoration" class="banner-decoration">
      </section>
    </div>
    <!-- row main -->
    <div class="row">
      <div class="col-6">
        <!-- have 登录 -->
        <div v-if="isLogined">
          <section class="head topnav">
            <h3 class="head-title topnav-tag">
              <router-link :to="{ name: 'timeline' }">
                {{ $t('timeline.timeline') }}
              </router-link>
            </h3>
            <h3 class="head-title topnav-tag">
              第三方时间轴
            </h3>
            <div class="flex-support" />
            <!-- <el-dropdown
              v-if="!unauthorized"
              trigger="click"
              @command="dropdownCommand"
            >
              <span class="clickable">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="reauthorize">
                  更换 Twitter 授权
                </el-dropdown-item>
                <el-dropdown-item command="deauthorize">
                  取消 Twitter 授权
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </section>
          <div v-if="unauthorized" class="apply-authorize">
            <p>
              授权你的 Twitter 账号，在 Matataki 浏览你的 Twitter 时间轴。
            </p>
            <router-link :to="{ name: 'authorize-twitter' }">
              <el-button
                type="primary"
              >
                <svg-icon icon-class="twitter" />
                授权 Twitter 账号
              </el-button>
            </router-link>
          </div>
          <p v-if="pull.list.length === 0 && !unauthorized && !filterLoading" class="not-content">
            {{ actions.length > 0 ? $t('notContent') : '筛选项不能为空' }}
          </p>
          <div
            v-for="(item, index) in pull.list"
            :key="index"
            class="timeline-card"
          >
            <twitterCard
              v-if="item.platform === 'twitter'"
              show-logo
              :card="item.card"
              :front-queue="item.frontQueue"
              :from-user="getSourceUser(item)"
            />
            <bilibiliCard
              v-else-if="item.platform === 'bilibili'"
              :data="item.card"
              :from-user="getSourceUser(item)"
            />
            <div v-else>
              不支持的平台类型: {{ item.platform }}
            </div>
          </div>
          <div v-if="!unauthorized" class="load-more-button">
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
        <!-- no 没有登录 -->
        <div v-else class="welcome">
          <!-- -- -->
          <img src="@/assets/img/dynamic_banner_people.png" alt="" class="welcome-people">
          <h2 class="welcome-title">
            欢迎加入瞬Matataki
          </h2>
          <h2 class="welcome-title">
            一个 <span>公开</span> <span>永存</span> 的数字作品库
          </h2>

          <div class="welcome-text">
            <p v-if="!isLogined" class="welcome-description">请 <span @click="login">登录</span> 后查看您的</p>
            <p class="welcome-description-time">个<span>/</span>性<span>/</span>化<span>/</span>动<span>/</span>态<span>/</span>时<span>/</span>间<span>/</span>轴</p>
            <a
              v-if="!isLogined"
              href="javascript:;"
              class="btn"
              @click="login"
            >{{ $t('home.signIn') }}</a>
          </div>
        </div>
      </div>
      <div class="col-3 recommend">
        <!-- 推荐用户列表 -->
        <!-- <section class="head ra-head">
          <h3 class="head-title">
            {{ $t('home.recommendAuthor') }}
          </h3>
          <div class="ra-head-random" @click="usersRecommend">
            <div class="change">
              <svg-icon
                :class="usersLoading && 'rotate'"
                class="change-icon"
                icon-class="change"
              />
            </div>
            <span>{{ $t('home.random') }}</span>
          </div>
        </section>
        <div class="ra-content">
          <r-a-list
            v-for="item in usersRecommendList"
            :key="item.id"
            :card="item"
          />
        </div> -->

        <!-- 平台筛选器 -->
        <section v-if="isLogined" class="head ra-head">
          <h3 class="head-title">
            平台筛选
          </h3>
        </section>
        <div v-if="isLogined" v-loading="filterLoading" class="ra-content platform-filters">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            class="checkbox-all"
            @change="handleCheckAllChange"
          >
            全选
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

        <!-- 已关注的用户列表 -->
        <section class="head ra-head">
          <h3 class="head-title">
            已关注的跨平台作者
          </h3>
        </section>
        <div v-loading="userPlatformListLoading" class="ra-content user-platform-list">
          <userPlatformCard
            v-for="(item, index) in userPlatformList"
            :key="index"
            :card="item"
          />
          <p v-if="userPlatformList.length === 0 && !userPlatformListLoading" style="margin: revert;" class="not-content">{{ $t('not') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import throttle from 'lodash/throttle'
import axios from 'axios'

import { mapGetters, mapActions } from 'vuex'

import { getCookie } from '@/utils/cookie'

import twitterCard from '@/components/platform_status/twitter_card'
import bilibiliCard from '@/components/platform_status/bilibili_card'
import buttonLoadMore from '@/components/aggregator_button_load_more/index.vue'
// import RAList from '@/components/recommend_author_list'
import userPlatformCard from '@/components/user/user_platform_card'

export default {
  components: {
    twitterCard,
    bilibiliCard,
    buttonLoadMore,
    // RAList,
    userPlatformCard
  },
  data() {
    return {
      userInfo: {}, // 用户信息
      pull: {
        params: { page: 1, network: '', filters: undefined },
        apiUrl: 'https://cache.ayaka.moe/matataki/status/timeline',
        list: [],
      },
      usersLoading: false,
      usersRecommendList: [{},{},{},{},{}],
      unauthorized: false,
      userPlatformList: [],
      userPlatformListLoading: false,
      filterLoading: true,
      isIndeterminate: true,
      checkAll: true,
      checkedCities: [],
      actionTypes: [
        {
          key: 'twitter',
          label: 'Twitter'
        },
        {
          key: 'bilibili',
          label: '哔哩哔哩'
        }
      ],
      actions: null,
      autoRequestTime: 0,
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'isMe']),
  },
  watch: {
    isLogined(newState) {
      if (newState) {
        this.getCurrentUserInfo()
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
    this.pull.params.network = this.$utils.getNetwork(window)
    if (this.pull.params.network === 'dev') this.pull.params.network = 'test'

    this.getUserPlatformList()
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    login() {
      try {
        this.$store.commit('setLoginModal', true)
      } catch (e) {
        console.log(e)
      }
    },
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
            list.push({
              card: JSON.parse(res.data.list[i].data),
              frontQueue: [],
              platform: res.data.list[i].platform,
              platform_user_id: res.data.list[i].platform_user_id,
              platform_username: res.data.list[i].platform_username
              // frontQueue: this.getFrontQueue(res.data, i)
            })
            if (res.data.list[i].platform === 'bilibili') {
              console.log('stype：', JSON.parse(res.data.list[i].data).desc.stype)
            }
          }
          this.pull.list = this.pull.list.concat(list)
        }
        console.log('结果：', res, this.pull.list)
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
      const url = 'https://cache.ayaka.moe/matataki/status/subscriptions'
      const headers = {}
      const accessToken = getCookie('ACCESS_TOKEN')
      if (accessToken) headers['x-access-token'] = accessToken
      try {
        const { data: res } = await axios.get(url, { params: { network: this.pull.params.network }, headers })
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
      let actions = this.$route.query.actions
      if(actions) {
        this.actions = JSON.parse(this.$route.query.actions)
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
  }
}
</script>


<style lang="less" scoped>

._mv() {
  max-width: 1200px;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: auto;
  margin-right: auto;
}

.banner {
  ._mv();
  box-sizing: border-box;
  height: 240px;
  margin-top: 40px;

  &-main {
    height: 100%;
    background-color: #ece7ff;
    border-radius: 10px;
    position: relative;
    text-align: center;
    background-image: url(../../assets/img/dynamic_banner_bc.png);
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &-people {
    position: absolute;
    left: -30px;
    top: -20px;
    height: calc(100% + 20px);
  }

  &-title {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 40px;
    padding: 0;
    margin: 0;
    span {
      color: #fa6400;
    }
  }

  &-description {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 10px;
    padding: 0;
    margin: 20px 0 0 0;
    color: #000;
    span {
      color: #b2b2b2;
    }
  }

  &-decoration {
    height: 70%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
.welcome {
  height: 345px;
  position: relative;
  box-sizing: border-box;
  background-color: #ece7ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 68px;
  margin-top: 44px;
  background-image: url(../../assets/img/dynamic_banner_bc.png);
  background-size: cover;
  &-people {
    position: absolute;
    left: 40px;
    top: -20px;
    height: calc(100% + 20px);
  }

  &-title {
    font-size: 24px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 40px;
    padding: 0;
    margin: 0;
    span {
      color: #fa6400;
    }
  }
  &-text {
    text-align: right;
    margin-top: 22px;
    .btn {
      display: inline-block;
      background: rgba(84, 45, 224, 1);
      border-radius: 15px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      padding: 5px 47px;
      margin: 30px 0 0 0;
      &:hover {
        background-color: mix(rgba(84, 45, 224, 1), #000, 90%);
      }
    }
  }
  &-description {
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 30px;
    padding: 0;
    margin: 0;
    span {
      color: #542de0;
      cursor: pointer;
    }
  }
  &-description-time {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    letter-spacing: 10px;
    padding: 0;
    margin: 10px -10px 0 0;
    span {
      color: #b2b2b2;
    }
  }
}

.head {
  height: 24px;
  margin-top: 20px;

  &:nth-child(1) {
    margin-top: 0;
  }

  &-title {
    margin: 0;
    padding: 0;
  }
}

.recommend {
  position: sticky;
  top: 80px;
  .ra-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  }
  .ra-content {
    background: rgba(255, 255, 255, 1);
    border-radius: @br10;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  }
}

.row {
  max-width: 1200px;
  width: 100%;
  margin: 40px auto 0;
  padding-bottom: 40px;
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
  .col-6 {
    width: 66.666%;
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
  }
  .col-3 {
    width: 33.333%;
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
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
    grid-template-columns: repeat(auto-fill, 60px);
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
@media screen and (max-width: 992px) {
  .welcome-people {
    left: -40px;
  }
}
@media screen and (max-width: 768px) {
  .row {
    .col-6 {
      width: 100%;
    }
    .col-3 {
      display: none;
    }
  }
  .banner-people {
    left: -30px;
    top: auto;
    bottom: 0;
    height: 60%;
  }
  .banner-decoration {
    height: 40%;
  }
}

@media screen and (max-width: 600px) {
  .timeline-card {
    margin-top: 10px;
  }

  .banner {
    height: 140px;
    margin-top: 20px;
  }
  .banner-title {
    font-size: 20px;
    line-height: 30px;
  }
  .banner-description {
    font-size: 14px;
    line-height: 20px;
    margin: 10px 0 0 0;
  }

  .banner-people,
  .banner-decoration {
    display: none;
  }
  .row {
    margin-top: 20px;
  }

  .welcome {
    height: 240px;
    margin-top: 0;
  }

  .welcome-people {
    top: auto;
    bottom: 0;
    height: 80%;
  }

  .welcome-title {
    font-size: 20px;
    line-height: 30px;
  }
  .welcome-text {
    margin-top: 10px;
  }
  .welcome-description {
    font-size: 14px;
    line-height: 20px;
  }
  .welcome-description-time {
    font-size: 14px;
    line-height: 20px;
    margin-top: 0;
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