<template>
  <div class="markdown-body markdown" v-html="content" />
</template>

<script>
/* eslint-disable */
import '@matataki/editor/dist/css/index.css'

export default {
  head: {
    script: [
      { src: '/bowl.min.js' }
    ]
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  created() {
    if (process.browser) {
      var bowl = new Bowl()
      console.log('bowl', bowl)
      bowl.add([
        { url: '/github-markdown.min.css', key: 'style_github_markdown' },
        // { url: '/katex.min.css', key: 'style_katex' },
        { url: '/highlight.default.min.css', key: 'style_highlight_default' },
        { url: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML', key: 'script_mathjax' },
      ])
      bowl.inject().then(() => {
        console.log('done')
      }).catch(e => {
        console.log('error', e)
      }) 
    }
  },
}
</script>