module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'import',
      {
        libraryName: 'iview',
        libraryDirectory: 'src/components'
      }
    ],
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
