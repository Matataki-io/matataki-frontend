<template>
  <userLayout>
    <template slot="main">
      <user-nav nav-list-url="setting" />
      <!-- todo 目前得不到页数, 页面太后没数据会一直loading  -->
      <div v-loading="loading" class="card-container">
        <buy v-for="(item, index) in articleCardData.articles" :key="index" :buy="item" />
      </div>
      <user-pagination
        v-show="!loading"
        :current-page="currentPage"
        :params="articleCardData.params"
        :api-url="articleCardData.apiUrl"
        :page-size="3"
        :total="total"
        class="pagination"
        :need-access-token="true"
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
import userPagination from '@/components/user/user_pagination.vue'
import buy from '@/components/buy_card/index.vue'
export default {
  components: {
    userLayout,
    userInfo,
    userNav,
    userPagination,
    buy
  },
  data() {
    return {
      articleCardData: {
        params: {
          user: this.$route.params.id,
          pagesize: 3
        },
        apiUrl: 'buyHistory',
        articles: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  computed: {

  },
  methods: {
    paginationData(res) {
      this.articleCardData.articles = res.data.list
      this.total = res.data.count
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
    del(i) {
      // 删除草稿
      const asyncSuccessDel = async (id, index) => {
        try {
          const res = await this.$backendAPI.delDraft({ id })
          if (res.status === 200 && res.data.code === 0) {
            this.articleCardData.articles.splice(index, 1) // 前端手动删除一下数据
            this.$message({ type: 'success', message: '删除成功!' })
          } else {
            this.$message.error('删除错误')
          }
        } catch (error) {
          this.$message.error('删除错误')
        }
      }

      console.log(i)
      this.$confirm('是否删除草稿？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        asyncSuccessDel(this.articleCardData.articles[i].id, i)
      })
    }
  }
}
</script>

<style lang="less" scoped src="../../index.less">
</style>
