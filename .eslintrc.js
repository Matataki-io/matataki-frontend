// https://zh.nuxtjs.org/guide/development-tools
// 暂时和移动端统一eslint
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
    'plugin:vue/essential',
    'prettier',
    'prettier/vue',
  ],
  rules: {
    quotes: [2, 'single'], // https://eslint.org/docs/2.0.0/rules/quotes
    semi: [2, 'never'], // https://eslint.org/docs/2.0.0/rules/semi
  }
}
