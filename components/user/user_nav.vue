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
    navListUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: [
        { title: '原创', url: 'user-id' },
        { title: '投资', url: 'user-id-investment' },
        { title: '关注', url: 'user-id-follow' },
        { title: '粉丝', url: 'user-id-fan' }
      ],
      setting: [ // todo 完善路由
        { title: '我的账户', url: 'setting-id' },
        { title: '我的原创', url: 'setting-id-original' },
        { title: '我的投资', url: 'setting-id-investment' },
        { title: '我的草稿', url: 'setting-id-draft' },
        { title: '购买记录', url: 'setting-id-fan' },
        { title: '设置', url: 'setting-id-fan' }
      ]
    }
  },
  computed: {
    navList() {
      return this[this.navListUrl]
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
