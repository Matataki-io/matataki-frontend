<template>
  <nav class="nav">
    <router-link
      v-for="(item, index) in navList"
      :key="index"
      :class="$route.name === item.url && 'active'"
      :to="{name: item.url, params: {id: $route.params.id}}"
    >
      {{ item.title }}
    </router-link>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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
      ]
    }
  },
  computed: {
    ...mapGetters(['isMe']),
    navList() {
      const isMe = this.isMe(this.$route.params.id)
      if (isMe) return this.user
      else return this.user.filter(i => !i.self)
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  text-align: center;
  padding: 20px 0 10px;
  a {
    font-size:20px;
    font-weight:400;
    line-height:33px;
    text-decoration: none;
    margin: 0 20px;
    cursor: pointer;
    color: #333;
    &.active {
      font-weight:bold;
      color:rgba(0,0,0,1);
    }
  }
}
</style>
