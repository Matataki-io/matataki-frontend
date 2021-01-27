<template>
  <div class="markdown-body markdown" v-html="content" />
</template>

<script>
/* eslint-disable */
// import '@matataki/editor/dist/css/index.css'

export default {
  head() {
    return {
      link: [
        // { rel: 'stylesheet', type: 'text/css', href: '/@matataki/editor/index.css' }, // editor css
      ],
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML'
        }
      ]
    }
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  created() {
  },
}
</script>