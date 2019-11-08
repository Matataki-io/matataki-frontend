<template>
  <div class="main exchange">
    <g-header />
    <div class="outer-container">
      <img class="ma-banner" src="@/assets/img/exchange-banner.png" alt="banner">
      <a class="help-link" target="_blank" href="https://www.matataki.io/p/981">如何交易粉丝币?</a>
      <div class="p-w">
        <el-tabs type="border-card">
          <el-tab-pane label="交易">
            <Swap />
          </el-tab-pane>
          <!-- <el-tab-pane label="赠送">
            <div style="color: white;text-align: center;">
              <a href="/tokens">跳转到我的粉丝币页面</a>
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="流动金池">
            <Pool />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Swap from '@/components/exchange/Swap'
import Pool from '@/components/exchange/Pool'
export default {
  components: {
    Swap,
    Pool
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  async asyncData({ $axios }) {
  },

  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.checkLogin()
    })
  },
  methods: {
    getWeixinOpenId() {
      const code = this.$route.query.code
      this.$API.getWeixinOpenId(code).then(res => {
        console.log(res)
      })
    },
    checkLogin() {
      if (!this.isLogined) {
        this.$message({ message: this.$t('error.pleaseLogin'), type: 'info', customClass: 'zindex-3000' })
        this.$store.commit('setLoginModal', true)
        return false
      }
    }
  }
}
</script>
<style lang="less">
@bg-color: #F7F7F7;
.exchange {
  .el-tabs--border-card {
      border: none;
      box-shadow: none;
  }
  .el-tabs--border-card>.el-tabs__header {
    background-color: @bg-color;
    border: none;
  }
  .el-tabs__content {
    background: @bg-color;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: white;
    background-color: @purpleDark;
  }
  .el-tabs__nav {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 2.5rem;
    background-color: @bg-color;
    flex-flow: row nowrap;
    border-radius: 3rem;
    width: 400px;
  }
  .el-tabs__nav-scroll {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    margin-bottom: 30px;
  }
  .el-tabs__item {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    height: 2.5rem;
    cursor: pointer;
    color: @purpleDark;
    font-size: 1rem;
    box-sizing: border-box;
    flex-flow: row nowrap;
    border-width: 1px;
    border-style: solid;
    border-color: @purpleDark;
    border-image: initial;
    flex: 1 0 auto;
    outline: none;
    text-decoration: none;
    &:first-child {
      border-top-left-radius: @borderRadius6;
      border-bottom-left-radius: @borderRadius6;
    }
    &:last-child {
      border-top-right-radius: @borderRadius6;
      border-bottom-right-radius: @borderRadius6;
    }
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item {
    border-color: @purpleDark;
    color: @purpleDark;
    width: 100px;
  }
}
</style>
<style lang="less" scoped>
@bg-color: #F7F7F7;
.main {
  .minHeight();
  background: @bg-color;
}
@width: 650px;
.outer-container {
  padding-top: 20px;
  width: 766px;
  margin: auto;
  position: relative;
}
.p-w  {
  width: @width;
  margin: 20px auto 0 auto;
}
.help-link {
  font-size: 14px;
  color: @gray;
  text-decoration: underline;
  position: absolute;
  right: 80px;
  top: 320px;
  z-index: 10;
}
</style>
