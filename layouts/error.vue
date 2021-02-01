<template>
  <div class="error">
    <errorPage v-if="error.statusCode == 500" />
    <unknownPage v-else />
    <span class="status">status: {{ (error.statusCode).toString() }}</span>
  </div>
</template>

<script>
import unknownPage from '@/components/error/unknown.vue'
import errorPage from '@/components/error/500.vue'
export default {
  layout: 'empty',
  name: 'Error',
  components: {
    unknownPage,
    errorPage
  },
  // nuxt 默认提供模版
  // eslint-disable-next-line vue/require-prop-types
  props: ['error']
}
</script>

<style lang="less" scoped>
.error {
  background-color: #23294b;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h2 {
  font-size: 40px;
  text-align: center;
  margin: 0;
  padding: 0;
}
.link {
  display: block;
  text-align: center;
  color: #333;
  font-size: 18px;
  padding: 0;
  margin: 30px 0 0;
}
.status {
  position: fixed;
  right: 40px;
  top: 100px;
  color: #ee0a24;
  font-size: 16px;
}
</style>
