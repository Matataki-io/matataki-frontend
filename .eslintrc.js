module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'vue/no-v-html': 0, // 使用 v-html 前要确保 xss 过滤了
    'no-console': 0,
    'no-unused-vars': 0,
    'spaced-comment': 'off',
    'arrow-parens': 'off',
  }
}
