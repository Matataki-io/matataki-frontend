<template>
  <nav class="nav">
    <a
      v-for="(item, index) in navList"
      :key="index"
      href="javascript:;"
      :class="$route.name === item.url && 'active'"
      @click="toggleNav(item.url)"
    >{{ item.title }}</a>
  </nav>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      navList: [
        { title: '原创', url: 'user-id' },
        { title: '投资', url: 'user-id-investment' },
        { title: '关注', url: 'user-id-follow' },
        { title: '粉丝', url: 'user-id-fan' }
      ]
    }
  },
  methods: {
    toggleNav(url) {
      if (url === this.$route.name) return
      this.$router.push({
        name: url,
        params: {
          id: this.$route.params.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  a {
    font-size:20px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:33px;
    text-decoration: none;
    margin-right: 50px;
    cursor: pointer;
    &.active {
      font-weight:bold;
    }
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
}
</style>
