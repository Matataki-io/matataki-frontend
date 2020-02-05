// 动态加载第三方js
export default (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)

    script.onload = resolve
    script.onerror = reject
  })
}
