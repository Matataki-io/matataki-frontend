<template>
  <div class="in-out-container">
    <div class="banner">
      <h1 class="title">
        {{ $t('coin-folding-door') }}
      </h1>
      <a href="https://www.yuque.com/matataki/matataki/zcs21y" class="faq-link" target="_blank">
        {{ $t('use-tutorial') }}
        <svg-icon icon-class="anser" class="anser" />
      </a>
    </div>
    <div v-if="!isLogined" class="card not-logined">
      <h1 class="title">
        😺{{ $t('you-seem-to-have-not-logged-in-yet') }}
      </h1>
      <h2 class="subtitle">
        {{ $t('you-need-to-log-in-to-use-this-feature') }}
      </h2>
      <el-button @click="login">
        {{ $t('register-or-log-in') }}
      </el-button>
    </div>
    <client-only v-else>
      <div class="direction-selection">
        <el-button-group>
          <el-button :type="isWithdrawSelected ? 'primary' : ''" @click="direction = 'withdraw'">
            {{ $t('extract') }}
          </el-button>
          <el-button :type="isWithdrawSelected ? '' : 'primary'" @click="direction = 'deposit'">
            {{ $t('transfer-in') }}
          </el-button>
        </el-button-group>
      </div>
      <div class="card">
        <div class="chain-selection">
          {{ $t('target-blockchain') }}：
          <el-radio v-model="chainSelection" label="rinkeby">
            {{ $t('ethereum-Rinkeby-testnet') }}
          </el-radio>
          <el-radio v-model="chainSelection" label="bsc">
            {{ $t('binance-Smart-Chain-BSC-Mainnet') }}
          </el-radio>
        </div>
        <div class="logic-container">
          <RinkebyInAndOut v-if="isRinkebySelected" :direction="direction" />
          <BscInAndOut v-if="isBscSelected" :direction="direction" />
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
    isWithdrawSelected() {
      return this.direction === 'withdraw'
    }
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
.direction-selection {
    text-align: center;
    margin: 20px;
}
.direction-selection .el-button{
    padding: 10px 45px;
}
div.banner {
    background-image: url("../../assets/img/token-banner.png");
    background-repeat: no-repeat;
    background-size: 1160px 240px;
    height: 260px;
    width: auto;
    margin: 20px;
}
div.banner .faq-link {
    text-align: center;
    display: block;
    color: #0289ff;
    font-size: 16px;
    margin-top: 10px;
}
div.banner .title {
    padding-top: 110px;
    text-align: center;
    margin: 0;
    color: #523404;
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

<style lang="less" scoped>
.chain-selection {
  margin: 10px 0 20px;
}
</style>