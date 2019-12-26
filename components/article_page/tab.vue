<template>
  <div>
    <div class="main-nav">
      <div class="nav-title">
        <span
          v-for="(item, index) in head"
          :key="index"
          :class="index === idx && 'active'"
          @click="setNav(index)"
        >
          {{ item.lab }}
        </span>
      </div>
      <slot name="sort" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    idx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      head: [
        {
          url: 'article',
          lab: '综合创作',
          href: '/article'
        },
        {
          url: 'article-token',
          lab: 'Fan圈',
          href: '/article/token'
        },
        {
          url: 'article-follow',
          lab: '我的关注',
          href: '/article/follow'
        }
      ]
    }
  },
  methods: {
    setNav(i) {
      this.$emit('setIdx', i)
    }
  }
}
</script>

<style lang="less" scoped>
.main-nav {
  height: 50px;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .nav-title {
    span {
      font-size: 20px;
      color:rgba(0,0,0,1);
      line-height:1;
      cursor: pointer;
      transition: all .3s;
      font-weight:400;
      margin-right: 30px;
      text-decoration: none;
      &.active {
        font-weight: bold;
      }
      em {
        font-size: 20px;
        font-style: normal;
        color: @purpleDark;
      }
    }
  }

}
</style>
