<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="user" />
      <no-content-prompt v-loading="loading" :list="list" class="card-container flex">
        <fansCard
          v-for="(item, i) in list"
          :key="i"
          class="fans-card"
          type="fan"
          :card="{
            ...item,
            id: item.uid }"
          @updateList="updateList"
        />
      </no-content-prompt>
      <user-pagination
        v-show="!loading"
        :current-page="currentPage"
        :params="params"
        :api-url="apiUrl"
        :total="total"
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
  name: 'Fans',
  components: {
    userLayout,
    userInfo,
    userNav,
    fansCard,
    userPagination
  },
  data() {
    return {
      currentPage: Number(this.$route.query.page) || 1,
      apiUrl: 'fansList',
      params: {
        uid: this.$route.params.id
      },
      list: [],
      total: 0,
      loading: false
    }
  },
  computed: {
  },
  async mounted() {
  },
  methods: {
    paginationData(res) {
      this.list = res.data.list
      this.total = res.data.totalFans || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.list = []
      this.currentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    },
    async updateList() {
      const data = await this.$API.getFans(this.$route.params.id, this.currentPage)
      this.paginationData(data)
    }
  }
}
</script>

<style lang="less" scoped>
.fans-card {
  margin-top: 40px;
  // &:nth-child(odd) {
    // margin-right: 30px;
  // }
}
</style>
<style lang="less" scoped src="../../index.less">
</style>
