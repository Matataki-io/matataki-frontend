<template>
  <userLayout>
    <template slot="main">
      <h2 class="tag-title">
        {{ $t('user.applycoins') }}
      </h2>
      <div class="apply-card">
        <img class="error-gif" src="@/assets/img/wallet.png" alt="cover">
        <p>
          聪明又创造力十足的你终于来到这里了！快来发布你的Fan票吧，这是作为你的社区一员的身份象征哦！<br>
          填写表单，告诉我们你对社区的规划，工作人员会在1-5个工作日联系你为你提供专属服务。
        </p>
        <a href="https://wj.qq.com/s2/5208015/8e5d" target="_blank">
          <el-button type="primary">
            立即申请
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
