<template>
  <div v-loading="loading" class="comment-container">
    <!-- <h2 v-if="pull.articles.length !== 0" class="comment-title">
      {{ type === 2 ? $t('p.likeList') : $t('p.commentPointBtn') }} {{ pull.allcount }} 
    </h2> -->
    <!-- <template v-if="type === 2">
      <CommentCard
        v-for="(itemChild, indexChild) in pull.articles"
        :key="indexChild"
        :comment="itemChild"
        :type="type"
      />
    </template>
    <template v-else> -->
    <div v-for="(itemChild, indexChild) in pull.articles" :key="indexChild" class="comment-outer">
      <articleCard
        :comment="itemChild"
        :type="type"
        @success="$emit('success')"
      />
      <ReplyList
        v-if="itemChild.replyList.length > 0"
        :list="itemChild.replyList"
        :page-size="replyPageSize"
        :default-page="getDefaultPage(indexChild)"
        @success="$emit('success')"
      />
    </div>
    <!-- </template> -->
    <div v-show="!(loading || !(pull.articles.length > 0))" class="comment-pagination">
      <user-pagination
        :current-page="currentPage"
        :params="pull.params"
        :api-url="pull.apiUrl"
        :page-size="pageSize"
        :total="total"
        :need-access-token="true"
        :reload="reload"
        class="pagination"
        @paginationData="paginationData"
        @togglePage="togglePage"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import CommentCard from './Card'
import articleCard from './article_card'
import ReplyList from './ReplyList'
// import buttonLoadMore from '@/components/button_load_more/index.vue'
import userPagination from '@/components/user/user_pagination.vue'

export default {
  components: { userPagination, articleCard, ReplyList },
  props: {
    signId: {
      type: Number,
      required: true
    },
    type: {
      type: Number, // 2是商品 1是文章
      required: true
    },
    // 锚点：不等于0时，评论加载完成后跳转到所指评论
    commentAnchor: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      pull: {
        params: {
          signid: this.signId
        },
        apiUrl: 'commentsList',
        articles: [],
        commentLength: 0,
        allcount: 0
      },
      reload: this.commentRequest,
      commentId: 0,
      loading: false,
      pageSize: 20,
      currentPage: 1,
      total: 0,

      // defaultPage: { commentIndex: Number, replyPage: Number }
      defaultPage: null,
      replyPageSize: 10,
      recursiveCount: 0
    }
  },
  computed: {
    ...mapState(['commentRequest']),
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    // 监听id是否变化
    signId() {
      this.pull.params.signid = this.signId
      this.reload = Date.now()
    },
    commentRequest() {
      this.reload = this.commentRequest
    }
  },
  methods: {

    // 点击翻页按钮返回的数据
    paginationData(res) {
      // console.log(res)
      if (res) {
        this.defaultPage = null
        if (res.isEmpty) {
          this.pull.articles.length = 0
          this.pull.articles = res.data.list
        } else {
          this.pull.articles = res.data.list
        }
        this.pull.allcount = res.data.allcount
        this.total = res.data.count || 0

        this.goCommentAnchor()
      }
      this.loading = false
    },
    togglePage(i) {
      this.loading = true
      this.pull.articles = []
      this.currentPage = i
    },
    getDefaultPage(index) {
      if(this.defaultPage && this.defaultPage.commentIndex === index) return this.defaultPage.replyPage
      else 0
    },

    /** 将页面跳转到指定的的评论 */
    async goCommentAnchor() {
      if (!this.commentAnchor) return
      // 当commentId被赋值后，就不会重新触发这个方法了
      if (this.commentId) return

      // 在评论列表中查找评论
      const defaultPage = this.getComeentPosition(this.commentAnchor)
      if (defaultPage) {
        // 找到了：跳转到所在位置，会根据defaultPage的信息展开回复菜单
        this.defaultPage = defaultPage
        
        this.commentId = this.commentAnchor
        this.$nextTick(() => {
          this.goAnchor('comment' + this.commentId)
        })
      }
      else {
        // 没找到：去服务器上面找，如果找到了，则get所在的分页，之后会在get回调中重新进入此方法

        // 限制递归深度
        if(this.recursiveCount > 2) return console.error('[goCommentAnchor] Recursive overflow')
        this.recursiveCount++

        try {
          let result = await this.$API.getCommentIndexById(this.commentAnchor)
          if (result && result.code === 0) {
            // 计算页码
            this.currentPage = Math.ceil((result.data.rownum + 1) / this.pageSize)
            this.reload = Date.now()
            return
          }
          else this.$message.error(result.message)
        }
        catch(e) {
          console.error(e)
        }

        this.commentId = this.commentAnchor
      }
    },
    goAnchor(id) {
      var anchor = document.getElementById(id)
      if(!anchor) return

      const offsetTop = anchor.offsetTop - 100
      window.scrollTo(0, offsetTop)
      anchor.classList.add('play-prompt')
    },
    /** 通过评论id获取评论在当前页面中的位置，不存在这条评论则返回false */
    getComeentPosition(id) {
      let defaultPage = {}
      const foundIt = this.pull.articles.some((comment, commentIndex) => {
        defaultPage.commentIndex = commentIndex
        if (comment.id === id) return true
        return this.pull.articles[commentIndex].replyList.some((reply, replyIndex) => {
          if (reply.id === id) {
            // 计算回复区的页码
            defaultPage.replyPage = Math.ceil((replyIndex + 1) / this.replyPageSize)
            
            return true
          }
        })
      })
      if(foundIt) return defaultPage
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.comment-outer:not(:last-child) {
  border-bottom: 1px solid #e5e9ef;
}
.comment-title {
  font-size: 18px;
  padding: 0;
  margin: 0;
  font-weight: 400;
}

.comment-container {
  margin-bottom: 40px;
  margin-left: 60px;
  min-height: 200px;
}
.comment-pagination {
  margin-top: 20px;
}

// 小于860
@media screen and (max-width: 860px){
.comment-container {
  margin-left: 0;
  padding: 0 10px;
}
}
</style>
