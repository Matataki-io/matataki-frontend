<template>
  <el-alert :type="type">
    <h2 class="title">
      ❓分享我的「提现许可」给他人会造成 Fan 票损失吗？
    </h2>
    <p class="description">不会，提现许可包含了： <b>Token</b> 、<b>收款账户</b>、<b>许可发行号码</b>的这三个要素。</p>
    <p class="description">我们的智能合约会校验这一点。上传提现许可到智能合约只会把 Token 转到许可指定的账户里。</p>
    <p class="description">但是最好不要在第三方网站上传提现许可。因为钓鱼网站可能会诱导把Fan票转账到他们的账户。</p>
  </el-alert>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info'
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  padding: 0;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.5;
}
.description {
  font-size: 14px;
  padding: 0;
  margin: 4px 0 0 0;
  line-height: 1.5;
}
.link {
  color: rgb(25, 137, 250);
  display: inline-block;
  font-size: 14px;
  text-decoration: underline;
  padding: 0;
  margin: 4px 0 0 0;
  line-height: 1.5;
}
</style>