<template>
  <nav class="nav">
    <template
      v-for="(item, index) in navList"
    >
      <router-link
        v-if="item.url !== 'minetoken' || tokens"
        :key="index"
        :class="$route.name === item.url && 'active'"
        :to="{name: item.url}"
      >
        {{ item.title }}
      </router-link>
    </template>
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
      tokens: false
    }
  },
  computed: {
    ...mapGetters(['isMe']),
    user() {
      return [
      // self 只有自己才能看
        { title: this.$t('user.creation'), url: 'user-id', self: false },
        { title: this.$t('user.investment'), url: 'user-id-investment', self: false },
        { title: this.$t('user.draft'), url: 'user-id-draft', self: true },
        { title: this.$t('user.fan'), url: 'user-id-fan', self: false },
        { title: this.$t('user.follow'), url: 'user-id-follow', self: false },
        { title: this.$t('user.buy'), url: 'user-id-buy', self: true },
        { title: this.$t('user.bookmark'), url: 'user-id-bookmark', self: true }
      ]
    },
    setting() {
      return [ // todo 完善路由
        { title: this.$t('user.infoSetting'), url: 'setting', self: false },
        { title: this.$t('user.accountSetting'), url: 'setting-account', self: false },
        { title: this.$t('user.systemSetting'), url: 'setting-system', self: false }
      ]
    },
    account() {
      return [ // todo 完善路由
        { title: this.$t('user.wallet'), url: 'account', self: false },
        { title: this.$t('user.point'), url: 'points', self: false },
        { title: this.$t('user.invite'), url: 'invite', self: false }
      ]
    },
    token() {
      return [ // todo 完善路由
        { title: this.$t('user.buycoins'), url: 'tokens', self: false },
        { title: '持有的流动金', url: 'holdliquidity', self: false },
        { title: this.$t('user.selfcoins'), url: 'minetoken', self: false }
      ]
    },
    navList() {
      // TODO 之前个人主页和我的账户是同一页面 需要params id 现在可以考虑移除这个判断
      const isMe = this.isMe(this.$route.params.id)
      if (isMe) return this[this.navListUrl]
      else return this[this.navListUrl].filter(i => !i.self)
    }
  },
  created() {
    this.getMyUserData()
  },
  methods: {
    async getMyUserData() {
      const res = await this.$API.getMyUserData().then(res => {
        const statusToken = (res.data.status & this.$userStatus.hasMineTokenPermission)
        if (res.code === 0 && statusToken) this.tokens = true
      }).catch(err => {
        console.log(err)
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
    font-size: 18px;
    line-height:33px;
    text-decoration: none;
    margin-right: 20px;
    color: #333;
    cursor: pointer;
    &.active {
      font-weight:bold;
      color:rgba(0,0,0,1);
    }
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
}
</style>
