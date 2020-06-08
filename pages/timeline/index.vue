<template>
  <div class="timeline">
    <!-- banner -->
    <div v-if="isLogined && Number(userInfo.follows) > 0" class="banner">
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
        <!-- have 登录 并且 关注过人 -->
        <div v-if="isLogined && Number(userInfo.follows) > 0">
          <section class="head">
            <h3 class="head-title">
              动态时间轴
            </h3>
          </section>
          <p v-if="pull.list.length === 0" class="not-content">{{ $t('not') }}</p>
          <timelineCard
            v-for="item in pull.list"
            :key="item.id"
            class="timeline-card"
            :card="item"
          />
          <div class="load-more-button">
            <buttonLoadMore
              :type-index="0"
              :params="pull.params"
              :api-url="pull.apiUrl"
              :is-atuo-request="pull.isAtuoRequest"
              :auto-request-time="pull.autoRequestTime"
              @buttonLoadMore="buttonLoadMoreRes"
            />
          </div>
        </div>
        <!-- no 没有关注人 -->
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
            <p v-else class="welcome-description">请至少 <span>关注1位创作者</span> 以开启您的</p>
            <p class="welcome-description-time">个<span>/</span>性<span>/</span>化<span>/</span>动<span>/</span>态<span>/</span>时<span>/</span>间<span>/</span>轴</p>
            <a
              v-if="!isLogined"
              href="javascript:;"
              class="btn"
              @click="login"
            >立即登录</a>
          </div>
        </div>
      </div>
      <div class="col-3 recommend">
        <section class="head ra-head">
          <h3 class="head-title">
            {{ $t('home.recommendAuthor') }}
          </h3>
          <span class="ra-head-random" @click="usersRecommend">
            <div class="change">
              <svg-icon
                :class="usersLoading && 'rotate'"
                class="change-icon"
                icon-class="change"
              />
            </div>
            <span>{{ $t('home.random') }}</span>
          </span>
        </section>
        <div class="ra-content">
          <r-a-list
            v-for="item in usersRecommendList"
            :key="item.id"
            :card="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import throttle from 'lodash/throttle'

import { mapGetters, mapActions } from 'vuex'

import timelineCard from '@/components/timeline_card/index.vue'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import RAList from '@/components/recommend_author_list'

export default {
  components: {
    timelineCard,
    buttonLoadMore,
    RAList,
  },
  data() {
    return {
      userInfo: {}, // 用户信息
      pull: {
        params: {
          channel: 1,
          filter: null,
          extra: 'short_content'
        },
        apiUrl: 'followedPosts',
        list: [],
      },
      usersLoading: false,
      usersRecommendList: [{},{},{},{},{}],
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
  },
  watch: {
    isLogined(newState) {
      if (newState) {
        this.getCurrentUserInfo()
      }
    }
  },
  created() {
    if (process.browser) {
      if (this.isLogined) {
        this.getCurrentUserInfo()
      }

      this.usersRecommend()
    }
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
      console.log(res)
      if (res.data && res.data.list && res.data.list.length !== 0) {
        this.pull.list = this.pull.list.concat(res.data.list)
      }
    },
    // 获取推荐作者
    usersRecommend: throttle(async function () {
      this.usersLoading = true
      const params = {
        amount: 5
      }
      await this.$API
        .usersRecommend(params)
        .then(res => {
          if (res.code === 0) {
            this.usersRecommendList = res.data
          } else {
            console.log(`获取推荐用户失败${res.message}`)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.usersLoading = false
          }, 300)
        })
    }, 800),
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

  .head {
    // display: none;
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