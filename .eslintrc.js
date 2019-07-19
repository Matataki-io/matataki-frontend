module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier/vue',
    'plugin:prettier/recommended'
  ],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'max-len': ['error', { code: 160 }], // 最大长度
    // 关闭冲突规则
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
