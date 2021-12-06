const PriceFormatter = {
  formatPrice(price, unit = 'EOS') {
    return `${(price / 10000).toDecimal(4)} ${unit}`
  },
  install(Vue) {
    Vue.filter('price', (value, unit) => PriceFormatter.formatPrice(value, unit))
  }
}

export default PriceFormatter
