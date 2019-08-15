<template>
  <div>
    <div v-for="(item, index) in articleCardData" :key="index" class="comment">
      <h2>{{ type === 2 ? '支持队列' : '投资队列' }} {{ item.articles.length }}</h2>
      <no-content-prompt :list="item.articles">
        <CommentCard v-for="(itemChild, indexChild) in item.articles" :key="indexChild" :comment="itemChild" :type="type" />
      </no-content-prompt>
      <buttonLoadMore
        class="comment-button"
        :type-index="0"
        :params="item.params"
        :api-url="item.apiUrl"
        return-type="Array"
        :comment-request="commentRequest"
        @buttonLoadMore="buttonLoadMore"
      >
        查看更多>
      </buttonLoadMore>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentCard from './Card'
import buttonLoadMore from '@/components/button_load_more/index.vue'

export default {
  components: { CommentCard, buttonLoadMore },
  props: {
    signId: {
      type: Number,
      required: true
    },
    type: {
      type: Number, // 2是商品 1是文章
      required: true
    },
    commentRequest: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // comments: [],
      articleCardData: [
        {
          params: {
            signid: this.signId
          },
          apiUrl: 'commentsList',
          articles: []
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  async mounted() {
    // await this.getListData()
  },
  methods: {
    // async getListData() {
    //   const res = await this.$API.getComments(this.signId)
    //   console.log('res', res)
    //   this.comments = res.data
    // },
    // 点击更多按钮返回的数据
    buttonLoadMore(res) {
      // console.log(res)
      if (res.data && res.data.length !== 0) {
        if (res.isEmpty) {
          this.articleCardData[res.index].articles = res.data
        } else {
          this.articleCardData[res.index].articles = this.articleCardData[res.index].articles.concat(res.data)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment-button {
    background: transparent;
    color: #333;
    font-size: 16px;
    height: auto;
    width: auto;
    margin: 20px auto;
}
.comment {
  margin-bottom: 40px;
}
</style>
