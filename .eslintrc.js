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
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
  ],
  rules: {
    quotes: [2, 'single'], // https://eslint.org/docs/2.0.0/rules/quotes
    semi: [2, 'never'], // https://eslint.org/docs/2.0.0/rules/semi
    // https://github.com/ElemeFE/eslint-config-elemefe/blob/master/rules.js
    // // https://cn.eslint.org/docs/rules/
    'no-console': 0,
    indent : [1, 2, { 'SwitchCase': 1 }],
    'vue/no-v-html': 'off' // 关闭v-html检测
  }
}
