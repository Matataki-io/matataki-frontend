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

    }
  },
  computed: {
    ...mapGetters(['isMe']),
    navList() {
      const isMe = this.isMe(this.$route.params.id)
      if (isMe) return this.user
      else return this.user.filter(i => !i.self)
    },
    user() {
      return [
      // self 只有自己才能看
        { title: this.$t('user.creation'), url: 'user-id', self: false },
        { title: this.$t('user.investment'), url: 'user-id-investment', self: false },
        { title: this.$t('user.draft'), url: 'user-id-draft', self: true },
        { title: this.$t('user.fan'), url: 'user-id-fan', self: false },
        { title: this.$t('user.follow'), url: 'user-id-follow', self: false },
        { title: this.$t('user.buy'), url: 'user-id-buy', self: true }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  width: 766px;
  // text-align: center;
  margin: 0 auto;
  padding: 20px 0 10px;
  a {
    font-size: 18px;
    line-height:33px;
    text-decoration: none;
    margin: 0 10px;
    cursor: pointer;
    color: #333;
    &.active {
      font-weight:bold;
      color:rgba(0,0,0,1);
    }
  }
}
</style>
