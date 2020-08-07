<template>
  <div v-show="show && isLogined" class="navigation">
    <div
      v-for="(tag, index) in tags"
      :key="index"
      class="navigation-entry"
      :class="activeTag === tag.id && 'active'"
      @click="goAnchor(tag.id)"
    >
      <p>
        {{ tag.title }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import throttle from 'lodash/throttle'

export default {
  data() {
    return {
      show: false,
      showPosition: 100,
      activeTag: '',
      tags: [
        {
          id: 'my-token',
          title: '我的'
        },
        {
          id: 'turnover',
          title: '流水'
        },
        {
          id: 'all-token',
          title: '全部'
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
  },
  watch: {
  },
  mounted() {
    if (process.browser) {
      this.$nextTick(() => {
        if (this.showPosition !== 0) {
          this._scrollShow()
          this.scrollEvent = throttle(this._scrollShow, 300)
          window.addEventListener('scroll', this.scrollEvent)
        }
      })
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    goAnchor(id) {
      var anchor = document.getElementById(id)
      console.log(id, anchor)
      if(!anchor) return

      const offsetTop = anchor.offsetTop - 80

      // chrome, firefox, safari
      document.body.scrollTop = offsetTop
      document.documentElement.scrollTop = offsetTop
      // window.pageYOffset = offsetTop

      anchor.classList.add('play-prompt')
    },
    _scrollShow() {
      const currentTop = document.body.scrollTop || document.documentElement.scrollTop
      if (currentTop > this.showPosition) this.show = true
      else this.show = false

      // 标记当前页面位置
      let activeTag = ''
      for (let i = 0; i < this.tags.length; i++) {
        const anchor = document.getElementById(this.tags[i].id)
        if (!anchor) continue
        if (currentTop >= anchor.offsetTop - 80)
          activeTag = this.tags[i].id
        else break
      }
      this.activeTag = activeTag
      
      console.log('位置：', currentTop, activeTag)
    }
  }
}
</script>

<style scoped lang="less">
.navigation {
  position: fixed;
  right: 40px;
  bottom: 170px;
  width: 45px;
  background: white;
  box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
  padding: 10px 0;
  z-index: 99;
  cursor: pointer;
  &-entry {
    transition: all 0.3s ease-in;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    p {
      transition: all 0.3s ease-in;
      margin: 0;
      font-size: 16px;
      color: #B2B2B2;
      white-space:nowrap;
    }
    @media screen and (min-width: 768px) {
      &:hover {
        background: #AF9BF3;
        p {
          color: white;
        }
      }
    }
    &.active {
      background: #896DF0;
      p {
        color: white;
      }
      @media screen and (min-width: 768px) {
        &:hover {
          background: #542DE0;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .navigation {
    right: 20px;
    width: 30px;
    bottom: 140px;
    &-entry {
      p {
        font-size: 12px;
      }
    }
  }
}
</style>
