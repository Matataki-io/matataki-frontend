<template>
  <div class="share-main">
    <svg-icon
      class="icon"
      icon-class="quotation_marks"
    />
    <svg-icon
      class="icon"
      icon-class="quotation_marks"
    />
    <div class="content" v-html="contentHtml" />
    <!-- <p></p> -->
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
  margin: 0 20px;
  padding: 0 20px;
  position: relative;
  .icon {
    position: absolute;
    color: @purpleDark;
    font-size: 12px;
    &:nth-child(1) {
      left: 0;
      top: 0;
    }
    &:nth-child(2) {
      bottom: 0;
      right: 0;
      transform: rotate(-180deg);
    }
  }
  .content {
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 1.5;
    padding: 0;
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
    /deep/ a {
      color: rgb(47, 174, 227)
    }
  }
}
</style>
