<template>
  <div class="preview">
    <div ref="container" class="container">
      <!-- 文章封面 -->
      <div v-if="cover" class="TitleImage">
        <img v-lazy="cover" alt="cover">
      </div>

      <header class="header">
        <!-- 标题 -->
        <h1>{{ article.title }}</h1>
        <el-alert
          :title="$t('currently-in-preview-mode')"
          type="info"
          :description="draftTimeEnd"
          show-icon
          :closable="false"
          style="margin-bottom: 20px;"
        />
        <el-alert
          v-if="postTime"
          :title="$t('draft-scheduled-release-schedule')"
          type="warning"
          :description="postTime"
          show-icon
          :closable="false"
          style="margin-bottom: 20px;"
        />
        <div class="fl ac">
          <router-link v-if="avatar" :to="{ name: 'user-id', params: {id: article.uid}}" target="_blank">
            <c-avatar :src="avatar" />
          </router-link>
          <div class="author-info">
            <router-link class="author" :to="{ name: 'user-id', params: {id: article.uid}}" target="_blank">
              {{ article.username || article.nickname }}
            </router-link>
            <p class="time">{{ time }}</p>
          </div>
        </div>
      </header>

      <article>
        <!-- 文章内容 -->
        <markdownView id="doc" :content="compiledMarkdown" />
      </article>
    </div>
  </div>
</template>


<script>
import { xssFilter, xssImageProcess } from '@/utils/xss'
import { isNDaysAgo } from '@/utils/momentFun'

let markdown = null
let finishView = null

if (process.client) {
  let md = require('markdown-render-js')

  markdown = md.markdown
  finishView = md.finishView
}

// import { markdown, finishView } from '../../static/markdown-render-js.min.js'
import markdownView from '@/components/markdown_view'

export default {
  head() {
    return {
      title: '瞬MATATAKI - 预览',
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js' }
      ]
    }
  },
  components: {
    markdownView
  },
  data(){
    return {
      article: Object.create(null),
      draftTime: 0
    }
  },
  computed: {
    // 封面
    cover() {
      return this.article.cover ?  this.$ossProcess(this.article.cover) : ''
    },
    // 文章内容
    compiledMarkdown() {
      // 前提: 都在自己的平台下
      // 因为之前批量替换了getImg接口,导致上传图片在允许webp的平台会产生一个webp格式的链接, 所以这里过优化一下(比如chrome上传会带webp,safari就不会带webp)
      // 如果已经上传过webp 在允许webp返回webp 如果不允许则修改格式为png (上传接口取消webp格式上传 因为在ipfs模版页面会出问题)
      // 如果上传的是默认的图片, 在允许webp返回webp 如果不允许则返回默认的格式
      if (process.browser && this.article.content) {
        let md = markdown.render(this.article.content)
        return this.$utils.compose(xssImageProcess, xssFilter)(md)
      } else {
        return ''
      }
    },
    markdownContent () {
      return this.article.content
    },
    // 头绪
    avatar() {
      return this.article.avatar ? this.$ossProcess(this.article.avatar) : ''
    },
    // 时间
    time() {
      let time = this.article.update_time
      return time ? this.moment(time).format('YYYY-MM-DD HH:mm') : ''
    },
    // 剩余时间
    draftTimeEnd() {
      let time = this.draftTime
      if (time === 0) {
        return '预览链接24h后失效'
      } else {
        let h = parseInt(time / 60 / 60 % 24)
        let m = parseInt(time / 60 % 60)
        return `预览链接${h}小时${m}分钟后失效`
      }
    },
    postTime() {
      const helpText = '，如需修改内容请先取消发布'
      if (!this.article || !this.article.trigger_time) return ''
      if (this.article.triggered === 2) return '定时发布失败' + helpText
      const time = this.moment(this.article.trigger_time)
      const dateText = isNDaysAgo(-2, time) ? time.calendar() : time.format('MMMDo HH:mm')
      return `计划于 ${dateText} 发布` + helpText
    }
  },
  watch: {
    markdownContent() {
      this.finishViewContent()
    },
  },
  created() {
    if (process.browser) {
      this.$nextTick(() => {
        this.init()
      })
      this.previewDraftTime(this.$route.params.id)
    }
  },
  mounted() {

  },
  methods: {
    // 初始化
    init() {
      this.previewDraft(this.$route.params.id)
    },
    // 得到草稿
    async previewDraft(id) {
      await this.$API.previewDraft(id).then(res => {
        if (res.code === 0) {
          this.article = res.data
        } else {
          console.log(res.message)
          this.$refs.container.innerHTML = `<p class="not">${res.message}</p>`
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 草稿时间
    async previewDraftTime(id) {
      await this.$API.previewDraftTime(id)
        .then(res => {
          if (res.code === 0) {
            this.draftTime = res.data
          } else {
            console.log(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 完成优化文章样式
    finishViewContent() {
      this.$nextTick(() => {
        try {
          // eslint-disable-next-line no-undef
          if ($) {
            // eslint-disable-next-line no-undef
            finishView($('#doc'))
            // eslint-disable-next-line no-undef
          } else if (jQuery) {
            // eslint-disable-next-line no-undef
            finishView(jQuery('#doc'))
          } else {
            console.log('not $ jQuery')
          }
        } catch (e) {
          console.log('compiledMarkdown change', e)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview {
  max-width: 850px;
  width: 100%;
  margin: 0 auto;
}

.container {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background: #fff;
  margin: 20px 0;
  box-sizing: border-box;
  overflow: hidden;
  /deep/ .not {
    font-size: 20px;
    text-align: center;
    margin: 100px 0 200px;
    color: #717171;
    padding: 0;
  }
  .article-author {
    width: 100%;
    flex: 1;
  }
  header {
    padding: 0 20px;
    h1 {
      font-weight: 600;
      font-size: 24px;
      line-height: 1.5;
      margin: 24px 0 20px;
      word-wrap: break-word;
      overflow: hidden;
    }
    .author-info {
      margin: 0 0 0 10px;
      .author {
        font-size: 18px;
        font-weight: 500;
        color: #000000;
        margin: 0 0 4px 0;
        padding: 0;
        display: block;
      }
      .time {
        font-size: 16px;
        color: #b2b2b2;
        padding: 0;
        margin: 0;
        font-weight: 400;
      }
    }
    .components-avatar {
      width: 50px !important;
      height: 50px !important;
    }
  }
}

.TitleImage {
  display: block;
  margin: 0 auto;
  max-height: 344px;
  overflow: hidden;
  background: #fff;
  padding: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

article {
  padding: 0 20px 20px;
}

.tag-card {
  display: inline-block;
  background: @purpleLight;
  border-radius: 20px;
  font-size: 16px;
  color: @purpleDark;
  padding: 6px 10px;
  margin: 10px 0;
  text-align: center;
  transition: all 0.18s;

  &:hover {
    background-color: @purpleDark;
    color: #fff;
  }
}

.header {
  margin-bottom: 20px;
}
</style>