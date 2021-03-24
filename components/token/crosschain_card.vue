<template>
  <div class="token-detail" style="display: flex;">
    <avatar :src="chainDetail.logo" size="60px" class="token-logo" />
    <div class="token-detail-info">
      <div class="fl info-line">
        <span class="token-info-title">
          {{ chainDetail.name }}
        </span>
      </div>
      <div class="fl info-line">
        <div class="token-info-address">
          Address: <a :href="`${addressSCAN}`" target="_blank">{{ tokenAddress }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  },
  props: {
    chainDetail: {
      type: Object,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true
    }
  },
  data: () => ({
  }),
  computed: {
    addressSCAN() {
      if (process.client) {
        return `${process.env.VUE_APP_BSCSCAN}/address/${ this.tokenAddress }`
      } else {
        return this.tokenAddress
      }
    }
  },
}
</script>


<style lang="less" scoped>
.token-detail {
  position: relative;
  margin: 0 auto 0;
  padding: 20px 0;
  box-sizing: border-box;
  cursor: pointer;
}
.token-logo {
  flex: 0 0 60px;
  box-sizing: border-box;
}
.info-line {
  margin: 2px 0;
}
.token-detail-info {
  width: 100%;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 400;
  color: @black;
  line-height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.token-info-title {
  font-weight: bold;
  font-size: 18px;
}
.token-info-address {
    color: #333;
    font-size: 16px;
    a {
      color: #333;
      font-size: 16px;
      word-break: break-all;
      &:hover {
        text-decoration: underline;
      }
    }
}
</style>