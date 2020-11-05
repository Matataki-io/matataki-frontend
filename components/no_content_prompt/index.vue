<template>
  <div style="width: 100%;">
    <div
      v-if="!hasList"
      class="not-content"
    >
      <img
        v-if="isShowImg"
        src="@/assets/img/not_content_prompt.png"
        alt="notContent"
      >
      <p>
        {{ prompt }}
      </p>
    </div>
    <slot />
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
    },
    hide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasList() {
      return this.list.length !== 0 || this.hide
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
    font-size: 14px;
  }
  img {
    width: 100px;
  }
}
</style>
