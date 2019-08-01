<template>
  <div class="Post-Author">
    <div class="AuthorInfo">
      <img class="Avatar" width="38" height="38" :src="article.avatar" alt="">
      <div class="AuthorInfo-content">
        <span class="UserLink AuthorInfo-name">{{ article.nickname || article.author }}</span>
        <span class="Post-Time">发布于{{ article.articleCreateTimeComputed }}</span>
        <span class="View-Num">{{ article.read || 0 }}阅读</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    article: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="less">
.Avatar {
  background: #fff;
  border-radius: 50%;
  vertical-align: top;
}
.Post-Author {
  display: flex;
  align-items: center;
  .AuthorInfo {
    flex: 1 1;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
}
.Post-Time, .View-Num {
  .info-font();
}
</style>
