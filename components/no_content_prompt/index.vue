<template>
  <div style="width: 100%;">
    <slot />
    <div v-if="!hasList" class="not-content">
      <img v-if="isShowImg" src="@/assets/img/not_content_prompt.png" alt="notContent">
      <p>
        {{ prompt }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  naem: 'NotContentPrompt',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    isShowImg: {
      type: Boolean,
      default: true
    },
    prompt: {
      type: String,
      default: function () {
        return this.$t('notContent')
      }
    }
  },
  computed: {
    hasList() {
      return this.list.length !== 0
    }
  }
}
</script>

<style lang="less" scoped>
.not-content {
  text-align: center;
  margin: 4em 0 0;
  width: 100%;
  p {
    color: #848484;
    font-size: 16px;
  }
  img {
    width: 140px;
  }
}
</style>
