
<template>
  <userPage>
    <div
      slot="list"
      v-loading="loading"
    >
      <div v-if="isMe(this.$route.params.id)" class="view-all">
        <el-checkbox v-model="showAll" @change="handleShowAllChange">
          显示所有文章
        </el-checkbox>
      </div>
      <no-content-prompt :list="articleCardData.articles">
        <articleCardListNew
          v-for="(item, index) in articleCardData.articles"
          :key="index"
          :card="item"
          :hide-author="true"
        />
        <user-pagination
          v-show="!loading"
          :current-page="currentPage"
          :params="articleCardData.params"
          :api-url="articleCardData.apiUrl"
          :page-size="articleCardData.params.pagesize"
          :total="total"
          :reload="articleCardData.reload"
          class="pagination"
          @paginationData="paginationData"
          @togglePage="togglePage"
        />
      </no-content-prompt>
    </div>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import userPagination from '@/components/user/user_pagination.vue'
import articleCardListNew from '@/components/article_card_list_new/index.vue'
import { extractChar } from '@/utils/reg'
import { mapGetters } from 'vuex'

export default {
  components: {
    userPage,
    userPagination,
    articleCardListNew
  },
  head() {
    return {
      title: `${this.userData.nickname || this.userData.username}的个人主页`,
      meta: [
        { hid: 'description', name: 'description', content: `${this.userData.introduction}` },
        /* <!--  Meta for Twitter Card --> */
        { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: '@Andoromeda' },
        { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: `${this.userData.nickname || this.userData.username}的个人主页` },
        { hid: 'twitter:description', name: 'description', property: 'twitter:description', content: `${this.userData.introduction}` },
        { hid: 'twitter:url', name: 'twitter:url', property: 'twitter:url', content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}` },
        { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.$API.getImg(this.userData.avatar) },
        /* <!--  Meta for OpenGraph --> */
        { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: '瞬MATATAKI' },
        { hid: 'og:title', name: 'og:title', property: 'og:title', content: `${this.userData.nickname || this.userData.username}的个人主页` },
        { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', name: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_PC_URL}/user/${this.$route.params.id}` },
        { hid: 'og:image', name: 'og:image', property: 'og:image', content: this.$API.getImg(this.userData.avatar) },
        { hid: 'og:description', name: 'description', property: 'og:description', content: `${this.userData.introduction}` }
        /* end */
      ],
    }
  },
  data() {
    return {
      articleCardData: {
        params: {
          author: this.$route.params.id,
          pagesize: 20,
          extra: 'short_content',
          showAll: this.showAll ? '1' : '0'
        },
        apiUrl: 'homeTimeRanking',
        articles: [],
        checked: true,
        reload: 0
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0,
      userData: Object.create(null),
      showAll: false
    }
  },
  computed: {
    ...mapGetters(['isMe']),
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
        title: `${this.userData.nickname || this.userData.username}的个人主页`,
        desc: this.userData.introduction || '暂无',
        imgUrl: this.userData.avatar ? this.$ossProcess(this.userData.avatar) : ''
      })
    },
    paginationData(res) {
      this.articleCardData.articles = res.data.list
      this.total = res.data.count || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.articleCardData.articles = []
      this.currentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    },
    // 显示所有文章Event
    handleShowAllChange() {
      this.articleCardData.params.showAll = this.showAll ? '1' : '0'
    }

  }
}
</script>

<style scoped>
.pagination {
  padding: 40px 5px;
}
.view-all {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
