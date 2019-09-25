<template>
  <div class="decoration">
    <p class="is-original">
      {{ $t('p.publishMatataki') }}
      <template v-if="isOriginal">
        {{ $t('p.publishMatatakOriginal') }}
      </template>
    </p>
    <p class="statement">
      {{ $t('p.publishMatatakiUser', [article.nickname || article.username]) }}
    </p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    isOriginal() {
      return Boolean(this.article.is_original)
    }
  }
}
</script>

<style scoped lang="less">
.decoration {
  .statement {
    font-size:14px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height: 1.5;
    padding: 0;
    margin: 10px 0 0;
  }
  .is-original {
    padding: 0;
    margin: 40px 0 0;
    font-size:14px;
    color: #B2B2B2;
    line-height:16px;
  }
}
</style>
