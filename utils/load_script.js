// 动态加载第三方js
export default (src) => {
  return new Promise((resolve, reject) => {
    const scriptAll = document.getElementsByTagName('script')
    const hasScript = [].slice.call(scriptAll).some(i => i.src === src)
    if (hasScript) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)

    script.onload = resolve
    script.onerror = reject
  })
}
