<template>
  <Modal v-model="infoModaCopy" footer-hide class-name="modalCenter" @on-visible-change="change">
    <template v-if="channel === 1">
      <div class="info-content">
        <p class="info-title">爱上智能签名需要几步？</p>
        <p>1.点击“投资”按钮,支持好文,获取收益！</p>
        <p>2.点击“分享”按钮,生成您的邀请链接。</p>
        <p>3.转发链接,好友投资越多,收益越多。</p>
        <p>4.个人页面“提现“,实现自由之路！</p>
        <p class="des">(添加微信DappsDev加入智能签名早鸟群)</p>
        <img src="@/assets/img/code.png" alt="wechatCode:DappsDev" />
      </div>
    </template>
    <template v-else>
      <div class="info-content">
        <p class="info-title">如何购买商品？</p>
        <p>1.点击购买按钮,输入数量购买商品。</p>
        <p>2.点击“分享”按钮,生成您的邀请链接。</p>
        <p>3.转发链接,好友购买越多,推荐返利越多。</p>

        <p class="info-title two">如何投资商品？</p>
        <p>1.点击投资按钮,输入金额投资商品。</p>
        <p>2.点击“分享”按钮,生成您的邀请链接。</p>
        <p>3.转发链接,好友购买越多,裂变返利越多。</p>
        <p class="des">(添加微信DappsDev加入智能签名早鸟群)</p>
        <img src="@/assets/img/code.png" alt="wechatCode:DappsDev" />
      </div>
    </template>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
export default {
  props: {
    infoModa: {
      type: Boolean,
      default: false
    },
    channel: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      infoModaCopy: this.infoModa
    }
  },
  watch: {
    infoModa(newVal) {
      this.infoModaCopy = newVal
    }
  },
  methods: {
    change(status) {
      this.infoModaCopy = status
      this.$emit('changeInfo', status)
    }
  }
}
</script>

<style lang="less" scoped>
.info-content {
  margin: 0 10px;
  .info-title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #494949;
    padding: 0;
    margin: 30px auto 10px auto;
    text-align: center;
    width: 290px;
    &.two {
      margin-top: 10px;
    }
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 1.5;
    letter-spacing: 1px;
    width: 290px;
    margin: 0 auto;
  }
  p.des {
    text-align: center;
    margin: 20px auto;
  }
  img {
    display: block;
    border: 1px solid #e2e2e2;
    box-sizing: border-box;
    width: 40%;
    margin: 20px auto 30px;
    padding: 2px;
  }
}
@media screen and (max-width: 575.98px) {
  .info-content {
    img {
      width: 60%;
    }
  }
}
@media screen and (max-width: 350px) {
  .info-content {
    p {
      width: auto;
    }
    img {
      width: 80%;
    }
  }
}
</style>
