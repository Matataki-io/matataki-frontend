<template>
  <ul class="home-fixed mw" :class="!navShow && 'show'">
    <li
      v-for="(item, index) in navMenu"
      :key="index"
      :class="activeIndex === index && 'active'"
      @click="$emit('toggleNavMenu', index)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script>
import throttle from 'lodash/throttle'
import { setTimeout } from 'timers'

export default {
  name: 'HomeNav',
  props: ['navMenu', 'activeIndex'],
  data() {
    return {
      navShow: true,
      oldScrollTop: 100
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.addHandleScroll()
    }, 150)
  },
  destroyed() {
    this.removeHandleScroll()
  },
  methods: {
    addHandleScroll() {
      window.addEventListener('scroll', throttle(this.handleScroll, 300))
    },
    handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop - this.oldScrollTop > 0) {
        // console.log('fix');
        this.navShow = false
      } else {
        // console.log('no');
        this.navShow = true
      }
      this.oldScrollTop = scrollTop

      if (scrollTop <= 50) this.navShow = true
    },
    removeHandleScroll() {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
}
</script>

<style lang="less" scoped>
.home-fixed {
  position: fixed;
  top: 50px;
  right: 0;
  left: 0;
  z-index: 98;
  transition: all 0.3s;
  &.show {
    top: 0;
  }
}
ul {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  background-color: #fff;
  li {
    font-size: 20px;
    font-weight: 400;
    color: rgba(219, 219, 219, 1);
    margin: 0 12px;
    padding: 0;
    transition: all 0.18s ease-in-out;
    cursor: pointer;
    &:nth-child(1) {
      margin-left: 0;
    }
    &.active {
      color: rgba(51, 51, 51, 1);
    }
  }
}
</style>
