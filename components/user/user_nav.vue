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
import { mapGetters } from 'vuex'
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
        // self 只有自己才能看
        { title: '创作', url: 'user-id', self: false },
        { title: '投资', url: 'user-id-investment', self: false },
        { title: '草稿', url: 'user-id-draft', self: true },
        { title: '粉丝', url: 'user-id-fan', self: false },
        { title: '关注', url: 'user-id-follow', self: false },
        { title: '购买', url: 'user-id-buy', self: true }
      ],
      setting: [ // todo 完善路由
        { title: '账户设置', url: 'user-setting', self: false }
      ],
      account: [ // todo 完善路由
        { title: '钱包', url: 'user-account', self: false },
        { title: '积分', url: 'user-account-integral', self: false }
      ]
    }
  },
  computed: {
    ...mapGetters(['isMe']),
    navList() {
      const isMe = this.isMe(this.$route.params.id)
      if (isMe) return this[this.navListUrl]
      else return this[this.navListUrl].filter(i => !i.self)
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
  padding-left: 10px;
  padding-right: 10px;
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
