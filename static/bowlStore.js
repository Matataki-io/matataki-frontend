const list = [
  { url: '/theme/index.2.13.2.css', key: 'ui_element' },
  { url: '/vant/index.2.8.5.css', key: 'ui_vant' },
  { url: '/@matataki/editor/css/index.1.0.1.css', key: 'style_matatakiEditor' },
  { url: '/github-markdown.1.0.0.min.css', key: 'style_githubMarkdown' },
  // { url: '/katex.min.css', key: 'style_katex' },
  // { url: '/highlight.default.min.css', key: 'style_highlight_default' },
  { url: '/gt.1.0.0.js', key: 'script_gt' },
  { url: '/html2canvas.1.0.0.min.js', key: 'script_html2canvas' },
]
try {
  if (Bowl) {
    var bowl = new Bowl()
    bowl.add(list)
    bowl.inject().then(() => {
      let info = list.map(i => i.key)
      console.log('inject done', info.join(','))
    })
  } else {
    console.log('no bowl')
  }
} catch (e) {
  console.log('bowl error', e.toString())
}