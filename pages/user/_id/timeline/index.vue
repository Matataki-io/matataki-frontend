
<template>
  <userPage>
    <userTwitterTimeline v-if="tab === 'twitter'" slot="list" />
    <userBilibiliTimeline v-else slot="list" />
  </userPage>
</template>

<script>
import { extractChar } from '@/utils/reg'

import userPage from '@/components/user/user_page.vue'
import userTwitterTimeline from '@/components/user_timeline/twitter.vue'
import userBilibiliTimeline from '@/components/user_timeline/bilibili.vue'

export default {
  components: {
    userPage,
    userTwitterTimeline,
    userBilibiliTimeline
  },
  head() {
    return {
      title: `${this.userData.nickname || this.userData.username}的动态时间线`,
      meta: [
        { hid: 'description', name: 'description', content: `${this.userData.introduction}` },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: `${this.userData.nickname || this.userData.username}的动态时间线` },
        { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: `${this.userData.introduction}` },
        { hid: 'twitter:url', name: 'twitter:url', property: 'twitter:url', content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}/twitter` },
        { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.$API.getImg(this.userData.avatar) },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: '瞬MATATAKI' },
        { hid: 'og:title', name: 'og:title', property: 'og:title', content: `${this.userData.nickname || this.userData.username}的动态时间线` },
        { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', name: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}/twitter` },
        { hid: 'og:image', name: 'og:image', property: 'og:image', content: this.$API.getImg(this.userData.avatar) },
        { hid: 'og:description', name: 'description', property: 'og:description', content: `${this.userData.introduction}` }
        /* end */
      ],
    }
  },
  data() {
    return {
      userData: Object.create(null)
    }
  },
  computed: {
    tab () {
      return this.$route.query.tab || 'twitter'
    }
  },
  async asyncData({ $axios, route, req }) {
    // 获取cookie token
    let accessToekn = ''
    // 请检查您是否在服务器端
    if (process.server) {
      const cookie = req && req.headers.cookie ? req.headers.cookie : ''
      const token = extractChar(cookie, 'ACCESS_TOKEN=', ';')
      accessToekn = token ? token[0] : ''
    }
    const res = await $axios({
      url: `/user/${route.params.id}`,
      methods: 'get',
      headers: { 'x-access-token': accessToekn }
    })
    if (res.code === 0) {
      return {
        userData: res.data || Object.create(null)
      }
    } else {
      console.error(res.message)
    }
  },
  created() {
    if (process.browser) {
      this.setWeChatShare()
    }
  },
  methods: {
    // 设置微信分享
    setWeChatShare() {
      this.$wechatShare({
        title: `${this.userData.nickname || this.userData.username}的 Twitter 时间线`,
        desc: this.userData.introduction || '暂无',
        imgUrl: this.userData.avatar ? this.$ossProcess(this.userData.avatar) : ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
