<template>
  <userLayout>
    <template slot="main">
      <user-nav />
      <div v-loading="!showCard" class="card-container">
        <fansCard v-for="(item, i) in fans.list" :key="i" class="fans-card" :card="item" @updateList="getFans"/>
      </div>
      <user-pagination
        v-show="showCard"
        :current-page="currentPage"
        :params="params"
        :api-url="apiUrl"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </template>
    <template slot="info">
      <userInfo />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import userInfo from '@/components/user/user_info.vue'
import userNav from '@/components/user/user_nav.vue'
import fansCard from '@/components/fansCard.vue'
import userPagination from '@/components/user/user_pagination.vue'
export default {
  name: 'Follows',
  components: {
    userLayout,
    userInfo,
    userNav,
    fansCard,
    userPagination
  },
  data() {
    return {
      fans: {},
      currentPage: Number(this.$route.query.page) || 1,
      apiUrl: 'followsList',
      params: {
        uid: this.$route.params.id
        // pagesize: 20
      },
      list: []
    }
  },
  async mounted() {
  },
  computed: {
    showCard() {
      return this.list.length !== 0
    }
  },
  methods: {
    paginationData(data) {
      this.list = data
    },
    togglePage(i) {
      this.list = []
      this.currentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.fans-card {
  margin-bottom: 40px;
  &:nth-child(odd) {
    margin-right: 30px;
  }
}
</style>
<style lang="less" scoped src="../../index.less">
</style>
