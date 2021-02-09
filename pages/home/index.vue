<template>
  <div class="home">
    <!-- screen1 -->
    <section class="screen1">
      <section class="screen1-main">
        <header>
          <img src="@/assets/img/home/logo.png" alt="logo" class="logo">
          <div>
            <el-dropdown
              v-if="isLogined"
              class="user-menu"
            >
              <div class="user-avatar">
                <img
                  v-if="avatar"
                  :src="avatar"
                  alt="user avatar"
                >
              </div>
              <el-dropdown-menu
                slot="dropdown"
                class="user-dorpdown"
              >
                <n-link
                  :to="{name: 'user-id', params:{id: currentUserInfo.id}}"
                  class="link"
                >
                  <el-dropdown-item>
                    {{ currentUserInfo.nickname || currentUserInfo.name }}
                  </el-dropdown-item>
                </n-link>
                <n-link
                  :to="{name: 'setting', params:{id: currentUserInfo.id}}"
                  class="link"
                >
                  <el-dropdown-item>
                    {{ $t('home.account') }}
                  </el-dropdown-item>
                </n-link>

                <div
                  class="link"
                  @click="btnsignOut"
                >
                  <el-dropdown-item>
                    {{ $t('home.signOut') }}
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
            <a
              v-else
              href="javascript:;"
              class="login-btn"
              @click="login"
            >{{ $t('register-or-log-in') }}</a>
          </div>
        </header>
        <section class="screen1-block__text">
          <div class="screen1-block__text__content">
            <h1 v-html="$t('home-title')" />
            <p>
              {{ $t('home-introduction-1') }}
              <br>
              {{ $t('home-introduction-2') }}
            </p>
          </div>

          <section class="screen1-block__btn">
            <a href="javascript:;" class="screen1-btn create" @click="writeP">{{ $t('create-now') }}</a>
            <router-link :to="{name: 'article'}" class="screen1-btn subscribe">
              {{ $t('explore-works') }}
            </router-link>
            <!-- <a href="javascript:;" class="screen1-more">订阅我们</a> -->
          </section>
        </section>
        <section class="screen1-block__img">
          <img src="@/assets/img/home/home_screen1_img.png" alt="img">
        </section>
      </section>

      <div class="screen1-bc">
        <img src="@/assets/img/home/home_screen1_icon1.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon2.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon3.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon4.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon5.png" alt="icon">
        <img src="@/assets/img/home/home_screen1_icon6.png" alt="icon">
      </div>
    </section>

    <!-- screen2 -->
    <section class="screen2">
      <h3 class="screen-title">
        {{ $t('tas-are-also-using-Matataki') }}
      </h3>
      <section class="screen2-content">
        <el-carousel
          v-if="swipeMode === 'double'"
          class="swipe-carousel"
          :height="swipeHeight"
          indicator-position="outside"
          trigger="click"
          :interval="5000"
        >
          <el-carousel-item v-for="item in Math.ceil(supporters.length / 2)" :key="item">
            <div class="swipe">
              <template>
                <div v-for="(supporter, index) in supportersX2(item)" :key="index" class="swipe-block">
                  <!-- <div class="swipe-tag">
                    已入驻365天
                  </div> -->

                  <router-link :to="{name: 'user-id', params: { id: supporter.id } }" target="_blank">
                    <section class="swipe-head">
                      <c-avatar :src="imgUrl(supporter.avatar)" />
                      <section class="swipe-head-info">
                        <p class="swipe-info-title">{{ supporter.nickname }}</p>
                        <p class="swipe-info-sub">{{ supporter.signature }}</p>
                      </section>
                    </section>
                  </router-link>
                  <p class="swipe-text">
                    {{ supporter.slogan }}
                  </p>
                  <div class="swipe-line" />
                  <p class="swipe-publish">
                    <span>{{ supporter.numPosts }}</span>{{ $t('articles-published') }}
                  </p>
                  <router-link :to="{name: 'p-id', params: { id: supporter.post.id } }" target="_blank">
                    <div class="swipe-article">
                      <div class="swipe-article-full" />
                      <img :src="imgUrl(supporter.post.cover)" alt="cover">
                      <p class="swipe-article-text">{{ supporter.post.title }}</p>
                    </div>
                  </router-link>
                </div>
              </template>
            </div>
          </el-carousel-item>
        </el-carousel>
        <el-carousel
          v-if="swipeMode === 'single'"
          class="swipe-carousel"
          :height="swipeHeight"
          indicator-position="outside"
          trigger="click"
          :interval="5000"
        >
          <el-carousel-item v-for="(supporter, index) in supporters" :key="index">
            <div class="swipe">
              <template>
                <div class="swipe-block single">
                  <!-- <div class="swipe-tag">
                    已入驻340天
                  </div> -->

                  <router-link :to="{name: 'user-id', params: { id: supporter.id } }" target="_blank">
                    <section class="swipe-head">
                      <c-avatar :src="imgUrl(supporter.avatar)" />
                      <section class="swipe-head-info">
                        <p class="swipe-info-title">{{ supporter.nickname }}</p>
                        <p class="swipe-info-sub">{{ supporter.signature }}</p>
                      </section>
                    </section>
                  </router-link>
                  <p class="swipe-text">
                    {{ supporter.slogan }}
                  </p>
                  <div class="swipe-line" />
                  <p class="swipe-publish">
                    <span>{{ supporter.numPosts }}</span>{{ $t('articles-published') }}
                  </p>
                  <router-link :to="{name: 'p-id', params: { id: supporter.post.id } }" target="_blank">
                    <div class="swipe-article">
                      <div class="swipe-article-full" />
                      <img :src="imgUrl(supporter.post.cover)" alt="cover">
                      <p class="swipe-article-text">{{ supporter.post.title }}</p>
                    </div>
                  </router-link>
                </div>
              </template>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>
    </section>

    <!-- screen3 -->
    <section class="screen3">
      <div class="screen3-bc">
        <img src="@/assets/img/home/home_screen3_icon1.png" alt="icon">
      </div>
      <h3 class="screen-title">
        {{ $t('why-create-on-Matataki') }}
      </h3>
      <section class="screen3-content">
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_1.png" alt="icon">
          <h4>{{ $t('save-forever') }}<br>{{ $t('just-publish-with-confidence') }}</h4>
          <p>{{ $t('no-need-to-worry-about-being-harmonized-The-content-you-create-is-permanently-stored-on-the-IPFS-distributed-network-and-cannot-be-modified-again-by-anyone-which-is-convenient-for-future-rights-protection-on-other-platforms') }}。</p>
        </section>
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_2.png" alt="icon">
          <h4>{{ $t('free-creation') }}<br>{{ $t('standard-retractable') }}</h4>
          <p>{{ $t('powerful-content-editor-no-one-can-influence-your-creative-freedom-everything-is-under-your-control-You-can-also-allow-your-true-fans-the-privilege-of-making-suggestions-to-yourself') }}</p>
        </section>
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_3.png" alt="icon">
          <h4>{{ $t('personal-pass') }}<br>{{ $t('digital-social-currency') }}</h4>
          <p>{{ $t('let-fans-use-your-personal-token-to-unlock-articles-The-value-of-your-personal-token-will-continue-to-increase-Fan-Pass-is-not-only-your-exclusive-currency-but-also-the-mark-of-fans-as-fellow-travelers') }}</p>
        </section>
        <section class="screen3-block">
          <img src="@/assets/img/home/home_screen3_4.png" alt="icon">
          <h4>{{ $t('potential-income') }}<br>{{ $t('content-payment-and-rewards') }}</h4>
          <p>{{ $t('any-of-your-articles-can-be-set-to-pay-to-unlock-Dont-underestimate-the-fans-love-of-your-work.-As-long-as-it-is-a-high-quality-work-even-if-you-need-to-pay-they-will-often-have-the-motivation-to-pay-Even-rewards-with-personal-passes') }}</p>
        </section>
      </section>
    </section>


    <!-- screen4 -->
    <section class="screen4">
      <h3 class="screen-title">
        {{ $t('three-steps-to-use-MATATAKI') }}
      </h3>
      <section class="screen4-content">
        <section class="screen4-block">
          <h4>1.{{ $t('create-content') }}</h4>
          <p>{{ $t('there-is-no-need-to-worry-about-being-harmonized-The-content-you-create-is-permanently-stored-on-the-IPFS-distributed-network-and-cannot-be-modified-again-by-anyone-to-facilitate-future-rights-protection-on-other-platforms') }}</p>
          <img src="@/assets/img/home/home_screen4_1.png" alt="icon">
        </section>
        <img src="@/assets/img/home/home_screen4_arrow.png" alt="screen" class="screen4-arrow">
        <section class="screen4-block">
          <h4>2.{{ $t('share-link') }}</h4>
          <p>{{ $t('connect-and-share-your-work-to-your-fan-base-such-as-Weibo-official-account-WeChat-group-etc') }}</p>
          <img src="@/assets/img/home/home_screen4_2.png" alt="icon">
        </section>
        <img src="@/assets/img/home/home_screen4_arrow.png" alt="screen" class="screen4-arrow">
        <section class="screen4-block">
          <h4>3.{{ $t('gain-profit') }}</h4>
          <p>{{ $t('when-the-content-that-you-set-paid-to-be-visible-is-viewed-you-immediately-get-revenue-Excellent-works-can-even-receive-additional-rewards') }}</p>
          <img src="@/assets/img/home/home_screen4_3.png" alt="icon">
        </section>
      </section>

      <p class="screen4-title">{{ $t('every-free-creation-should-be-recorded-forever') }} <span>—— 瞬Matataki</span></p>
      <p class="screen4-btn">
        <router-link :to="{name: 'article'}" class="screen4-btn">{{ $t('explore-more') }}</router-link>
      </p>
    </section>

    <!-- screen5 -->
    <!-- <section class="screen5">
      <h3 class="screen-title">
        订阅 瞬Matataki 资讯
      </h3>
      <section class="screen5-content">
        <input type="text" placeholder="请输入您的邮箱">
        <a href="javascript:;">订阅我们</a>
      </section>
    </section> -->

    <!-- screen6 -->
    <section class="screen6">
      <h3>Q & A</h3>
      <section class="screen6-content">
        <section class="screen6-block">
          <h4>1 {{ $t('what-is-the-relationship-between-the-personal-pass-and-Shun-Matataki') }}</h4>
          <p>{{ $t('home-qa-1') }}<a href="https://www.matataki.io/p/977?invite=9" target="_blank">{{ $t('this-article') }}</a></p>
        </section>

        <section class="screen6-block">
          <h4>2 {{ $t('what-are-the-advantages-of-using-Matataki') }}</h4>
          <p>{{ $t('home-qa-2') }}</p>
        </section>

        <section class="screen6-block">
          <h4>3 {{ $t('does-Shun-Matataki-charge') }}</h4>
          <p>{{ $t('home-qa-3') }}</p>
        </section>

        <section class="screen6-block">
          <h4>4 {{ $t('what-if-my-work-is-infringed') }}</h4>
          <p>{{ $t('home-qa-4') }}</p>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { removeCookie } from '@/utils/cookie'
