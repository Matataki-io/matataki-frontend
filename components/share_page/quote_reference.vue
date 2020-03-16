<template>
  <div>
    <template v-for="(item, index) in pull.list">
      <shareOuterCard
        v-if="item.ref_sign_id === 0"
        :key="index"
        :card="item"
        card-type="read"
        class="list-card"
      />
      <sharePCard
        v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
        :key="index"
        :card="item"
        card-type="read"
        class="list-card"
      />
      <shareInsideCard
        v-else-if="item.ref_sign_id && item.channel_id === 3"
        :key="index"
        :card="item"
        :toggle-article="true"
        card-type="read"
        class="list-card"
        @getArticle="getArticle"
      />
    </template>

    <div
      v-show="pull.list.length !== 0"
      v-loading="loading"
      class="pagination"
    >
      <user-pagination
        :url-replace="$route.params.id + ''"
        :current-page="currentPage"
        :params="pull.params"
        :api-url="pull.apiUrl"
        :page-size="pull.params.pagesize || 20"
        :total="total"
        :need-access-token="true"
        :reload="nowTime"
        :small="true"
        :select-class="'user-pagination-light'"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </div>
    <p
      v-if="pull.list.length === 0"
      class="not-prompt"
    >
      暂无内容
    </p>
  </div>
</template>

<script>
import shareOuterCard from '@/components/share_outer_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: {
    shareOuterCard,
    shareInsideCard,
    sharePCard,
    userPagination
  },
  props: {
    nowTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1,
      loading: true, // 加载数据
      total: 0,
      pull: {
        params: {
          pagesize: 5
        },
        apiUrl: 'postsReferences',
        list: []
      }
    }
  },
  created() {
  },
  methods: {
    paginationData(res) {
      console.log(res)
      this.pull.list.length = 0
      this.pull.list = res.data.list
      this.total = res.data.count || 0
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.currentPage = i
    },
    getArticle(idInt, popEvent) {
      this.$emit('getArticle', idInt, popEvent)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  overflow: auto;
  position: absolute;
  left: 0;
  top: 40px;
  right: 0;
  bottom: 0;
  padding: 0 10px;
}
.list-card {
  // margin-top: 10px;
  background-color: transparent;
  // &:nth-child(1) {
    // margin-top: 0;
  // }
}

</style>
