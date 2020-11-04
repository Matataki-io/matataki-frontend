<template>
  <p class="twitter-content" v-html="content" />
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
      return this.annotateHighlightText(this.card.text)
    }
  },
  methods: {
    removeTwitterLink(text) {
      return text.replace(/https:\/\/t.co\/.+$/gm, '')
    },
    annotateHighlightText(text) {
      const textArr = text.split('')
      if (this.card.entities) {
        const { user_mentions, hashtags, media, urls } = this.card.entities
        if (user_mentions) {
          user_mentions.forEach(mention => {
            textArr[mention.indices[0]] = '<span>' + textArr[mention.indices[0]]
            textArr[mention.indices[1] - 1] = textArr[mention.indices[1] - 1] + '</span>'
          })
        }

        if (hashtags) {
          hashtags.forEach(hashtag => {
            textArr[hashtag.indices[0]] = '<span>' + textArr[hashtag.indices[0]]
            textArr[hashtag.indices[1] - 1] = textArr[hashtag.indices[1] - 1] + '</span>'
          })
        }

        if (media) {
          media.forEach(aMedia => {
            textArr.fill('', aMedia.indices[0], aMedia.indices[1])
          })
        }

        if (urls) {
          urls.forEach(url => {
            console.log('url:', url)
            textArr.fill('', url.indices[0], url.indices[1])
            textArr[url.indices[0]] = `<a href="${url.expanded_url}" target="_blank">${url.display_url}</a>`
          })
        }
      }
      return textArr.join('')
    }
  }
}
</script>

<style lang="less" scoped>
.twitter-content {
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