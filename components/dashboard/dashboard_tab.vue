<template>
  <el-radio-group
    v-model="value"
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
    }
  },
  data() {
    return {
      value: 'read',
    }
  },
  created() {
    this.value = this.tab.length >= 1 ? this.tab[0].value : ''
  },
  methods: {
    change(label) {
      console.log('label value', label, this.value)
      // this.value = label
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