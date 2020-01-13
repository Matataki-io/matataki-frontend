<template>
  <div>
    <template v-for="(item, index) in pull.list">
      <shareOuterCard :card="item" v-if="item.ref_sign_id === 0" :key="index" card-type="read" class="list-card" />
      <sharePCard :card="item" v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1" :key="index" card-type="read" class="list-card" />
      <shareInsideCard
        :card="item"
        v-else-if="item.ref_sign_id && item.channel_id === 3"
        :toggleArticle="true"
        :key="index"
        @getArticle="getArticle"
        card-type="read"
        from="beref"
        class="list-card"
      />
    </template>

    <div v-loading="loading" v-show="pull.list.length !== 0" class="pagination">
      <user-pagination
        :url-replace="$route.params.id + ''"
        :current-page="currentPage"
        :params="pull.params"
        :api-url="pull.apiUrl"
        :page-size="pull.params.pagesize || 20"
        :total="total"
        :need-access-token="true"
        @paginationData="paginationData"
        @togglePage="togglePage"
        :reload="nowTime"
        :small="true"
        :selectClass="'user-pagination-light'"
      />
    </div>
    <p v-show="pull.list.length === 0" class="not-prompt">
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
        apiUrl: 'postsPosts',
        list: []
      }
    }
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

.not-prompt {
  text-align: center;
  margin: 100px 0 0 0;
  color: #333;
  font-size: 14px;
}

</style>
