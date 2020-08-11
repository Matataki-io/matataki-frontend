<template>
  <settingLayout>
    <NoTokenTip v-if="NoToken" />
    <div v-else class="mint-setting">
      <a href="https://www.yuque.com/matataki/matataki">Fan票使用手册 ></a>
      <div v-loading="loading" class="form-container">
        <div class="mint-info">
          <span class="mint-setting-label black">已增发：</span>
          <span class="mint-setting-num">{{ mintDetail.count }}</span> 
          <span class="mint-setting-symbol">次</span> 
          <span class="mint-setting-num">{{ mintDetail.totalSupply.toLocaleString() }}</span> 
          <span class="mint-setting-symbol">LJM</span> 
        </div>
        <div
          v-loading="amountUpperLimit"
          class="mint-form"
          element-loading-text="增发数量已到达上限"
          element-loading-spinner="el-icon-warning"
          element-loading-background="rgba(0, 0, 0, 0.4)"
        >
          <el-input v-model="form.amount" placeholder="增发数量(总量最多发行一亿)" class="mint-setting-input" />
          <el-button 
            type="primary" 
            class="mint-setting-btn" 
            plain
            :disabled="amountUpperLimit"
            @click="minetokenMint"
          >
            立即增发
          </el-button>
        </div>
      </div>
      <el-divider class="colla-splitline" />
      <p class="colla-help">
        手动增发规则：<br>
        1. 最大发行上限为1亿<br>
        2. 首次发行成功后即可立即操作手动增发<br>
        <!-- 2. 每次增发后需要等待10天可再次增发<br> -->
        <!-- 3. 发行者可以设置将每次增发Fan票的一定比例自动转入直通车中<br> -->
      </p>
    </div>
  </settingLayout>
</template>

<script>
import settingLayout from '@/components/token/liquidity_setting.vue'
import NoTokenTip from '@/components/NoTokenTip.vue'

export default {
  components: {
    settingLayout,
    NoTokenTip
  },
  data() {
    return {
      loading: false,
      form: {
        amount: null
      },
      NoToken: false,
      mintDetail: {
        count: 0,
        totalSupply: 0,
      }
    }
  },
  computed: {
    // mint amount already upper limit
    amountUpperLimit() {
      if (this.mintDetail.totalSupply >= 100000000) {
        return true
      }
      return false
    }
  },
  watch: {
  },
  created() {
    this.getMintDetail()
  },
  methods: {
    async getMintDetail() {
      this.loading = true
      const result = await this.$API.getMintDetail()
      if (result.code === 0) {
        this.NoToken = false
        this.mintDetail = {
          count: result.data.count,
          totalSupply: this.$utils.fromDecimal(result.data.total_supply)
        }
      } else {
        this.NoToken = true
      }
      this.loading = false
    },
    async minetokenMint() {
      this.$message('正在增发中，请稍等片刻。')
      this.loading = true
      const res = await this.$API.minetokenMint({
        amount: this.$utils.toDecimal(this.form.amount)
      })
      this.loading = false
      if (res.code === 0) {
        this.$message({ showClose: true, message: res.message, type: 'success'})
        this.getMintDetail()
      } else {
        this.$message({ showClose: true, message: res.message, type: 'error' })
      }
    },
    resetForm() {
      this.form.amount = null
    }
  }
}
</script>

<style lang="less" scoped>
.mint-setting {
  a {
    columns: #542DE0;
  }
  .form-container {
    max-width: 500px;
    margin-top: 20px;
  }
  &-label {
    font-size: 14px;
    color: #333333;
    line-height: 40px;
  }
  &-num {
    font-size: 30px;
    font-weight: bolder;
    color: #000000;
    margin-left: 20px;
  }
  &-symbol {
    font-size: 14px;
    color: #B2B2B2;
  }
  &-div {
    font-size: 30px;
    font-weight: 100;
  }
  .black {
    color: #000000;
  }
  .gray {
    color: #B2B2B2;
  }
  .mint-form, .mint-info {
    padding: 20px;
  }
}
.colla-splitline {
  max-width: 500px;
}
.colla-help {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
}
</style>
<style lang="less">
.mint-setting {
  .mint-setting-input {
    margin-right: 20px;
    width: 250px;
  }
  .mint-setting-btn {
    width: 100px;
  }
}
</style>
