<template>
  <div class="treemap">
    <div class="total-issued">
      <div
        v-if="issued30D"
        :style="`width:${getPercentage(issued30D, totalIssued)}`"
        class="issued-30d"
        :class="getMinWidth(2)"
      >
        <div
          v-if="issued7D"
          :style="`width:${getPercentage(issued7D, issued30D)}`"
          class="issued-7d"
          :class="getMinWidth(1)"
        >
          <div
            v-if="issued24H"
            :style="`width:${getPercentage(issued24H, issued7D)}`"
            class="issued-24h"
            :class="getMinWidth(0)"
          >
            <div class="data-label">
              <div class="data-label-div">
                <i class="placeholder" />
                <span>
                  <h4 :style="`font-size:${getFontSize(issued24H)};`">
                    {{ issued24H }}
                  </h4>
                  <p>
                    24h增发量
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div class="data-label">
            <div class="data-label-div">
              <i class="placeholder" />
              <span>
                <h4 :style="`font-size:${getFontSize(issued7D)};`">
                  {{ issued7D }}
                </h4>
                <p>
                  7D增发量
                </p>
              </span>
            </div>
          </div>
        </div>
        <div class="data-label">
          <div class="data-label-div">
            <i class="placeholder" />
            <span>
              <h4 :style="`font-size:${getFontSize(issued30D)};`">
                {{ issued30D }}
              </h4>
              <p>
                30D增发量
              </p>
            </span>
          </div>
        </div>
      </div>
      <div class="data-label">
        <div class="data-label-div">
          <i class="placeholder" />
          <span>
            <h4 :style="`font-size:${getFontSize(totalIssued)};`">
              {{ totalIssued }}
            </h4>
            <p>
              已发行总量
            </p>
          </span>
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
      totalIssued: 'Loading...',
      issued30D: 'Loading...',
      issued7D: 'Loading...',
      issued24H: 'Loading...'
    }
  },
  created() {
    this.getAddSupplyChart()
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
      return num / max * 100 + '%'
    },
    async getAddSupplyChart() {
      try {
        const res = await this.$API.getAddSupplyChart(this.$route.params.id)
        if(res.code === 0) {
          this.totalIssued = res.data.total_supply
          this.issued30D = res.data.suppl_30d
          this.issued7D = res.data.suppl_7d
          this.issued24H = res.data.suppl_24h
        }
        else this.$message.error(res.message)
      }
      catch(e) {
        console.error(e)
      }
    },
    getMinWidth(num) {
      const a = [Number(Boolean(this.issued24H)), Number(Boolean(this.issued7D)), Number(Boolean(this.issued30D))]
      const w = [a[0], a[0] + a[1], a[0] + a[1] + a[2]][num]
      return Boolean(w) && 'issued-w' + w
    }
  }
}
</script>
<style lang="less" scoped>
.treemap {
  display: flex;
  background: #F1F1F1;
  height: 90px;
  margin-bottom: 10px;
  .data-label {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    min-width: 20px;
    &:hover {
      min-width: 100px;
      .data-label-div span {
        transform: translate(0, -4px);
      }
    }
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
    padding: 10px 0 0 0;
    border-radius:4px;
    transition: all 0.3s;
  }
  .total-issued {
    .data-square();
    width: 100%;
    min-width: 80px;
    background: #D4C9FF;
    &:hover {
      min-width: 160px;
    }
  }
  .issued-30d {
    .data-square();
    width: 50%;
    background: #AF9BF3;
  }
  .issued-7d {
    .data-square();
    width: 50%;
    background: #896DF0;
  }
  .issued-24h {
    .data-square();
    width: 50%;
    background: #542DE0;
  }
  .issued-w1 {
    min-width: 20px;
    &:hover {
      min-width: 100px;
    }
  }
  .issued-w2 {
    min-width: 40px;
    &:hover {
      min-width: 120px;
    }
  }
  .issued-w3 {
    min-width: 60px;
    &:hover {
      min-width: 140px;
    }
  }
}

@media screen and (max-width: 600px) {
}
</style>
