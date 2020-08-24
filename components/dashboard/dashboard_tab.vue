<template>
  <el-radio-group
    v-model="val"
    size="small" 
    @change="change"
  >
    <el-radio-button 
      v-for="(item, index) in tab"
      :key="index"
      class="db-tab-block"
      :label="item.value"
    >
      {{ item.label }}
    </el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    tab: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      val: '',
    }
  },
  watch: {
    value(val) {
      this.val = val
    }
  },
  created() {
    this.val = this.value || this.tab.length >= 1 ? this.tab[0].value : ''
  },
  methods: {
    change(label) {
      this.$emit('change', label)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.db-tab-block {
  &.el-radio-button--small .el-radio-button__inner {
    padding: 8px 32px;
  }
}
</style>