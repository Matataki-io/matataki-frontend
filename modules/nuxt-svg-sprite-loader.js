import packageName from 'depcheck-package-name'
import path from 'path'

const resolve = (dir) => path.join(__dirname, dir)
const svgRulePredicate = rule => rule.test && rule.test.test('.svg')

export default function (moduleOptions) {
  const options = { ...this.options.spriteSvgLoader, ...moduleOptions }
  this.extendBuild(config => {
    const imageLoaderRule = config.module.rules.find(svgRulePredicate)
    console.log('imageLoaderRule', imageLoaderRule, resolve('../icons/svg'))
    imageLoaderRule.exclude = [resolve('../icons/svg')]

    config.module.rules.push({
      loader: packageName`svg-sprite-loader`,
      options,
      include: [resolve('../icons/svg')], // include => 只处理指定的文件夹下的文件
      test: /\.svg$/,
    })
  })
}