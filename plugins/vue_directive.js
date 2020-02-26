import Vue from 'vue'

// v-highlight 因为自带的这个大部分无法正常工作, 手动set一次
Vue.directive('highlight',function (el) {
  let len = 0
  try {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach((block)=>{
        hljs.highlightBlock(block)
    })
  } catch (error) {
    len++
    if (len >= 10) console.log(error)
    return
  }
})