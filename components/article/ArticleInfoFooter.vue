<template>
  <div class="article-info">
    <div class="info1">
      <span>投资总额</span>
      <img src="@/assets/img/icon_EOS.svg" alt="eos">
      <span class="num">{{ totalSupportedAmount.eos }}</span>
      <img src="@/assets/img/icon_ONT.svg" alt="eos">
      <span class="num">{{ totalSupportedAmount.ont }}</span>
    </div>
    <div class="info2">
      <span>裂变系数</span>
      <img src="@/assets/img/liebian.svg" alt="">
      <span class="num">{{ getDisplayedFissionFactor }}</span>
    </div>
  </div>
</template>

<script>
import { precision } from '@/utils/precisionConversion'
export default {
  components: {},
  props: {
    article: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {}
  },
  computed: {
    totalSupportedAmount() {
      return {
        eos: this.article.value ? precision(this.article.value, 'eos') : 0,
        ont: this.article.ontvalue ? precision(this.article.ontvalue, 'ont') : 0 // ont
      }
    },
    getDisplayedFissionFactor() {
      return this.article.fission_factor / 1000
    }
  }
}
</script>

<style scoped lang="less">
.article-info {
  margin-top: 40px;
  padding: 15px 40px;
  border: 1px solid #dbdbdb;
  border-radius: 40px;
  box-sizing: border-box;
  font-size: 16px;
  width: 400px;
  .flexCenter();
  .info1 {
    margin-right: 40px;
  }
  .info2, .info1 {
    .flexCenter();
    img {
      margin: 0 5px 0 10px;
    }
    .num {
      color:  @blue;
      font-weight: 700;
    }
  }
}
</style>
