<template>
  <el-alert :type="type">
    <h2 class="title">
      ❓{{ $t('will-sharing-my-withdrawal-permission-to-others-cause-loss-of-coin') }}
    </h2>
    <p class="description">{{ $t('no-the-withdrawal-permission-includes') }}： <b>Token</b> 、<b>{{ $t('accounts-receivable') }}</b>、<b>{{ $t('license-issue-number') }}</b>{{ $t('of-these-three-elements') }}</p>
    <p class="description">{{ $t('our-smart-contract-will-verify-this-uploading-the-withdrawal-permission-to-the-smart-contract-will-only-transfer-the-Token-to-the-account-specified-by-the-permission') }}</p>
    <p class="description">{{ $t('but-it-is-best-not-to-upload-a-withdrawal-permission-on-a-third-party-website-because-the-phishing-website-may-induce-the-Fan-ticket-to-be-transferred-to-their-account') }}</p>
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