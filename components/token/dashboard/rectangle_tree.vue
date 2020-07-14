<template>
  <div class="treemap">
    <div class="total-issued">
      <div :style="`width:${getPercentage(issued30D, totalIssued)}`" class="issued-30d">
        <div :style="`width:${getPercentage(issued7D, issued30D)}`" class="issued-7d">
          <div :style="`width:${getPercentage(issued24H, issued7D)}`" class="issued-24h">
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
      totalIssued: 0,
      issued30D: 0,
      issued7D: 0,
      issued24H: 0
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
      min-width: 90px;
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
    min-width: 60px;
    background: #AF9BF3;
    &:hover {
      min-width: 140px;
    }
  }
  .issued-7d {
    .data-square();
    width: 50%;
    min-width: 40px;
    background: #896DF0;
    &:hover {
      min-width: 120px;
    }
  }
  .issued-24h {
    .data-square();
    width: 50%;
    min-width: 20px;
    background: #542DE0;
    &:hover {
      min-width: 100px;
    }
  }
}

@media screen and (max-width: 600px) {
}
</style>
