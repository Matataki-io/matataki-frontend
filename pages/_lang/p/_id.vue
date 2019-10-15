<template>
  <div class="main">
    <g-header :popover-visible="visiblePopover.visible2" @popoverVisible="poopverDone('visible2')">
      <template slot="more">
        <el-dropdown v-if="isMe(article.uid)" trigger="click" @command="handleMoreAction">
          <div class="more-icon">
            <svg-icon class="icon" icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item command="edit">
              {{ $t('edit') }}
            </el-dropdown-item>
            <el-dropdown-item command="transfer">
              {{ $t('transfer') }}
            </el-dropdown-item>
            <el-dropdown-item command="del">
              {{ $t('delete') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </g-header>

    <div class="container">
      <div v-if="cover" class="TitleImage">
        <img :src="cover" alt="cover">
      </div>

      <article class="Post-Header">
        <header>
          <h1 class="Post-Title">
            {{ article.title }}
          </h1>
          <UserInfoHeader
            :article="{
              ...article,
              avatar,
              articleCreateTimeComputed,
            }"
          />
        </header>
        <!-- ipfs -->
        <articleIpfs :is-hide="tokenArticle" :hash="article.hash" />

        <div class="Post-RichText markdown-body article-content" v-html="compiledMarkdown" />
        <ArticleFooter v-if="isTokenArticle" style="margin-top: 20px;" :article="article" />
        <!-- 解锁按钮 -->
        <div v-if="tokenArticle" class="lock">
          <el-divider v-if="!isTokenArticle">
            <i class="el-icon-lock lock-icon" />
          </el-divider>

          <div class="lock-info fl ac jsb">
            <div class="fl ac">
              <img v-if="!isTokenArticle" class="lock-img" src="@/assets/img/lock.png" alt="lock">
              <img v-else class="lock-img" src="@/assets/img/unlock.png" alt="lock">
              <div>
                <h3 class="lock-info-title">
                  {{ !isTokenArticle ? '解锁全文的条件' : '已解锁全文' }}
                  <el-tooltip class="item" effect="dark" content="阅读本文需要先持有特定数量的粉丝币，满足本文的阅读条件后刷新页面即可阅读全文。" placement="top-start">
                    <svg-icon
                      class="help-icon"
                      icon-class="help"
                    />
                  </el-tooltip>
                </h3>

                <p v-if="!isMe(article.uid)" class="lock-info-des">
                  持有{{ needTokenAmount }}枚以上的{{ needTokenSymbol }}粉丝币
                  <!-- 不显示 - 号 -->
                  <span> {{ !isTokenArticle ? '还差' : '目前拥有' }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }}枚{{ needTokenSymbol }}</span>
                </p>
                <p v-else class="lock-info-des">
                  自己发布的文章
                </p>
              </div>
            </div>

            <router-link
              :to="{name: 'exchange'}"
            >
              <el-button type="primary" size="small">
                获取粉丝币
              </el-button>
            </router-link>
          </div>
        </div>
      </article>

      <!-- sidebar -->
      <div v-show="navShow" class="sidebar">
        <div v-if="isProduct" class="article-btn" @click="buy">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>{{ $t('p.buyShop') }}</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="invest">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? this.$t('p.invested') : this.$t('p.investShop')) : (isSupport ? this.$t('p.invested') : this.$t('p.investArticle')) }}</span>
        </div>

        <!-- <div
        v-if="!isProduct"
        class="comment fl ac fdc"
      >
        <div class="comment-block">
          <svg-icon icon-class="comment" class="comment-icon" />
        </div>
        <span>评论</span>
      </div> -->

        <div
          class="article-btn"
          @click="share"
        >
          <el-popover
            v-model="visiblePopover.visible1"
            placement="right"
            width="300"
            trigger="manual"
          >
            <p>{{ $t('p.sharePopover') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button class="el-button--purple" type="primary" size="mini" @click="poopverDone('visible1')">
                {{ $t('p.confirmPopover') }}
              </el-button>
            </div>

            <div
              slot="reference"
            >
              <div
                class="icon-container blue"
                :class="isProduct ? 'yellow' : 'blue'"
              >
                <svg-icon icon-class="share" class="icon" />
              </div>
              <span>{{ $t('share') }}</span>
            </div>
          </el-popover>
        </div>

        <el-popover
          v-model="visiblePopover.visible"
          placement="right"
          width="300"
          trigger="manual"
        >
          <p>{{ $t('p.likePopover') }}</p>
          <div style="text-align: right; margin: 0">
            <el-button class="el-button--purple" type="primary" size="mini" @click="poopverDone('visible')">
              {{ $t('p.confirmPopover') }}
            </el-button>
          </div>
          <div
            slot="reference"
          >
            <CoinBtn
              v-if="!isProduct"
              style="margin-top: 40px;"
              :time="timeCount"
              :token="ssToken"
              :article="article"
              @like="like"
              @dislike="dislike"
            />
          </div>
        </el-popover>
      </div>
    </div>

    <div class="p-w btns-container">
      <!-- 文章 -->
      <!-- 推荐 不推荐 分享 -->

      <!-- 商品 -->

      <!-- 投资 购买 分享 -->

      <div ref="actionBtns" class="btns">
        <div v-if="isProduct" class="article-btn" @click="share">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="share" class="icon" />
          </div>
          <span> {{ $t('share') }}</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="buy">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>{{ $t('p.buyShop') }}</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="invest">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? this.$t('p.invested') : this.$t('p.investShop')) : (isSupport ? this.$t('p.invested') : this.$t('p.investArticle')) }}</span>
        </div>

        <TokenFooter
          v-if="!isProduct"
          :time="timeCount"
          :token="ssToken"
          :article="article"
          @like="like"
          @dislike="dislike"
        >
          <div class="article-btn" @click="share">
            <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
              <svg-icon icon-class="share" class="icon" />
            </div>
            <span>{{ $t('share') }}</span>
          </div>
        </TokenFooter>
      </div>
      <ArticleInfoFooter v-if="isProduct" class="product" :article="article" />
    </div>
    <div v-if="isShowTags" class="p-w" style="margin-bottom: 20px;">
      <n-link
        v-for="(item, index) in article.tags"
        :key="index"
        style="margin-right: 10px;"
        class="tag-card"
        :to=" {name: 'tag-id', params: {id: item.id}, query: {name: item.name, type: item.type}}"
      >
        {{ item.name }}
      </n-link>
    </div>

    <!-- 内容居中 -->
    <div class="p-w">
      <!-- 评论内容 -->
      <commentInput v-if="!isProduct" :article="article" @doneComment="commentRequest = Date.now()" />
      <CommentList :class="!isProduct && 'has-comment-input'" :comment-request="commentRequest" :sign-id="article.id" :type="article.channel_id" />
    </div>

    <InvestModal
      v-model="investModalShow"
      :article="{
        ...article,
        title: $t('p.investArticle')
      }"
      @investDone="payDone"
    />
    <ShareModal
      v-model="shareModalShow"
      :article="{
        ...article,
        time: articleCreateTimeComputed,
        content: compiledMarkdown,
        avatar
      }"
    />
    <PurchaseModal
      v-model="purchaseModalShow"
      :article="{
        ...article,
        cover
      }"
      @purchaseDone="payDone"
    />
    <article-transfer
      v-model="transferModal"
      :article-id="Number(article.id)"
      from="article"
    />

    <FeedbackModal v-model="feedbackShow" :points="ssToken.points" />
  </div>
