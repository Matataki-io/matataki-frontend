<template>
  <section class="tag-list">
    <router-link
      v-for="(item, index) in tags"
      :key="index"
      class="tag-item"
      :to="{name: 'tags-id', params: { id: item.id }, query: { name: item.name }}"
    >
      {{ item.name }}
    </router-link>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tags: []
    }
  },
  mounted() {
    if (process.browser) {
      this.tagsHotest()
    }
  },
  methods: {
    // 热门标签
    async tagsHotest() {
      await this.$API.tagsHotest({
        pagesize: 20
      }).then(res => {
        if (res.code === 0) {
          this.tags = res.data.list
        } else {
          console.log(res.message)
        }
      }).catch(e => {
        console.log(e)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.tag-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  min-height: 200px;
  .tag-item {
    text-align: center;
    transition: all .3s;
    margin: 0 10px 8px 0;
    background: #e4e4e4;
    border-radius: 100px;
    padding: 0 12px;
    border: 1px solid #e4e4e4;
      font-size: 12px;
      color: #505050;
      line-height: 22px;
      vertical-align: middle;
      z-index: 10;
      display: inline-block;
      height: 22px;

    &:hover {
      border-color: @purpleDark;
      color: @purpleDark;
    }
  }
}
</style>