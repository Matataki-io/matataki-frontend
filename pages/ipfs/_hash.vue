<template>
  <main class="ipfs">
    <header>
      <h1 class="head-title">
        {{ articleIpfs.title }}
      </h1>
      <figure>
        <n-link
          :to="{name: 'user-id', params:{id: articleData.uid}}"
          target="_blank"
          itemprop="author"
        >
          {{ articleIpfs.author }}
        </n-link>
        <time itemprop="datePublished" :datetime="articleData.create_time">{{ articleCreateTime }}</time>
        <span itemprops="provider" itemscope="" itemtype="https://www.smartsignature.io/">
          from <span itemprops="name">智能签名 Smart Signature</span>
          <meta itemprops="url" content="https://www.smartsignature.io/">
        </span>
        <p itemprops="hash">
          {{ articleData.hash }}
        </p>
      </figure>
    </header>
    <article itemprop="articleBody" v-html="compiledMarkdown" />
  </main>
</template>

<script>
import moment from 'moment'
import { xssFilter } from '@/utils/xss'
import { ipfsData, ipfsArticleData } from '@/api/async_data_api.js'
export default {
  layout: 'ipfs',
  data() {
    return {
      articleIpfs: Object.create(null),
      articleData: Object.create(null)
    }
  },
  head() {
    return {
      title: this.articleData.title,
      meta: [
        { hid: 'description', name: 'description', content: this.articleData.short_content },
        { hid: 'aritcle:author', name: 'aritcle:author', content: this.articleIpfs.author },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', property: 'twitter:title', content: this.articleIpfs.author + ':' + this.articleData.title },
        { hid: 'twitter:description', property: 'twitter:description', content: this.articleData.short_content },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', property: 'og:site_name', content: '智能签名' },
        { hid: 'og:title', property: 'og:title', content: this.articleIpfs.author + ':' + this.articleData.title },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:description', property: 'og:description', content: this.articleData.short_content }
        /* end */
      ]
    }
  },
  computed: {
    articleCreateTime() {
      return moment(this.articleData.create_time).format('YYYY-MM-DD HH:mm')
    },
    compiledMarkdown() {
      // MarkdownIt 实例
      const markdownIt = require('markdown-it')({
        html: true,
        breaks: true
      })
      return markdownIt.render(xssFilter(this.articleIpfs.content))
    }
  },
  async asyncData({ $axios, params }) {
    let articleIpfs = Object.create(null)
    let articleData = Object.create(null)
    await ipfsData($axios, params.hash).then(res => {
      if (res.code === 0) articleIpfs = res.data
    })
    await ipfsArticleData($axios, params.hash).then(res => {
      if (res.code === 0) articleData = res.data
    })
    return {
      articleIpfs,
      articleData
    }
  },
  created() {
    console.log(this.articleIpfs, this.articleData)
  }
}
</script>
<style lang="less" scoped>
.ipfs {
  max-width: 673px;
  margin: 40px auto;
  padding: 0 20px;
}
header {
  margin-bottom: 40px;
  font-size: 16px;
}
.head-title {
  font-size: 32px;
  line-height: 1.3;
}
figure {
  padding: 0;
  margin: 0;
  a {
    text-decoration: underline;
    cursor: pointer;
  }
  time {
    color: #b3b3b3;
    padding-left: 6px;
    padding-right: 6px;
  }
  p {
    color: #b3b3b3;
    font-size: 14px;
  }
}

</style>
<style>
.ipfs article p {
  line-height: 1.8;
  font-size: 18px;
}
.ipfs article > * {
  margin-top: 20px;
  margin-bottom: 24px;
}
.ipfs article * {
  max-width: 100%;
}
</style>
