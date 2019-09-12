<template>
  <div class="error">
    <!-- ⚠️ 404页面不存在 -->
    <notPage v-if="error.statusCode==404" />
    <h2 v-else>
      ❗ 500服务器错误
    </h2>
    <!-- <nuxt-link class="link" to="/">
      回到主页
    </nuxt-link> -->
  </div>
</template>

<script>
import notPage from '@/components/404'
export default {
  layout: 'empty',
  name: 'Error',
  components: {
    notPage
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
</style>
