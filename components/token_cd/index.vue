<template>
  <div>
    <pCd v-if="mode === 'p'" v-show="showBanner" @publish="publish" />
    <tCd v-else-if="mode === 'token'" v-show="showBanner" @publish="publish" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pCd from './p_cd'
import tCd from './token_cd'
export default {
  name: 'TokenCd',
  components: {
    pCd,
    tCd
  },
  props: {
    mode: {
      type: String,
      required: true
    }
  },
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
      window.open(window.location.origin + '/token', '_blank')
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