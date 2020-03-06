<template>
  <div class="main-all">
    <div class="main-head__nav">
      <ul class="nav-title">
        <li
          v-for="(item, index) in head"
          :key="index"
          :class="index === idx && 'active'"
          @click="setNav(index)"
        >
          {{ item.lab }}
        </li>
      </ul>
      <slot name="sort"></slot>
    </div>
    <slot></slot>
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
          lab: this.$t('home.allCreation'),
          href: '/article'
        },
        {
          url: 'article-token',
          lab: this.$t('home.fanCircle'),
          href: '/article/token'
        },
        {
          url: 'article-follow',
          lab: this.$t('home.myFocus'),
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
.main-head__nav {
  height: 50px;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .nav-title {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    li {
      font-size: 20px;
      color:rgba(0,0,0,1);
      line-height:1;
      cursor: pointer;
      transition: all .3s;
      font-weight:400;
      margin: 0 30px 0 0;
      padding: 0;
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
