<template>
  <div @click="$emit('publish')">
    <img
      src="@/assets/img/article_banner.png"
      alt="banner"
      class="article_banner"
    >
  </div>
</template>

<style lang="less" scoped>
.article_banner {
  width: 100%;
  margin-top: 5px;
  cursor: pointer;
}
</style>