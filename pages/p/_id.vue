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
              编辑
            </el-dropdown-item>
            <el-dropdown-item command="transfer">
              转让
            </el-dropdown-item>
            <el-dropdown-item command="del">
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </g-header>
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
      <articleIpfs :hash="article.hash" />

      <div class="Post-RichText markdown-body article-content" v-html="compiledMarkdown" />
      <ArticleFooter style="margin-top: 20px;" :article="article" />
    </article>
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
          <span>{{ isProduct ? '分享商品' : '分享文章' }}</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="buy">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>购买商品</span>
        </div>
        <div v-if="isProduct" class="article-btn" @click="invest">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? '已投资' : '投资商品') : (isSupport ? '已投资' : '投资文章') }}</span>
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
            <span>{{ isProduct ? '分享商品' : '分享文章' }}</span>
          </div>
        </TokenFooter>
      </div>
      <ArticleInfoFooter v-if="isProduct" class="product" :article="article" />
    </div>

    <div v-if="article.tags.length !== 0" class="p-w" style="margin-bottom: 20px;">
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
    <CommentList v-if="isProduct" :comment-request="commentRequest" :sign-id="article.id" :type="article.channel_id" class="p-w" />
    <div v-show="navShow" class="sidebar">
      <div v-if="isProduct" class="article-btn" @click="buy">
        <div class="icon-container yellow">
          <svg-icon icon-class="purchase" class="icon" />
        </div>
        <span>购买商品</span>
      </div>
      <div v-if="isProduct" class="article-btn" @click="invest">
        <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
          <svg-icon icon-class="invest" class="icon" />
        </div>
        <span>{{ isProduct ? (isSupport ? '已投资' : '投资商品') : (isSupport ? '已投资' : '投资文章') }}</span>
      </div>
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
          <p>点击“分享文章”按钮与朋友共享好文章~</p>
          <div style="text-align: right; margin: 0">
            <el-button class="el-button--purple" type="primary" size="mini" @click="poopverDone('visible1')">
              知道了
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
            <span>{{ isProduct ? '分享商品' : '分享文章' }}</span>
          </div>
        </el-popover>
      </div>

      <el-popover
        v-model="visiblePopover.visible"
        placement="right"
        width="300"
        trigger="manual"
      >
        <p>指向此图标后，选择“推荐”或“不推荐”，即可领取阅读积分奖励！</p>
        <div style="text-align: right; margin: 0">
          <el-button class="el-button--purple" type="primary" size="mini" @click="poopverDone('visible')">
            知道了
          </el-button>
        </div>
        <CoinBtn
          v-if="!isProduct"
          slot="reference"
          style="margin-top: 40px;"
          :time="timeCount"
          :token="ssToken"
          :article="article"
          @like="like"
          @dislike="dislike"
        />
      </el-popover>
    </div>

    <InvestModal
      v-model="investModalShow"
      :article="{
        ...article,
        title: '投资文章'
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
      :article-id="article.id"
      :from="'article'"
    />

    <FeedbackModal v-model="feedbackShow" :points="ssToken.points" />
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import { xssFilter } from '@/utils/xss'
import 'mavon-editor/dist/css/index.css'
import 'mavon-editor/dist/markdown/github-markdown.min.css'
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

import { ipfsData } from '@/api/async_data_api.js'

