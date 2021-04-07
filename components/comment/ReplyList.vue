<template>
  <div class="reply-container">
    <articleCard
      v-for="(itemChild, indexChild) in replyList"
      :key="indexChild"
      :comment="itemChild"
      :type="1"
      @success="$emit('success')"
    />
    <div v-show="!viewMore && count > 3" class="view-more">
      <span v-html="$t('x-total-replies', [ count ])" />
      <a class="btn-more" @click="viewMore = true">{{ $t('click-to-view') }}</a>
    </div>
    <div class="reply-pagination">
      <el-pagination
        v-show="viewMore && count > pageSize"
        hide-on-single-page
        layout="total, prev, pager, next"
        :page-size="pageSize"
        :current-page="pageIndex"
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
    },
    // 指定这个将会默认翻到这一页
    defaultPage: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      viewMore: false,
      pageIndex: 1
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    count() {
      return this.list.length
    },
    replyList() {
      // 第一次打开时，如果有defaultPage则跳转到defaultPage所指的页码。第一次打开是通过viewMore变量来判断的，避免之后翻页时还会触发这个跳转
      if(this.defaultPage && !this.viewMore) this.handleCurrentChange(this.defaultPage)

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
      this.viewMore = true
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
