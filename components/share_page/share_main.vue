<template>
  <div class="share-main">
    <div class="content" v-html="contentHtml" />
  </div>
</template>
<script>
import { filterOutHtmlShare } from '@/utils/xss'
import { renderLinkUser } from '@/utils/share'

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 分享内容
    contentHtml() {
      if (process.browser) {
        return this.$utils.compose(renderLinkUser, filterOutHtmlShare)(this.content)
      } else {
        return this.$utils.compose(filterOutHtmlShare)(this.content)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.share-main {
  position: relative;
  .content {
    font-size: 16px;
    color: #333;
    overflow: hidden;
    width: 100%;
    word-break: break-word;
    white-space: pre-line;
    line-height: 1.5;
    em {
      font-weight: bold;
      font-style: normal;
      color: @purpleDark;
    }
    a {
      color: rgb(47, 174, 227)
    }
  }
}
</style>
