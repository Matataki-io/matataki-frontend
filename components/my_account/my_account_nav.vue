<template>
  <div class="info">
    <router-link
      v-for="(tag, index) in tagsList"
      :key="index"
      :to="{ name: tag.url }"
      :class="$route.name === tag.url && 'active'"
    >
      {{ tag.title }}
    </router-link>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      tagsList: [
        { title: this.$t('user.userInformation'), url: 'setting' },
        { title: this.$t('user.accountSetting'), url: 'setting-account' },
        { title: this.$t('user.fanWallet'), url: 'tokens' },
        { title: this.$t('user.applycoins'), url: 'tokens-apply' },
        { title: this.$t('user.myBookmark'), url: 'bookmark' },
        { title: this.$t('user.wallet'), url: 'account' },
        { title: this.$t('user.buyHistory'), url: 'buy' },
        { title: this.$t('user.invite'), url: 'invite' },
        { title: this.$t('user.systemSetting'), url: 'setting-system' }
      ],
      tokens: false
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.whichButtonToShow()
  },
  mounted() {
  },
  methods: {
    async whichButtonToShow() {
      await this.getMyUserData()
      const i = this.tagsList.findIndex(tag => tag.url === 'tokens-apply')
      if (i !== -1 && this.tokens) {
        this.tagsList[i].title = this.$t('user.editcoins')
        this.tagsList[i].url = 'editminetoken'
        this.tokenDetail()
      }
    },
    async tokenDetail() {
      await this.$API.tokenDetail().then(res => {
        if (res.code === 0) {
          if (!res.data.token) {
            const i = this.tagsList.findIndex(tag => tag.url === 'editminetoken')
            if (i !== -1) {
              this.tagsList[i].url = 'postminetoken'
            }
          }
        } else {
          this.$message({ showClose: true, message: res.message, type: 'error' })
        }
      })
    },
    async getMyUserData() {
      await this.$API.getMyUserData().then(res => {
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
.info {
  overflow: hidden;
  background-color: #fff;
  border-radius: @br10;
  padding: 10px 20px;
  a {
    display:block;
    color: #000;
    font-size: 18px;
    padding: 10px 0;
    &.active {
      font-weight:bold;
      color:rgba(0,0,0,1);
    }
  }
}
</style>
