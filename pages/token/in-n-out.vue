<template>
  <div class="in-out-container">
    <div class="banner">
        <h1 class="title">
            Fan票的提取&转入
        </h1>
    </div>
    <div v-if="!isLogined" class="card not-logined">
      <h1 class="title">
        😺嗯？你好像还没有登录？
      </h1>
      <h2 class="subtitle">
        你需要先登录才能使用这个功能
      </h2>
      <el-button @click="login">
        注册/登录
      </el-button>
    </div>
    <client-only v-else>
      <div class="card">
        <el-page-header content="Fan票折跃门" @back="$router.back()" />
        <div class="chain-selection">
          目标区块链：
          <el-radio v-model="chainSelection" label="rinkeby">
            以太坊 Rinkeby 测试网
          </el-radio>
          <el-radio v-model="chainSelection" label="bsc">
            币安智能链(BSC) 主网
          </el-radio>
        </div>
        <div class="direction-selection">
          方向（往 Matataki）：
          <el-radio v-model="direction" label="withdraw">
            提现 WITHDRAW
          </el-radio>
          <el-radio v-model="direction" label="deposit">
            存入 DEPOSIT
          </el-radio>
          <div class="logic-container">
            <RinkebyInAndOut v-if="isRinkebySelected" :direction="direction" />
            <BscInAndOut v-if="isBscSelected" :direction="direction" />
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RinkebyInAndOut from '../../components/token_in_and_out/rinkeby.vue'
import BscInAndOut from '../../components/token_in_and_out/bsc.vue'

export default {
  name: 'FanPiaoInAndOut',
  components: {
    RinkebyInAndOut,
    BscInAndOut
  },
  data: () => ({
    chainSelection: 'rinkeby',
    direction: 'withdraw'
  }),
  computed: {
    ...mapGetters(['isLogined']),
    isRinkebySelected() {
      return this.chainSelection === 'rinkeby'
    },
    isBscSelected() {
      return this.chainSelection === 'bsc'
    },
  },
  methods: {
    login() {
      this.$store.commit('setLoginModal', true)
      this.$emit('login')
    },
  }
}
</script>

<style scoped>
.in-out-container {
  max-width: 1200px;
  width: 100%;
  /* margin-top: 20px; */
  margin: 20px auto;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}
img.banner {
    width: 100%;
}
div.banner {
    background-image: url("../../assets/img/token-banner.png");
    background-size: 100% 100%;
    height: 260px;
    width: auto;
    margin: 20px;
}
div.banner .title {
    padding-top: 110px;
    text-align: center;
    margin: 0;
}
.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  padding: 10px;
}
.card .el-alert {
  margin: 10px 0;
}
</style>