import store from '@/utils/localStorage.js'
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
    FeedbackModal
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
      postsIdReadnewStatus: false, // 新文章阅读是否上报
      isReading: false // read接口是否请求完毕
    }
  },
  head() {
    return {
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', property: 'description', content: this.article.short_content },
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
      // MarkdownIt 实例
      const markdownIt = require('markdown-it')({
        html: true,
        breaks: true
      })
      return markdownIt.render(xssFilter(this.post.content))
    },
    cover() {
      if (this.article.cover) return this.$API.getImg(this.article.cover)
      return null
    },
    isProduct() {
      return this.article.channel_id === 2
    },
    likedOrDisLiked() {
      return parseInt(this.ssToken.is_liked) !== 0
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

  async asyncData({ $axios, route }) {
    const hashOrId = route.params.id
    // post hash获取; p id 短链接;
    const url = /^[0-9]*$/.test(hashOrId) ? 'p' : 'post'
    const info = await $axios.get(`/${url}/${hashOrId}`)
    const content = await ipfsData($axios, info.data.hash)
    return {
      article: info.data,
      post: content.data
    }
  },

  created() {
    // console.log(this.article)
    this.getSupportStatus(this.$route)
  },
  async mounted() {
    this.setAvatar()
    this.oldOffSetTop = this.$refs.actionBtns.offsetTop
    try {
      await this.$backendAPI.addReadAmount({ articlehash: this.article.hash }) // 增加文章阅读量
    } catch (error) {
      console.error('addReadAmount :', error)
    }
    window.addEventListener('scroll', this.handleScroll)
    this.handleFocus()
    // if (!document.hidden) {
    //   console.log(1111)
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
          this.$message.success('评价成功，阅读积分奖励已领取')

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          this.$message.error('推荐, 失败')
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
          this.$message.success('评价成功，阅读积分奖励已领取')

          this.getArticleInfoFunc() // 更新文章信息
        } else {
          this.$message.error('不推荐, 失败')
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      })
    },
    async postBackendReading(article) {
      // 阅读接口请求完毕才开始计时
      // 如果推荐/不推荐过 不进行调用
      if (parseInt(article.is_liked) === 1 || parseInt(article.is_liked) === 2) return
      await this.$API.reading(this.article.id)
        .then(res => {
          if (res.code === 0) {
            this.isReading = true
            this.reading()
            console.log('reading done')
          }
        }).catch(err => {
          console.log('文章 reading err', err)
        })
    },
    reading() {
      if (this.timer === null && !this.likedOrDisLiked) {
        this.timer = setInterval(() => {
          this.timeCount++
          console.log('计时', this.timeCount)
        }, 1000)
      }
    },
    handleFocus() {
      // https://github.com/hehongwei44/my-blog/issues/184
      window.onfocus = () => {
        console.log('页面激活')
        clearInterval(this.timer)
        if (this.isReading) this.reading()
      }
      window.onblur = () => {
        console.log('页面隐藏')
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
      const delSuccess = async () => {
        this.$message({ duration: 2000, message: '删除成功,三秒后自动跳转到首页' })
        await this.$utils.sleep(3000)
        this.$router.push('/article')
      }
      const fail = (err) => {
        this.$message.error('删除失败')
        console.log('error', err)
      }
      const delArticleFunc = async (id) => {
        if (!id) return fail('没有id')
        try {
          const response = await this.$backendAPI.delArticle({ id })
          if (response.status === 200 && response.data.code === 0) delSuccess()
          else fail(response.data.message)
        } catch (error) {
          return fail(error)
        }
      }
      this.$confirm('该文章已上传至 IPFS 永久保存, 本次操作仅删除瞬MATATAKI中的显示.', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
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
        name: 'publish',
        params: { id: this.article.id },
        query: { from: 'edit', hash: this.article.hash }
      })
    },
    // 检测能否投资
    detection(buy = false) {
      if (this.isSupport && !buy) {
        this.$message.success('已投资')
        return false
      }
      if (!this.isLogined) {
        this.$message.warning('登录后即可投资')
        return false
      }
      // email github 无法赞赏
      const { idProvider } = this.currentUserInfo
      if (this.$publishMethods.invalidId(idProvider)) {
        this.$message.warning(`${idProvider}账号暂不支持`)
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
    setAvatar() {
      this.$API.getUser({ id: this.article.uid }).then((res) => {
        const data = res.data
        this.followed = data.is_follow
        if (data.avatar) this.avatar = this.$API.getImg(data.avatar)
      })
    },
    // 获取是否赞赏状态
    async getSupportStatus(route) {
      try {
        const res = await this.$API.getArticleInfo(route.params.id)
        if (res.code === 0) {
          this.isSupport = res.data.is_support
          this.ssToken = {
            points: res.data.points || [], // 用户是否喜欢了这篇文章
            dislikes: res.data.dislikes,
            likes: res.data.likes,
            is_liked: res.data.is_liked || 0 // is_liked：0：没有操作过，1：不推荐，2：推荐
          }
          this.postBackendReading(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    payDone() {
      setTimeout(() => {
        this.commentRequest = Date.now()
      }, 3000)
    },
    postsIdReadnew() {
      const isNDaysAgo = this.$utils.isNDaysAgo(3, this.article.create_time)
      if (this.article.is_readnew !== 1 && !isNDaysAgo) {
        console.log('阅读新文章增加积分')
        this.$API.postsIdReadnew(this.article.id, this.timeCount)
          .then(res => {
            if (res.code === 0) {
              this.$message.success(`阅读新文章奖励${this.$point.readNew}积分, 评价后可领取更多积分!`)
              console.log('阅读新文章增加积分成功')
            } else console.log('阅读新文章增加积分失败')
          }).catch(err => console.log(`阅读新文章增加积分失败${err}`))
      }
    }
  }

}
</script>

<style lang="less" scoped src="./index.less"></style>
