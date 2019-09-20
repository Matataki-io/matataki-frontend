<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="输入">
        <el-input-number v-model="form.input" :step="0.01" :min="0"></el-input-number>
        <el-select v-model="form.inputToken" filterable placeholder="选择通证">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="输出">
        <el-input-number v-model="form.output" :step="0.01" :min="0"></el-input-number>
        <el-select v-model="form.outputToken" filterable placeholder="选择通证">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">兑换</el-button>
      </el-form-item>
    </el-form>
    <OrderModal v-model="orderShow" :order="order"></OrderModal>
  </div>
</template>

<script>
import OrderModal from './OrderModal'
export default {
  components: {
    OrderModal
  },
  data() {
    return {
      orderShow: false,
      form: {
        input: '',
        inputToken: '',
        output: '',
        outputToken: ''
      },
      options: [{
        value: 'RMB',
        label: 'RMB'
      }, {
        value: 'ETH',
        label: 'ETH'
      }, {
        value: 'BAT',
        label: 'BAT'
      }],
      order: {}
    }
  },
  async asyncData() {
  },
  created() {
  },
  methods: {
    onSubmit() {
      this.$API.wxpay(this.form.input, 'daodaobi').then((res) => {
        this.order = res
        this.orderShow = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
