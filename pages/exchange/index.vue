<template>
  <div class="main">
    <g-header />
    <div class="p-w">
      <el-tabs type="border-card">
        <el-tab-pane label="兑换">
          <Swap></Swap>
        </el-tab-pane>
        <el-tab-pane label="发送">发送</el-tab-pane>
        <el-tab-pane label="资金池">资金池</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Swap from '@/components/exchange/Swap'
export default {
  components: {
    Swap
  },
  data() {
    return {
    }
  },
  async asyncData({ $axios }) {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.main {
  .minHeight();
}
@width: 850px;
.p-w  {
  width: @width;
  margin: 20px auto 0 auto;
}
</style>
