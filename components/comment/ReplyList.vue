<template>
  <div class="reply-container">
    <articleCard
      v-for="(itemChild, indexChild) in replyList"
      :key="indexChild"
      :comment="itemChild"
      :type="1"
    />
    <div v-show="!viewMore && count > 3" class="view-more">
      共<b>{{ count }}</b>条回复, 
      <a class="btn-more" @click="viewMore = true">点击查看</a>
    </div>
    <div class="reply-pagination">
      <el-pagination
        v-show="viewMore && count > pageSize"
        hide-on-single-page
        layout="total, prev, pager, next"
        :page-size="pageSize"
        :pager-count="5"
        :total="count"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import articleCard from './article_card'

export default {
  components: { articleCard },
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      viewMore: false,
      pageIndex: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    count() {
      return this.list.length
    },
    replyList() {
      if (!this.viewMore) return this.list.slice(0, 3)
      const { pageIndex, pageSize } = this
      const start = (pageIndex - 1) * pageSize
      const end = pageIndex * pageSize
      console.log('start: ', start, ' end: ', end)
      return this.list.slice(start ,end)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val
    },
  }
}
</script>

<style lang="less" scoped>
.reply-container {
  margin-bottom: 20px;
  // padding-bottom: 20px;
  margin-left: 42px;
  // border-bottom: 1px solid #e5e9ef;
}
.view-more {
  font-size: 12px;
  color: #6d757a;
  .btn-more {
    padding: 2px 3px;
    border-radius: 4px;
    outline: none;
    color: #542DE0;
    text-decoration: none;
    cursor: pointer;
  }
}

// 小于860
@media screen and (max-width: 860px){
.reply-container {
  margin-left: 0;
  padding: 0 10px;
}
}
</style>
<style lang="less">
.reply-pagination {
  .el-pagination button {
    background: #F7F7F7;
    background-color: #F7F7F7;
  }
  .number {
    background: #F7F7F7;
    background-color: #F7F7F7;
  }
}
</style>