import store from '@/utils/store.js'
import throttle from 'lodash/throttle'

export default {
  layout: 'home',
  data() {
    return {
      resizeEvent: null,
      swipeMode: '', // single double
      swipeHeight: '720px', // 高度
      avatar: '',
      supporters: [
        {
          id: 82,
          nickname: 'Ponge',
          avatar: '/avatar/2019/09/06/b4b75ec1f3ab19c74aab668579535848.jpeg',
          signature: '金融从业，专注投资',
          slogan: 'Matataki是我遇到对markdown支持最好的内容写作平台，让作者能够安心于内容创作，把排版美化的工作放心地交给它（手机端和网页端呈现都很好）。平台虽然不大，但能看出开发者的良苦用心，widget的设计、引用的嵌入、Fan票的设立……一步步走来，能够看到开发者对于创作者的尊重，也能看到开发者的认真与执着。既希望网站能够在有朝一日被更多的创作者发现并喜爱，又有点私心地希望这个宝藏网站不为人所知。哈哈，说了这么多，你不来试试吗？',
          numPosts: 28,
          post: {
            id: 3459,
            title: '《随机漫步的傻瓜》读书笔记',
            cover: '/image/2020/04/19/e06e9d228e70c153d03179412fad42b5.jpg'
          }
        },
        {
          id: 1187,
          nickname: '赛博佛客',
          avatar: '/avatar/2019/12/08/63ffa3218e0671194d7cc3b25f4259eb.jpg',
          signature: '机械先驱，人类叛徒，世界属于AI，区块链幻想家',
          slogan: 'Matataki，是我使用过最为方便的上链应用。不再需要我手动进行16进制转换，添加交易数据还要设置各种各样的gas。同时也是个人代币发行展示运作的开拓者。',
          numPosts: 3,
          post: {
            id: 2231,
            title: '全民记者时代——【新闻链&真相链】经济模型设计讨论',
            cover: '/image/2020/02/05/c739f378900a108236fac587498e53d7.png'
          }
        },
        {
          id: 967,
          nickname: '加菲众',
          avatar: '/avatar/2019/11/15/ceac57a33b012302d637f8d9f2927d3d.jpeg',
          signature: '著名音乐电台DJ、科技活动主持人、动静科技创始人',
          slogan: '迄今为止，Matataki是内容价值领域最易用直观的产品。小岛和他的团队已经寻得了内容通证化的最优路径。',
          numPosts: 15,
          post: {
            id: 3376,
            title: '鲍勃·迪伦全新单曲《最邪恶的谋杀》——中文翻译及图文注释',
            cover: '/image/2020/04/10/568089e6058733234ea746309a224f74.jpeg'
          }
        },
        {
          id: 989,
          nickname: 'UDSPJ',
          avatar: '/avatar/2019/11/17/d1c06bec2210f293fa1a8a0576a54efd.jpg',
          signature: '一个废宅',
          slogan: '最近需要合适的内容付费平台来更新文章或漫画，Matataki可以选择对单篇进行一次性支付或者对持有一定量Fan票的用户开放部分帖子阅读权限，对读者而言持有Fan票后可以永久阅读一部分内容。',
          numPosts: 38,
          post: {
            id: 1263,
            title: '漫画小教程：摇曳露营×Dijkstra最短路径',
            cover: '/image/2019/11/26/266b169068088e42e73e0fb86e89bc4b.jpg'
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
  },
  watch: {
    isLogined(newState) {
      if (newState) this.refreshUser()
    },
  },
  created() {
    this.init()
    if (process.browser) {
      this.$nextTick(() => {
        this.initSwipe()
        this.resizeEvent = throttle(this.initSwipe, 300)
        window.addEventListener('resize', this.resizeEvent)
      })
    }
    if (this.isLogined) this.refreshUser()
    this.getAllNumArticles()
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  methods: {
    ...mapActions(['getCurrentUser', 'signOut', 'resetAllStore']),
    ...mapActions('notification', ['getNotificationCounters']),
    async init() {
    },
    async refreshUser() {
      const { avatar } = await this.getCurrentUser()
      if (avatar) this.avatar = this.$ossProcess(avatar, { h: 60 })
      await this.getNotificationCounters()
    },
    // 初始化轮播图
    initSwipe() {
      try {
        const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        // console.log('clientWidth', clientWidth)
        if (clientWidth < 800) {
          this.swipeMode = 'single'
        } else {
          this.swipeMode = 'double'
        }

        if (clientWidth < 540) {
          this.swipeHeight = '480px'
        } else {
          this.swipeHeight = '720px'
        }
      } catch(e) {
        console.log(e)
      }
    },
    supportersX2(index) {
      const indexX2 = (index - 1) * 2
      let list = []
      for (let i = indexX2; i < indexX2 + 2; i++) {
        if(this.supporters[i]) list.push(this.supporters[i])
      }
      return list
    },
    imgUrl(src) {
      return src ? this.$ossProcess(src) : ''
    },
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
    btnsignOut() {
      if (confirm(this.$t('warning.confirmLogout'))) {

        // 出错后弹出框提示
        const alertDialog = () => {
          this.$alert('很抱歉，退出登录失败，点击确定刷新', '温馨提示', {
            showClose: false,
            type: 'success',
            callback: () => {
              window.location.reload()
            }
          })
        }

        // 重置all store
        this.resetAllStore()
          .then(() => {
            removeCookie('ACCESS_TOKEN')
            removeCookie('idProvider')
            removeCookie('referral')
            store.clear()
            sessionStorage.clear()

            this.$router.go(0)
            // 通知刷新其他页面
            setTimeout(() => {
              this.$userMsgChannel.postMessage('logout')
            }, 2000)

          }).catch(err => {
            console.log(err)
            alertDialog()
          })
      }
    },
    writeP() {
      if (this.isLogined) this.$router.push({ name: 'publish-type-id', params: { type: 'draft', id: 'create' } })
      else this.login()
    },
    async getNumArticles(id) {
      const res = await this.$API.getNumArticles(id)
      let count = 0
      if(res.code === 0) count = res.data.count
      return count
    },
    async getAllNumArticles() {
      for(let i = 0; i < this.supporters.length; i++) {
        const numPosts = await this.getNumArticles(this.supporters[i].id)
        if(numPosts) this.supporters[i].numPosts = numPosts
      }
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
