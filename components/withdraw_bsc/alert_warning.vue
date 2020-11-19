<template>
  <el-alert :type="type">
    <h2 class="title">
      ⚠️ 你找到了暂未对公众开放的试验性功能 ⚠️
    </h2>
    <p class="description">
      这是目前你申请的 BSC 转账许可，一经上传即可生成在 BSC 上的Fan票资产。<b>你需要 MetaMask 连接上币安智能链主网，并有足够的 BNB
        去上传提现许可。</b>
    </p>
    <a
      class="link"
      href="https://www.readblocks.com/archives/32275"
      target="_blank"
      rel="noopener noreferrer"
    >👉在 MetaMask 添加币安智能链的指南 ↗️ 👈</a>
    <p class="description">
      如果你没有足够的 BNB，你可以把许可分享给有 BNB 的朋友，让 TA 帮你生成币安智能链上的 Fan票 资产
    </p>
  </el-alert>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'warning',
    },
  },
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