</template>

<script>
import moment from 'moment'
import Cookies from 'js-cookie'
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import { xssFilter } from '@/utils/xss'
import 'mavon-editor-matataki/dist/css/index.css'
import 'mavon-editor-matataki/dist/markdown/github-markdown.min.css'
import CommentList from '@/components/comment/List'
import UserInfoHeader from '@/components/article/UserInfoHeader'
import ArticleInfoFooter from '@/components/article/ArticleInfoFooter'
import ArticleFooter from '@/components/article/ArticleFooter'
import articleIpfs from '@/components/article/article_ipfs'
import InvestModal from '@/components/modal/Invest'
import PurchaseModal from '@/components/modal/Purchase'
import ShareModal from '@/components/modal/Share'
import articleTransfer from '@/components/articleTransfer'
import CoinBtn from '@/components/article/CoinBtn'
import TokenFooter from '@/components/article/TokenFooter'
import FeedbackModal from '@/components/article/Feedback'
import commentInput from '@/components/article_comment'
import { ipfsData } from '@/api/async_data_api.js'
import { extractChar } from '@/utils/reg'
import { precision } from '@/utils/precisionConversion'

import store from '@/utils/localStorage.js'

const markdownIt = require('markdown-it')({
  html: true,
  breaks: true
})
const mkItFootnote = require('markdown-it-footnote')
const mkItKatex = require('markdown-it-katex')
markdownIt.use(mkItKatex)
markdownIt.use(mkItFootnote)

