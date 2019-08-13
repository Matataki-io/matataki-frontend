<template>
  <div class="main">
    <g-header>
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
    <article>
      <header class="Post-Header">
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
        <div class="Post-RichTextContainer">
          <div class="Post-RichText markdown-body article-content" v-html="compiledMarkdown" />
        </div>
      </header>
    </article>
    <div class="p-w" style="margin-top: 20px;">
      <ArticleFooter :article="article" />
    </div>
    <div class="p-w btns-container">
      <div ref="actionBtns" class="btns">
        <div v-if="isProduct" class="article-btn" @click="buy">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>购买商品</span>
        </div>
        <div class="article-btn" @click="invest">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? (isSupport ? '已投资' : '投资商品') : (isSupport ? '已投资' : '投资文章') }}</span>
        </div>
        <div class="article-btn" @click="share">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="share" class="icon" />
          </div>
          <span>{{ isProduct ? '分享商品' : '分享文章' }}</span>
        </div>
      </div>
      <ArticleInfoFooter :article="article" />
    </div>
    <div v-if="article.tags.length !== 0" class="p-w tags-container">
      <tag v-for="(item, index) in article.tags" :key="index" :tag="item" />
    </div>
    <CommentList :comment-request="commentRequest" :sign-id="article.id" :type="article.channel_id" class="p-w" />
    <div v-show="navShow" class="sidebar">
      <div v-if="isProduct" class="article-btn" @click="buy">
        <div class="icon-container yellow">
          <svg-icon icon-class="purchase" class="icon" />
        </div>
        <span>购买商品</span>
      </div>
      <div class="article-btn" @click="invest">
        <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
          <svg-icon icon-class="invest" class="icon" />
        </div>
        <span>{{ isProduct ? (isSupport ? '已投资' : '投资商品') : (isSupport ? '已投资' : '投资文章') }}</span>
      </div>
      <div class="article-btn" @click="share">
        <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
          <svg-icon icon-class="share" class="icon" />
        </div>
        <span>{{ isProduct ? '分享商品' : '分享文章' }}</span>
      </div>
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
import InvestModal from '@/components/modal/Invest'
import PurchaseModal from '@/components/modal/Purchase'
import ShareModal from '@/components/modal/Share'
import articleTransfer from '@/components/articleTransfer'

import tag from '@/components/tags/tag.vue'
import { ipfsData } from '@/api/async_data_api.js'
export default {
  components: {
    CommentList,
    InvestModal,
    ShareModal,
    PurchaseModal,
    UserInfoHeader,
    ArticleInfoFooter,
    ArticleFooter,
    articleTransfer,
    tag
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
      commentRequest: 0
    }
  },
  head() {
    return {
      script: [
        {
          type: 'text/javascript',
          id: 'pocket-btn-js',
          src: 'https://widgets.getpocket.com/v1/j/btn.js?v=1'
        }
      ],
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', content: this.article.short_content },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: this.article.title },
        { hid: 'twitter:description', name: 'twitter:description', property: 'twitter:description', content: this.article.short_content },
        { hid: 'twitter:url', name: 'twitter:url', property: 'twitter:url', content: `http://www.smartsignature.io/p/${this.article.id}` },
        { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.$API.getImg(this.article.cover) },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', property: 'og:site_name', content: '智能签名' },
        { hid: 'og:title', property: 'og:title', content: this.article.title },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: `http://www.smartsignature.io/p/${this.article.id}` },
        { hid: 'og:image', property: 'og:image', content: this.$API.getImg(this.article.cover) },
        { hid: 'og:description', property: 'og:description', content: this.article.short_content }
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
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
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
        this.$router.push('/')
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
      this.$confirm('该文章已上传至 IPFS 永久保存, 本次操作仅删除智能签名中的显示.', '确认信息', {
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
    detection() {
      if (this.isSupport) {
        this.$message.success('已投资')
        return false
      }
      if (!this.isLogined) {
        this.$message.warning('登陆后即可投资')
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
      if (this.detection()) { this.purchaseModalShow = true }
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
        // console.log(297, res)
        if (res.code === 0) this.isSupport = res.data.is_support
      } catch (error) {
        console.log(error)
      }
    },
    payDone() {
      setTimeout(() => {
        this.commentRequest = Date.now()
      }, 3000)
    }
  }

}
</script>

<style lang="less" scoped src="./index.less"></style>
