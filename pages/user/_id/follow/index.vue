<template>
  <userLayout>
    <template slot="main">
      <user-nav />
      <div class="fans-main">
        <fansCard v-for="(item, i) in list" :key="i" class="fans-card" :card="item" @updateList="getFollows"/>
      </div>
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
import fansCard from '@/components/fansCard.vue'
export default {
  name: 'Follows',
  components: {
    userLayout,
    userInfo,
    userNav,
    fansCard
  },
  data() {
    return {
      fans: {},
      list: []
    }
  },
  async mounted() {
    await this.getFollows()
  },
  methods: {
    async getFollows() {
      const res = await this.$API.getFollows(this.$route.params.id)
      console.log(res)
      this.fans = res.data
      this.list = res.data.list
    }
  }
}
</script>

<style lang="less" scoped>
.fans-main {
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  .fans-card {
    margin-bottom: 40px;
    &:nth-child(odd) {
      margin-right: 30px;
    }
  }
}
</style>
