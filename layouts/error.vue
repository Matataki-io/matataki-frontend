<template>
  <div class="error">
    <h2 v-if="error.statusCode==404">
      ⚠️ 404页面不存在
    </h2>
    <h2 v-else>
      ❗ 500服务器错误
    </h2>
    <nuxt-link class="link" to="/">
      回到主页
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style lang="less" scoped>
.error {
  min-height: calc(100% - 189px);
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