export default {
  components: {
    CommentList,
    InvestModal,
    ShareModal,
    PurchaseModal,
    UserInfoHeader,
    ArticleInfoFooter,
    ArticleFooter,
    articleIpfs,
    articleTransfer,
    CoinBtn,
    TokenFooter,
    FeedbackModal,
    commentInput
  },
  data() {
    return {
      avatar: null,
      followed: false,
      investModalShow: false,
      shareModalShow: false,
      transferModal: false,
      purchaseModalShow: false,
      oldOffSetTop: 0,
      navShow: true,
      isSupport: false, // 是否赞赏, 重新通过token请求文章数据
      commentRequest: 0,
      timer: null,
      timeCount: 0,
      ssToken: {
        points: [],
        dislikes: 0,
        likes: 0,
        is_liked: 0
      },
      feedbackShow: false,
      // 三个引导提示的状态
      visiblePopover: {
        visible: false,
        visible1: false,
        visible2: false
      },
      timerShare: null, // 分享计时器
      timeCountShare: 0, // 分享计时
      article: Object.create(null),
      post: Object.create(null),
      postsIdReadnewStatus: false, // 新文章阅读是否上报
      isReading: false, // read接口是否请求完毕
      comment: '', //评论内容
      currentProfile: Object.create(null),
      differenceToken: '0',
      showLock: false
    }
  },
  head() {
    return {
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', content: this.article.short_content },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: this.article.title },
        { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: this.article.short_content },
        { hid: 'twitter:url', name: 'twitter:url', property: 'twitter:url', content: `${process.env.VUE_APP_PC_URL}/p/${this.article.id}` },
        { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.$API.getImg(this.article.cover) },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: '瞬MATATAKI' },
        { hid: 'og:title', name: 'og:title', property: 'og:title', content: this.article.title },
        { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', name: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_PC_URL}/p/${this.article.id}` },
        { hid: 'og:image', name: 'og:image', property: 'og:image', content: this.$API.getImg(this.article.cover) },
        { hid: 'og:description', name: 'description', property: 'og:description', content: this.article.short_content }
        /* end */
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css' }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    articleCreateTimeComputed() {
      const { create_time: createTime } = this.article
      const time = moment(createTime)
      return this.$utils.isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    compiledMarkdown() {
      return markdownIt.render(xssFilter(this.post.content))
    },
    cover() {
      if (this.article.cover) return this.$API.getImg(this.article.cover)
      return null
    },
    avatarSrc() {
      if (this.currentUserInfo.avatar) return this.$API.getImg(this.currentUserInfo.avatar)
      return ''
    },
    isProduct() {
      return this.article.channel_id === 2
    },
    likedOrDisLiked() {
      return parseInt(this.ssToken.is_liked) !== 0
    },
    isShowTags() {
      return this.article.tags && this.article.tags.length !== 0
    },
    tokenArticle() {
    // 是否为付费文章
      return this.article.tokens.length !== 0
    },
    isTokenArticle() {
      // 付费文章
      if (this.article.tokens.length !== 0) {
        if (this.showLock) return true
        else return false
      } else { // 不付费
        return true
      }
    },
    // 需要多少粉丝币
    needTokenAmount() {
      if (this.article.tokens.length !== 0) {
        return precision(this.article.tokens[0].amount, 'CNY', this.article.tokens[0].decimals)
      } else return 0
    },
    // 需要多少粉丝币名称
    needTokenSymbol() {
      if (this.article.tokens.length !== 0) {
        return this.article.tokens[0].symbol
      } else return ''
    }

  },
  watch: {
    timeCount(v) {
      if (!this.postsIdReadnewStatus && v >= 30) {
        this.postsIdReadnew()
        this.postsIdReadnewStatus = true
      }
      if (v >= 150) {
        clearInterval(this.timer)
      }
    },
    timeCountShare(v) {
      if (v >= 60 && !store.get('shareVisible')) {
        this.visiblePopover.visible1 = true
        clearInterval(this.timerShare)
      }
    }
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

    const hashOrId = route.params.id
    // post hash获取; p id 短链接;
    const url = /^[0-9]*$/.test(hashOrId) ? 'p' : 'post'
    const info = await $axios({
      url: `/${url}/${hashOrId}`,
      methods: 'get',
      headers: { 'x-access-token': accessToekn }
    })
    console.log('info', info)

    // 判断是否为付费阅读文章
    if (info.data.tokens && info.data.tokens.length !== 0) {
      return {
        article: info.data,
        post: {
          content: info.data.short_content
        }
      }
    } else {
      const content = await ipfsData($axios, info.data.hash)
      return {
        article: info.data,
        post: content.data
      }
    }
  },

  created() {
    this.getCurrentProfile()
  },
  mounted() {
    this.setAvatar()
    this.oldOffSetTop = this.$refs.actionBtns.offsetTop
    this.addReadAmount()
    window.addEventListener('scroll', this.handleScroll)
    this.handleFocus()
    // if (!document.hidden) {
    //   this.reading()
    // }

    // dom加载完提示 推荐/不推荐
    this.$nextTick(() => {
      // undefined false 显示
      if (!store.get('likeVisible')) this.visiblePopover.visible = true
      this.shareCount()
    })
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.timer)
    clearInterval(this.timerShare)
  },
  methods: {
    // 增加文章阅读量
    async addReadAmount() {
      await this.$API.addReadAmount({ articlehash: this.article.hash }).catch(err => console.log('add read amount error', err))
    },
    // 获取用户在当前文章的属性
    async getCurrentProfile() {
      const data = {
        id: this.$route.params.id
      }

      await this.$API.getCurrentProfile(data).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.currentProfile = res.data
          // Object.assign(this.article, this.currentProfile)
          // console.log('article', this.article)
          this.differenceTokenFunc()

          this.getSupportStatus(res.data)
        } else if (res.code === 401) {
          console.log(res.message)
        } else {
          console.log(res.message)
        }
      }).catch(err => console.log(err))
    },
    // 差多少token 变为字符界面显示截取 - 号
    differenceTokenFunc() {
      if (this.currentProfile.holdMineTokens && this.currentProfile.holdMineTokens.length !== 0 && this.article.tokens) {
        const tokenName = this.currentProfile.holdMineTokens.filter(list => list.id === this.article.tokens[0].id)

        // 获取有多少token
        const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
        let needTokenAmount = 0
        // 获取需要多少token
        if (this.article.tokens && this.article.tokens.length !== 0) {
          needTokenAmount = this.article.tokens[0].amount
        }
        // 减之后 换算
        const amountToken = precision(amount - needTokenAmount, 'CNY', tokenName[0].decimals)

        this.differenceToken = amountToken < 0 ? amountToken + '' : '+' + precision(amount, 'CNY', tokenName[0].decimals)
      } else this.differenceToken = '0'

      this.showLockFunc(this.differenceToken)
    },
    // 是否显示 Lock
    showLockFunc(differenceToken) {
      if (Number(differenceToken) < 0) {
        if (this.isMe(this.article.uid)) { // 自己的文章
          this.showLock = true
          this.getIfpsData()
        } else this.showLock = false
      } else {
        this.showLock = true
        this.getIfpsData()
      }
    },

    shareCount() {
      this.timerShare = setInterval(() => {
        this.timeCountShare++
        // console.log(this.timeCountShare)
      }, 1000)
    },
    // 提示点击确定后
    poopverDone(visible) {
      // likeVisible shareVisible userVisible
      if (visible === 'visible') {
        store.set('likeVisible', true)
        this.visiblePopover.visible = false
      } else if (visible === 'visible1') {
        store.set('shareVisible', true)
        this.visiblePopover.visible1 = false
      } else if (visible === 'visible2') {
        store.set('userVisible', true)
        this.visiblePopover.visible2 = false
      }
    },
    // 推荐或不推荐显示 用户popover提示
    showUserPopover() {
      if (!store.get('userVisible')) this.visiblePopover.visible2 = true
    },
    async getIfpsData() {
      await this.$API.getIfpsData(this.article.hash)
        .then(res => {
          if (res.code === 0) {
            this.post.content = res.data.content
          } else {
            console.log(res.message)
          }
        })
    },
    async getArticleInfoFunc() {
      await this.$API.getArticleInfo(this.$route.params.id)
        .then(res => {
          if (res.code === 0) this.article = res.data
        })
    },
    // 推荐
    like() {
      this.showUserPopover()
      this.$API.like(this.article.id, this.timeCount).then(res => {
        if (res.code === 0) {
          clearInterval(this.timer)
          this.ssToken.is_liked = 2
          this.ssToken.points = res.data
          // this.feedbackShow = true
          this.$message.success(this.$t('articleFooter.commentDoneMessage'))

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          this.$message.error(`${this.$t('articleFooter.like')},${this.$t('error.fail')}`)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      })
    },
    // 不推荐
    dislike() {
      this.showUserPopover()
      this.$API.dislike(this.article.id, this.timeCount).then(res => {
        if (res.code === 0) {
          clearInterval(this.timer)
          this.ssToken.is_liked = 1
          this.ssToken.points = res.data
          // this.feedbackShow = true
          this.$message.success(this.$t('articleFooter.commentDoneMessage'))

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          this.$message.error(`${this.$t('articleFooter.unlike')},${this.$t('error.fail')}`)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      })
    },
    async postBackendReading(res) {
      // 阅读接口请求完毕才开始计时
      // 如果推荐/不推荐过 不进行调用
      if (parseInt(res.is_liked) === 1 || parseInt(res.is_liked) === 2) return
      await this.$API.reading(this.article.id)
        .then(res => {
          if (res.code === 0) {
            this.isReading = true
            this.reading()
            // console.log('reading done')
          }
        }).catch(err => {
          console.log('article reading err', err)
        })
    },
    reading() {
      if (this.timer === null && !this.likedOrDisLiked) {
        this.timer = setInterval(() => {
          this.timeCount++
          // console.log('计时', this.timeCount)
        }, 1000)
      }
    },
    handleFocus() {
      // https://github.com/hehongwei44/my-blog/issues/184
      window.onfocus = () => {
        // console.log('页面激活')
        clearInterval(this.timer)
        if (this.isReading) this.reading()
      }
      window.onblur = () => {
        // console.log('页面隐藏')
        clearInterval(this.timer)
        this.timer = null
      }
    },
    handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.body.clientHeight
      scrollTop + clientHeight - 100 > this.oldOffSetTop ? (this.navShow = false) : (this.navShow = true)
    },
    handleMoreAction(command) {
      this[command]()
    },
    del() {
      const delSuccess = () => {
        this.$message({ duration: 2000, message: this.$t('p.deleteArticle') })
        this.$router.push('/article')
      }
      const fail = (err) => {
        this.$message.error(this.$t('p.deleteFail'))
        console.log('error', err)
      }
      const delArticleFunc = async (id) => {
        if (!id) return fail(this.$t('p.noId'))
        try {
          const response = await this.$backendAPI.delArticle({ id })
          if (response.status === 200 && response.data.code === 0) delSuccess()
          else fail(response.data.message)
        } catch (error) {
          return fail(error)
        }
      }
      this.$confirm(this.$t('p.ipfsPrompt'), this.$t('promptTitle'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel')
      })
        .then(() => {
          delArticleFunc(this.article.id)
        })
        .catch((action) => {})
    },
    transfer() {
      this.transferModal = true
    },
    edit() {
      this.$router.push({
        name: 'publish-type-id',
        params: { type: 'edit', id: this.article.id },
        query: { hash: this.article.hash }
      })
    },
    // 检测能否投资
    detection(buy = false) {
      if (this.isSupport && !buy) {
        this.$message.success(this.$t('p.invested'))
        return false
      }
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      // email github 无法赞赏
      const { idProvider } = this.currentUserInfo
      if (this.$publishMethods.invalidId(idProvider)) {
        this.$message.warning(`${this.$t('p.account', [idProvider])}`)
        return false
      }
      return true
    },
    invest() {
      if (this.detection()) { this.investModalShow = true }
    },
    buy() {
      if (this.detection(true)) this.purchaseModalShow = true
    },
    share() {
      this.shareModalShow = true
    },
    async setAvatar() {
      await this.$API.getUser({ id: this.article.uid }).then((res) => {
        if (res.code === 0) {
          const data = res.data
          this.followed = data.is_follow
          if (data.avatar) this.avatar = this.$API.getImg(data.avatar)
        }
      })
    },
    // 获取是否赞赏状态
    getSupportStatus(res) {
      this.isSupport = res.is_support
      this.ssToken = {
        points: res.points || [], // 用户是否喜欢了这篇文章
        dislikes: res.dislikes,
        likes: res.likes,
        is_liked: res.is_liked || 0 // is_liked：0：没有操作过，1：不推荐，2：推荐
      }
      this.postBackendReading(res)
    },
    payDone() {
      setTimeout(() => {
        this.commentRequest = Date.now()
      }, 3000)
    },
    postsIdReadnew() {
      const isNDaysAgo = this.$utils.isNDaysAgo(3, this.article.create_time)
      if (this.article.is_readnew !== 1 && !isNDaysAgo) {
        // console.log('阅读新文章增加积分')
        this.$API.postsIdReadnew(this.article.id, this.timeCount)
          .then(res => {
            if (res.code === 0) {
              this.$message.success(this.$t('articleFooter.readNew', [this.$point.readNew]))
              // console.log('阅读新文章增加积分成功')
            } else console.log('阅读新文章增加积分失败')
          }).catch(err => console.log(`阅读新文章增加积分失败${err}`))
      }
    }
  }

}
</script>

<style lang="less" scoped src="./index.less"></style>
