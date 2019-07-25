<template>
  <div>
    <h2>投资队列 {{comments.length}}</h2>
    <CommentCard v-for="(item, index) in comments" :key="index" :comment="item" :type="type" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentCard from './Card'

export default {
  components: { CommentCard },
  props: ['signId', 'type'],
  data() {
    return {
      comments: []
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  async created() {
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
