<template>
  <div class="main">
    <g-header />
    <img class="TitleImage" :src="cover" alt="">
    <article>
      <header class="Post-Header">
        <h1 class="Post-Title">
          {{ article.title }}
        </h1>
        <div class="Post-Author">
          <div class="AuthorInfo">
            <img class="Avatar" width="38" height="38" :src="avatar" alt="">
            <div class="AuthorInfo-content">
              <span class="UserLink AuthorInfo-name">{{ article.nickname || article.author }}</span>
              <span class="Post-Time">发布于{{ articleCreateTimeComputed }}</span>
              <span class="View-Num">{{ article.read || 0 }}阅读</span>
            </div>
          </div>
        </div>
        <div class="Post-RichTextContainer">
          <div class="Post-RichText markdown-body" v-html="compiledMarkdown" />
        </div>
      </header>
    </article>
    <div class="p-w btns">
      <div @click="invest">
        <InvestBtn style="margin-right: 120px;width: 80px;"></InvestBtn>
      </div>
      <div @click="share">
        <ShareBtn style="width: 80px;"></ShareBtn>
      </div>
    </div>
    <CommentList :signId="article.id" :type="article.channel_id" class="p-w"></CommentList>
    <div>
      <div class="sidebar">
        <div @click="invest">
          <InvestBtn style="margin-bottom: 20px;width: 60px;"></InvestBtn>
        </div>
        <div @click="share">
          <ShareBtn style="width: 60px;"></ShareBtn>
        </div>
      </div>
    </div>
    <InvestModal
      v-model="investModalShow"
      :article="{
        ...article,
        title: '投资文章'
      }" />
    <ShareModal
      v-model="shareModalShow"
      :article="{
        ...article,
        time: articleCreateTimeComputed,
        content: compiledMarkdown,
        avatar
      }" />
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
import InvestModal from '@/components/modal/Invest'
import ShareModal from '@/components/modal/Share'
export default {
  data() {
    return {
      avatar: null,
      followed: false,
      investModalShow: false,
      shareModalShow: false
    }
  },
  components: {
    CommentList,
    InvestBtn,
    ShareBtn,
    InvestModal,
    ShareModal
  },
  mounted() {
    this.setAvatar()
  },
  methods: {
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

<style lang="less" scoped>
.main {
  .minHeight();
}
@width: 690px;
.p-w  {
  width: @width;
  margin: 0 auto;
}
.sidebar {
  position: fixed;
  right: calc((100vw - 958px)/2);
  margin: auto;
  bottom: 106px;
}
.btns {
  .flexCenter();
  border-top: 1px solid #DBDBDB;
  border-bottom: 1px solid #DBDBDB;
  margin: 40px auto;
  padding: 40px 0;
}
.TitleImage {
  display: block;
  margin: 16px auto 0;
  width: @width;
}
.Avatar {
  background: #fff;
  border-radius: 50%;
  vertical-align: top;
}
.Post-Header {
  overflow: hidden;
  width: @width;
  margin: 0 auto;
}
.Post-RichTextContainer {
  width: @width;
  margin: 0 auto;
}
.Post-RichText {
  margin-top: 20px;
}
.Post-Title {
  font-weight: 600;
  font-synthesis: style;
  font-size: 24px;
  line-height: 1.22;
  margin: 24px 0;
  word-wrap: break-word;
}
.Post-Author {
  display: flex;
  align-items: center;
  .AuthorInfo {
    flex: 1 1;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
}
.AuthorInfo-content {
  flex: 1 1;
  margin-left: 14px;
  overflow: hidden;
}
.Post-Time, .View-Num {
  .info-font();
}
</style>
