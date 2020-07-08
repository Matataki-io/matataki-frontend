<template>
  <div>
    <div class="piemap">
      <div :style="`width:${getPercentage(iHold)}`" class="i-hold">
        <div class="data-label">
          <div class="data-label-div">
            <i class="placeholder" />
            <span>
              <h4 :style="`font-size:${getFontSize(iHold)};`">
                {{ iHold }}
              </h4>
              <p>
                我持有
              </p>
            </span>
          </div>
        </div>
      </div>
      <div :style="`width:${getPercentage(othersHold)}`" class="others-hold">
        <div class="data-label">
          <div class="data-label-div">
            <i class="placeholder" />
            <span>
              <h4 :style="`font-size:${getFontSize(othersHold)};`">
                {{ othersHold }}
              </h4>
              <p>
                他人持有
              </p>
            </span>
          </div>
        </div>
      </div>
      <div :style="`width:${getPercentage(uniswapGoldPool)}`" class="uniswap-goldpool">
        <div class="data-label">
          <div class="data-label-div">
            <i class="placeholder" />
            <span>
              <h4 :style="`font-size:${getFontSize(uniswapGoldPool)};`">
                {{ uniswapGoldPool }}
              </h4>
              <p>
                Uniswap流动金池
              </p>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // props: {
  //   minetokenToken: {
  //     type: Object,
  //     required: true
  //   },
  // },
  data() {
    return {
      iHold: 20,
      othersHold: 167,
      uniswapGoldPool: 231
    }
  },
  computed: {
    total() {
      return this.iHold + this.othersHold + this.uniswapGoldPool
    }
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
    getPercentage(num, max) {
      return num / (max || this.total) * 100 + '%'
    }
  }
}
</script>
<style lang="less" scoped>
.piemap {
  display: flex;
  background: #F1F1F1;
  height: 60px;
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
    border-radius: 4px 0 0 4px;
  }
  .others-hold {
    .data-square();
    width: 33.3%;
    background: #F2853D;
    border-radius: 0;
    margin: 0 5px;
  }
  .uniswap-goldpool {
    .data-square();
    width: 33.3%;
    background: #F35757;
    border-radius: 0 4px 4px 0;
  }
}

@media screen and (max-width: 600px) {
}
</style>
