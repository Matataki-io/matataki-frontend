<template>
  <div class="main exchange">
    <g-header />
    <div class="p-w">
      <el-tabs type="border-card">
        <el-tab-pane label="兑换">
          <Swap />
        </el-tab-pane>
        <el-tab-pane label="发送">
          <span style="color: white;">敬请期待！</span>
        </el-tab-pane>
        <el-tab-pane label="资金池">
          <Pool />
        </el-tab-pane>
      </el-tabs>
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
  async asyncData({ $axios }) {
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.checkLogin()
    })
  },
  methods: {
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
.exchange {
  .el-tabs--border-card {
      border: none;
      box-shadow: none;
  }
  .el-tabs--border-card>.el-tabs__header {
    background-color: rgb(51, 54, 57);
    border: none;
  }
  .el-tabs__content {
    background: rgb(51, 54, 57);
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #409EFF;
    background-color: rgb(32, 33, 36);
    border-color: rgb(51, 51, 51);
  }
  .el-tabs__nav {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 2.5rem;
    background-color: rgb(41, 44, 47);
    flex-flow: row nowrap;
    border-radius: 3rem;
    width: 100%;
  }
  .el-tabs__item {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    height: 2.5rem;
    cursor: pointer;
    color: rgb(196, 196, 196);
    font-size: 1rem;
    box-sizing: border-box;
    flex-flow: row nowrap;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(51, 51, 51, 0);
    border-image: initial;
    flex: 1 0 auto;
    border-radius: 3rem;
    outline: none;
    text-decoration: none;
  }
}
</style>
<style lang="less" scoped>
.main {
  .minHeight();
  background: rgb(51, 54, 57);
}
@width: 650px;
.p-w  {
  width: @width;
  margin: 20px auto 0 auto;
}
</style>
