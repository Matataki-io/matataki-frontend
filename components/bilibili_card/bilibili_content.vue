<template>
  <p class="bilibili-content" v-html="content" />
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
    },
    mode: {
      type: Number,
      default: 0
    }
  },
  computed: {
    content () {
      return this.annotateHighlightText(this.selector(this.card))
    }
  },
  methods: {
    removeTwitterLink(text) {
      return text.replace(/https:\/\/t.co\/.+$/gm, '')
    },
    selector(card) {
      switch (this.mode) {
        case 1:
          return card.item.description || card.item.content
        case 2:
          return card.dynamic
        case 3:
          return card.vest.content
        default:
          return ''
      }
    },
    annotateHighlightText(text) {
      if (!text) return ''
      let topic, mention
      const textArr = text.split('')
      textArr.forEach((char, index) => {
        // # 话题
        if (char === '#') {
          if (topic) {
            textArr[index] = char + '</span>'
          } else {
            textArr[index] = '<span>' + char
          }
          topic = !topic
        // @ 提及
        } else if (char === '@' && !mention) {
          mention = true
          textArr[index] = '<span>' + char
        } else if (mention && [' ', ':', '@', '\n'].includes(char)) {
          mention = false
          textArr[index] = char + '</span>'
        }
      })
      return textArr.join('')
    }
  }
}
</script>

<style lang="less" scoped>
.bilibili-content {
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