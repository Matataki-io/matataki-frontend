<template>
  <div>
    <div class="piemap">
      <div v-if="iHold" :style="`width:${getPercentage(iHold)}`" class="i-hold">
        <div class="data-label">
          <div class="data-label-div">
            <i class="placeholder" />
            <span>
              <h4 :style="`font-size:${getFontSize(iHold)};`">
                {{ iHold }}
              </h4>
              <p>
                {{ $t('i-hold') }}
              </p>
            </span>
          </div>
        </div>
      </div>
      <div v-if="othersHold" :style="`width:${getPercentage(othersHold)}`" class="others-hold">
        <div class="data-label">
          <div class="data-label-div">
            <i class="placeholder" />
            <span>
              <h4 :style="`font-size:${getFontSize(othersHold)};`">
                {{ othersHold }}
              </h4>
              <p>
                {{ $t('held-by-others') }}
              </p>
            </span>
          </div>
        </div>
      </div>
      <div v-if="uniswapGoldPool" :style="`width:${getPercentage(uniswapGoldPool)}`" class="uniswap-goldpool">
        <div class="data-label">
          <div class="data-label-div">
            <i class="placeholder" />
            <span>
              <h4 :style="`font-size:${getFontSize(uniswapGoldPool)};`">
                {{ uniswapGoldPool }}
              </h4>
              <p>
                {{ $t('in-circulation') }}
              </p>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { precision } from '@/utils/precisionConversion'

export default {
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
    currentPoolSize: {
      type: Object,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  // data() {
  //   return {
  //     iHold: 0,
  //     othersHold: 0,
  //     uniswapGoldPool: 0
  //   }
  // },
  computed: {
    iHold() {
      if(this.currentPoolSize.token_amount === undefined) return 'Loading...'
      return this.balance || 0
    },
    othersHold() {
      if(this.currentPoolSize.token_amount === undefined) return 'Loading...'
      return Number((this.unitConversion(this.minetokenToken.total_supply) - (this.balance + (this.currentPoolSize.token_amount || 0))).toFixed(4))
    },
    uniswapGoldPool() {
      if(this.currentPoolSize.token_amount === undefined) return 'Loading...'
      return this.currentPoolSize.token_amount || 0
    }
  },
  created() {
  },
  methods: {
    getFontSize(test) {
      const length = String(test).length
      return this.myscale(length, 1, 13, 22, 12) + 'px'
    },
    myscale (num, inMin, inMax, outMin, outMax) {
      let scale = Math.max(0.0, num - inMin) / (inMax - inMin)
      let r = outMin + (scale * (outMax - outMin))
      return Math.round(r)
    },
    getPercentage(num) {
      return num / (this.iHold + this.othersHold + this.uniswapGoldPool) * 100 + '%'
    },
    unitConversion(num) {
      if(!this.minetokenToken) return 0
      const tokenamount = precision(
        num || 0,
        'CNY',
        this.minetokenToken.decimals
      )
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
  }
}
</script>
<style lang="less" scoped>
.piemap {
  display: flex;
  background: #F1F1F1;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
  .data-label {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    &-div {
      height: 45px;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .placeholder {
        height: 45px;
        width: 1px;
      }
      span {
        transition: all 0.3s;
        margin: 0 5px;
        h4 {
          margin: 0;
          font-size:20px;
          font-weight:500;
          line-height:28px;
          color: white;
          word-break: break-all;
          text-align: center;
        }
        p {
          margin: 0;
          font-size:12px;
          line-height:17px;
          color: white;
          word-break: break-all;
          text-align: center;
        }
      }
    }
  }
  .data-square {
    display: flex;
    min-width: 20px;
    transition: all 0.3s;
    margin: 0 2.5px;
    &:first-child {
      margin-left: 0px;
    }
    &:last-child {
      margin-right: 0px;
    }
    &:hover {
      min-width: 120px;
      .data-label-div span {
        transform: translate(0, -4px);
      }
    }
  }
  .i-hold {
    .data-square();
    width: 33.3%;
    background: #F7B500;
  }
  .others-hold {
    .data-square();
    width: 33.3%;
    background: #F2853D;
    border-radius: 0;
  }
  .uniswap-goldpool {
    .data-square();
    width: 33.3%;
    background: #F35757;
  }
}

@media screen and (max-width: 600px) {
}
</style>
