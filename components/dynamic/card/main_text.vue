<template>
  <p class="dynamic-text" v-html="content || '&nbsp;'" />
</template>

<script>
import { renderLinkUser } from '@/utils/share'
import { filterOutHtmlShare } from '@/utils/xss'

export default {
  components: {
  },
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    content() {
      // 向后兼容 this.card.short_content_share || this.card.short_content
      return this.$utils.compose(renderLinkUser, filterOutHtmlShare)(this.card.short_content_share || this.card.short_content)
    }
  }
}
</script>

<style lang="less" scoped>
.dynamic-text {
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
</style>