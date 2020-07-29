<template>
  <settingLayout>
    <div class="mint-setting">
      <a href="https://www.yuque.com/matataki/matataki">完整Fan票规则说明 ></a>
      <div v-loading="loading" class="form-container">
        <div class="mint-info">
          <span class="mint-setting-label black">已增发：</span>
          <span class="mint-setting-num">0</span> 
          <span class="mint-setting-symbol">次</span> 
          <span class="mint-setting-num">0</span> 
          <span class="mint-setting-symbol">LJM</span> 
        </div>
        <div class="mint-form">
          <el-input v-model="form.amount" placeholder="输入增发数量数量" class="mint-setting-input" />
          <el-button 
            type="primary" 
            class="mint-setting-btn" 
            @click="mint"
          >
            立即增发
          </el-button>
        </div>
      </div>
      <el-divider class="colla-splitline" />
      <p class="colla-help">
        手动增发规则：<br>
        1. 首次发行成功后即可立即操作手动增发<br>
        2. 每次增发后需要等待10天可再次增发<br>
        3. 发行者可以设置将每次增发Fan票的一定比例自动转入直通车中<br>
      </p>
    </div>
  </settingLayout>
</template>

<script>
import settingLayout from '@/components/token/liquidity_setting.vue'

export default {
  components: {
    settingLayout,
  },
  data() {
    return {
      loading: false,
      form: {
        amount: null
      },
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getItem()
  },
  methods: {
    async getItem() {
    },
    async updateAmount() {
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
    margin-right: 10px;
  }
  &-num {
    font-size: 30px;
    font-weight: bolder;
    color: #000000;
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
    margin-top: 20px;
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
    width: auto;
  }
  .mint-setting-btn {
    width: 100px;
  }
}
</style>
