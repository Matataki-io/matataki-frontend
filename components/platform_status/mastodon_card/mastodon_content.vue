<template>
  <p class="mastodon-content" v-html="content" />
</template>

<script>

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
    content () {
      if (!this.card) return ''
      return this.card.content || ''
    }
  }
}
</script>

<style lang="less" scoped>
.mastodon-content {
  color: black;
  white-space: pre-line;
  /deep/ span {
    color: #1b95e0;
    &:hover {
      text-decoration: underline;
    }
  }
  /deep/ a {
    color: #1b95e0;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>