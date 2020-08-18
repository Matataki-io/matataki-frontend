
<template>
  <userPage>
    <div
      slot="list"
      v-loading="loading"
    >
      <no-content-prompt :list="articleCardData.articles">
        <a
          v-for="(item, index) in articleCardData.articles"
          :key="item.id"
          class="tiny-hand"
          @click="routerGo(item)"
        >
          <draftArticleCardMini
            :is-draft-card="true"
            :index="index"
            :card="item"
            @del="del"
            @deltimer="cancelTimer"
          />
        </a>
        <user-pagination
          v-show="!loading"
          :current-page="currentPage"
          :params="articleCardData.params"
          :api-url="articleCardData.apiUrl"
          :page-size="articleCardData.params.pagesize"
          :total="total"
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
import draftArticleCardMini from '@/components/draft_artifcle_card_mini/index.vue'

export default {
  components: {
    userPage,
    userPagination,
    draftArticleCardMini
  },
  data() {
    return {
      articleCardData: {
        params: {
          pagesize: 20
        },
        apiUrl: 'draftboxList',
        articles: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  methods: {
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
    del(i) {
      // 删除草稿
      const asyncSuccessDel = async (id, index) => {
        try {
          const res = await this.$API.delDraft({ id })
          if (res.code === 0) {
            this.articleCardData.articles.splice(index, 1) // 前端手动删除一下数据
            this.$message({ 
              showClose: true,
              type: 'success', 
              message: '删除成功!'
            })
          } else {
            this.$message({ showClose: true, message: '删除错误', type: 'error'})
          }
        } catch (error) {
          this.$message({ showClose: true, message: '删除错误', type: 'error'})
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
    },
    cancelTimer(i) {
      this.$confirm('是否取消定时发布？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.$API.deleteTimedPublishTask(this.articleCardData.articles[i].id)
          if (res.code === 0) {
            this.articleCardData.articles[i].triggered = null
            this.articleCardData.articles[i].trigger_time = null
            this.$message.success('取消成功')
          }
          else this.$message.error(res.message)
        }
        catch (e) {
          console.error(e)
          this.$message.error(`错误：${e.toString()}`)
        }
      })
    },
    routerGo(data) {
      if (!data.trigger_time) {
        this.$router.push({
          name: 'publish-type-id',
          params: { type: 'draft', id: data.id }
        })
      }
      else this.preview(data)
    },
    async preview(data) {
      const res = await this.previewSetId(data.id)
      if (res) {
        this.$router.push({
          name: 'preview-id',
          params: { id: data.id }
        })
      }
    },
    // 允许草稿预览
    async previewSetId(id) {
      try {
        const res = await this.$API.previewSetId({ id })
        if (res.code === 0) {
          return true
        } else {
          this.$message({ showClose: true, message: res.message, type: 'error' })
          return false
        }
      } catch (e) {
        console.log(e)
        return false
      }
    }
  }
}
</script>

<style scoped>
.pagination {
  padding: 40px 5px;
}
.tiny-hand {
  cursor: pointer;
}
</style>
