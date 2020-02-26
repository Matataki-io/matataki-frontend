import Vue from 'vue'

// v-highlight 因为自带的这个大部分无法正常工作, 手动set一次
Vue.directive('highlight',function (el) {
  const setHljs = () => {
    try {
      let blocks = el.querySelectorAll('pre code')
      blocks.forEach((block)=>{
          hljs.highlightBlock(block)
      })
    } catch (error) {
      console.log(error)
      return
    }
  }
  // 次数
  let len = 0
  let timer = null

  timer = setInterval(() => {
    try {
      if (hljs || len >= 100) {
        setHljs()
        clearInterval(timer)
      }
      len++
    } catch (error) {
      return
    }
  }, 300)


})