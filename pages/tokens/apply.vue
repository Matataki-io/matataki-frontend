<template>
  <userLayout>
    <template slot="main">
      <h2 class="tag-title">
        {{ $t('user.applycoins') }}
      </h2>
      <div class="apply-card">
        <img
          class="error-gif"
          src="@/assets/img/wallet.png"
          alt="cover"
        >
        <p>
          {{ $t('smart-and-creative-you-are-finally-here-Come-and-publish-your-Fan-ticket-which-is-a-status-symbol-as-a-member-of-your-community') }}<br>
          {{ $t('fill-in-the-form-to-tell-us-your-plan-for-the-community-and-the-staff-will-contact-you-within-1-5-working-days-to-provide-you-with-exclusive-services') }}
        </p>
        <a
          href="https://wj.qq.com/s2/5208015/8e5d"
          target="_blank"
        >
          <el-button type="primary">
            {{ $t('apply-immediately') }}
          </el-button>
        </a>
      </div>
    </template>
    <template slot="nav">
      <myAccountNav />
    </template>
  </userLayout>
</template>

<script>
import userLayout from '@/components/user/user_layout.vue'
import myAccountNav from '@/components/my_account/my_account_nav.vue'

export default {
  components: {
    userLayout,
    myAccountNav
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.apply-card {
  text-align: center;
  img {
    width: 256px;
    margin-top: 40px;
  }
  p {
    font-size: 16px;
    margin: 60px 0 0;
    line-height: 1.5;
    color: #333;
  }
  button {
    margin: 205px 0 20px;
    width:300px;
  }
}
.tag-title {
  font-weight: bold;
  font-size: 20px;
  padding-left: 10px;
  margin: 0;
}
</style>
