<template>
  <div class="main">
    <g-header @delete="del" @transfer="transfer" @edit="edit" />
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
      <div class="btns">
        <div @click="invest">
          <InvestBtn style="margin-right: 120px;width: 80px;" />
        </div>
        <div @click="share">
          <ShareBtn style="width: 80px;" />
        </div>
      </div>
      <ArticleInfoFooter :article="article" />
    </div>
    <div v-if="article.tags.length !== 0" class="p-w tags-container">
      <tag v-for="(item, index) in article.tags" :key="index" :tag="item" />
    </div>
    <CommentList :sign-id="article.id" :type="article.channel_id" class="p-w" />
    <div class="sidebar">
      <div @click="invest">
        <InvestBtn style="margin-bottom: 20px;width: 60px;" />
      </div>
      <div @click="share">
        <ShareBtn style="width: 60px;" />
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
import InvestBtn from '@/components/article/Invest'
import ShareBtn from '@/components/article/Share'
import UserInfoHeader from '@/components/article/UserInfoHeader'
import ArticleInfoFooter from '@/components/article/ArticleInfoFooter'
import ArticleFooter from '@/components/article/ArticleFooter'
import InvestModal from '@/components/modal/Invest'
import ShareModal from '@/components/modal/Share'

import tag from '@/components/tags/tag.vue'
export default {
  components: {
    CommentList,
    InvestBtn,
    ShareBtn,
    InvestModal,
    ShareModal,
    UserInfoHeader,
    ArticleInfoFooter,
    ArticleFooter,
    tag
  },
  data() {
    return {
      avatar: null,
      followed: false,
      investModalShow: false,
      shareModalShow: false
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
  },
  methods: {
    del() {
      this.$confirm('确定删除文章吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '保存修改'
          })
        })
        .catch((action) => {
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? '放弃保存并离开页面'
              : '停留在当前页面'
          })
        })
    },
    transfer() {

    },
    edit() {

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
