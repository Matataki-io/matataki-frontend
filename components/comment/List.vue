<template>
  <div>
    <h2>{{ type === 2 ? '支持队列' : '投资队列' }} {{ comments.length }}</h2>
    <template v-if="comments.length !== 0" >
      <CommentCard v-for="(item, index) in comments" :key="index" :comment="item" :type="type" />
    </template>
    <p v-else class="not-more">
      暂无评论
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentCard from './Card'

export default {
  components: { CommentCard },
  props: {
    signId: {
      type: Number,
      required: true
    },
    type: {
      type: Number, // 2是商品 1是文章
      required: true
    }
  },
  data() {
    return {
      comments: []
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  async mounted() {
    await this.getListData()
  },
  methods: {
    async getListData() {
      const res = await this.$API.getComments(this.signId)
      console.log('res', res)
      this.comments = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.not-more {
  text-align: center;
  font-size: 16px;
  padding: 0;
  margin: 0 0 40px;
  color: #333;
}
</style>
