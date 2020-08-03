<template>
  <img
    v-show="showBanner"
    src="@/assets/img/article_banner.png"
    alt="banner"
    class="article_banner"
    @click="publish"
  >
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isPublishToken: false,
      minetokenApplication: false,
      showBanner: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
  },
  mounted() {
    if (process.browser) {
      // 2s after 执行
      setTimeout(() => {
        this.getTokenUserData()
      }, 2000)
    }
  },
  methods: {

    publish() {
      if (this.isLogined) {
        window.open(window.location.origin + '/token', '_blank')
      } else {
        this.$store.commit('setLoginModal', true)
      }
    },
    // 获取 token user 的信息
    async getTokenUserData() {
      // 广告的展示机制：
      // 当前用户尚未登陆--展示
      // 当前登录的用户尚未发行--展示
      // 当前用户已经成功发行过Fan票--不展示 
      // 当前用户已经尝试过申请发行Fan票--不展示

      
      if (!this.isLogined) {
        // 当前用户尚未登陆--展示
        this.showBanner = true
        return 
      }

      const userResult = await this.$utils.factoryRequest(this.$API.tokenUserId(this.currentUserInfo.id))
      // 当前用户已经成功发行过Fan票--不展示 
      let userResultBoolean = userResult && !!userResult.data
      if (userResultBoolean) {
        this.showBanner = false
        return
      }

      // 申请信息
      let resultMinetokenApplication = await this.$utils.factoryRequest(this.$API.apiGetMinetokenApplication())
      let resultMinetokenApplicationBoolean = resultMinetokenApplication && !!resultMinetokenApplication.data
      if (resultMinetokenApplicationBoolean) {
        // 当前用户已经尝试过申请发行Fan票--不展示
        this.showBanner = false
        return
      }

      // 没有发token && 没有申请信息
      if (!userResultBoolean && !resultMinetokenApplicationBoolean) {
        this.showBanner = true
        return
      }

    },
  }
}
</script>

<style lang="less" scoped>
.article_banner {
  width: 100%;
  margin-top: 5px;
  cursor: pointer;
}
</style>