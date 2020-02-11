<template>
  <div v-loading="loading" class="tg-container">
    <div v-loading="loading" style="height: 100%;" element-loading-text="登录中..." />
    <p class="tips">
      使用该功能需要“科学上网”
    </p>
  </div>
</template>

<script>
import hello from 'hellojs/dist/hello.all'
export default {
  layout: 'empty',
  name: 'TwitterLoginPage',
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    hello.init({
      twitter: 'psCq7zJc8a9UyNOX5etVSuKVh'
    }, {
      redirect_uri: '/redirect'
    })
    hello('twitter').login().then((res) => {
      console.log(res)
    })
  }
}
</script>
<style scoped lang="less">
.tg-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding-top: 10%;
  .tips {
    font-size: 14px;
    color: #333;
    padding: 0;
    margin: 2em 0 0;
  }
}
</style>
