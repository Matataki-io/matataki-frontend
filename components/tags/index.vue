<template>
  <el-row>
    <el-col
      v-for="(item, index) in tagCards"
      :key="index"
      :span="typeIndex === 0 ? 12 : 24"
    >
      <tag :type-index="typeIndex" :tag="item" />
    </el-col>
  </el-row>
</template>

<script>
import throttle from 'lodash/throttle'
import tag from './tag.vue'

export default {
  components: {
    tag
  },
  props: {
    typeIndex: { // 通过 0 1 判断标签和布局类型  0 => 12 1 => 24
      type: Number,
      default: 0
    },
    tagCards: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // navShow: true,
      // oldOffSetTop: 0
    }
  },
  computed: { },
  created() {
  },
  // mounted() {
  //   this.oldOffSetTop = this.$refs.tags.offsetTop
  //   this.addHandleScroll()
  // },
  // destroyed() {
  //   this.removeHandleScroll()
  // },
  methods: {
    // addHandleScroll() {
    //   window.addEventListener('scroll', throttle(this.handleScroll, 150))
    //   window.addEventListener('resize', throttle(this.setOffSetTop, 150))
    // },
    // setOffSetTop() {
    //   this.oldOffSetTop = this.$refs.tags.offsetTop
    // },
    // handleScroll() {
    //   const scrollTop =
    //     window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

    //   // console.log(this.$refs.tags.offsetTop, scrollTop + 100, this.oldOffSetTop)
    //   scrollTop + 100 > this.oldOffSetTop ? (this.navShow = false) : (this.navShow = true)
    // },
    // removeHandleScroll() {
    //   window.removeEventListener('scroll', this.handleScroll)
    // }
  }
}
</script>
