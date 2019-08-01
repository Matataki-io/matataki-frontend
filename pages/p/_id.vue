<template>
  <div class="main">
    <g-header>
      <template slot="more">
        <el-dropdown trigger="click" @command="handleMoreAction">
          <div class="more-icon">
            <svg-icon class="icon" icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item command="edit">编辑</el-dropdown-item>
            <el-dropdown-item command="transfer">转让</el-dropdown-item>
            <el-dropdown-item command="del">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </g-header>
    <img class="TitleImage" :src="cover" alt="">
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
          <div class="Post-RichText markdown-body" v-html="compiledMarkdown" />
        </div>
      </header>
    </article>
    <div class="p-w" style="margin-top: 20px;">
      <ArticleFooter :article="article" />
    </div>
    <div class="p-w btns-container">
      <div class="btns" ref="actionBtns">
        <div v-if="isProduct" class="article-btn" @click="purchaseModalShow = true">
          <div class="icon-container yellow">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>购买商品</span>
        </div>
        <div class="article-btn" @click="invest">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="invest" class="icon" />
          </div>
          <span>{{ isProduct ? '投资商品' : '投资文章' }}</span>
        </div>
        <div class="article-btn" @click="share">
          <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
            <svg-icon icon-class="purchase" class="icon" />
          </div>
          <span>{{ isProduct ? '分享商品' : '分享文章' }}</span>
        </div>
      </div>
      <ArticleInfoFooter :article="article" />
    </div>
    <div v-if="article.tags.length !== 0" class="p-w tags-container">
      <tag v-for="(item, index) in article.tags" :key="index" :tag="item" />
    </div>
    <CommentList :sign-id="article.id" :type="article.channel_id" class="p-w" />
    <div class="sidebar" v-show="navShow">
      <div v-if="isProduct" class="article-btn" @click="purchaseModalShow = true">
        <div class="icon-container yellow">
          <svg-icon icon-class="purchase" class="icon" />
        </div>
        <span>购买商品</span>
      </div>
      <div class="article-btn" @click="invest">
        <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
          <svg-icon icon-class="invest" class="icon" />
        </div>
        <span>{{ isProduct ? '投资商品' : '投资文章' }}</span>
      </div>
      <div class="article-btn" @click="share">
        <div class="icon-container blue" :class="isProduct ? 'yellow' : 'blue'">
          <svg-icon icon-class="purchase" class="icon" />
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
      navShow: true
    }
  },
  head: {
    script: [
      {
        type: 'text/javascript',
        id: 'pocket-btn-js', // id 不知道作用 生成的 script 有id就带着好了
        src: 'https://widgets.getpocket.com/v1/j/btn.js?v=1'
      }
    ]
  },
  mounted() {
    this.setAvatar()
    this.oldOffSetTop = this.$refs.actionBtns.offsetTop
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      scrollTop > this.oldOffSetTop ? (this.navShow = false) : (this.navShow = true)
    },
    handleMoreAction(command) {
      this[command]()
    },
    del() {
      const delSuccess = async () => {
        this.$message({ duration: 2000, message: '删除成功,三秒后自动跳转到首页' })
        await this.$utils.sleep(3000)
        this.$router.push({ name: 'home' })
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
      this.$confirm('确定删除文章吗？', '确认信息', {
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
      // TODO
      console.log('edit')
    },
    invest() {
      this.investModalShow = true
    },
    share() {
      this.shareModalShow = true
    },
    setAvatar() {
      this.$API.getUser(this.article.uid).then((res) => {
        const data = res.data
        this.followed = data.is_follow
        if (data.avatar) this.avatar = this.$API.getImg(data.avatar)
      })
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
    const content = await $axios.get(`/ipfs/catJSON/${info.data.hash}`)
    return {
      article: info.data,
      post: content.data
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
