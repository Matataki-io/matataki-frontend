<template>
  <img
    v-show="showBanner"
    src="@/assets/img/article_banner.png"
    alt="banner"
    class="article_banner"
    @click="publish"
  >
</template>

<script src="../../common/script/token_cd"></script>

<style lang="less" scoped>
.article_banner {
  width: 100%;
  margin-top: 5px;
  cursor: pointer;
}
</style>