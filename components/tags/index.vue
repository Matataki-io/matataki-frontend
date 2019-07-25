<template>
  <div
    ref="tags"
    class="tags"
    :class="[!navShow && 'fix', !navShow && (typeIndex === 0 ? 'article' : 'commodity')]"
  >
    <div
      v-for="(itme, index) in tagList"
      :key="index"
      class="tag"
      :class="typeIndex === 0 ? 'article' : 'commodity'"
    >
      <div class="tag-icon">
        <img :src="comment" alt="icon">
      </div>
      <span>大咖解说</span>
      <div class="full-bc" />
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import comment from '@/assets/img/tags/comment.svg'

export default {
  props: {
    typeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      comment,
      navShow: true,
      oldOffSetTop: 0
    }
  },
  computed: {
    tagList() {
      return this.typeIndex === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [1, 2, 3, 4]
    }
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
    width: 374px;
  }
  &.commodity {
    width: 270px;
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
    width: calc(50% - 6px);
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
  &:hover {
    background: red;
  }
  .tag-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: #62bbff;
    img {
      width: 76%;
      height: 76%;
      object-fit: contain;
    }
  }
  span {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 28px;
    flex: 1;
  }
  .full-bc {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }
}
</style>
