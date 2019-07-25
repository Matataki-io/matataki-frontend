<template>
  <div
    ref="tags"
    class="tags"
    :style="tagStyleObject"
    :class="[!navShow && 'fix', !navShow && (typeIndex === 0 ? 'article' : 'commodity')]"
  >
    <tag
      v-for="(item, index) in tagCards"
      :key="index"
      :type-index="typeIndex"
      :tag="item"
    />
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import tag from './tag.vue'

export default {
  components: {
    tag
  },
  props: {
    typeIndex: {
      type: Number,
      default: 0
    },
    tagCards: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      navShow: true,
      oldOffSetTop: 0
    }
  },
  computed: { },
  created() {
  },
  mounted() {
    this.oldOffSetTop = this.$refs.tags.offsetTop
    this.addHandleScroll()
  },
  destroyed() {
    this.removeHandleScroll()
  },
  methods: {
    addHandleScroll() {
      window.addEventListener('scroll', throttle(this.handleScroll, 150))
    },
    handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

      // console.log(this.$refs.tags.offsetTop, scrollTop + 100, this.oldOffSetTop)
      scrollTop + 100 > this.oldOffSetTop ? (this.navShow = false) : (this.navShow = true)
    },
    removeHandleScroll() {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
}
</script>

<style lang="less" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
}
.fix {
  position: fixed;
  top: 60px;
  &.article {
    width: 334px;
  }
  &.commodity {
    width: 230px;
  }
}
.tag {
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s;
  &.article {
    max-width: calc(50% - 6px);
    flex: calc(50% - 6px);
    &:nth-child(even) {
      margin-left: 6px;
    }
    &:nth-child(odd) {
      margin-right: 6px;
    }
  }
  &.commodity {
    width: 100%;
    flex: 0 0 100%;
  }
}
</style>
