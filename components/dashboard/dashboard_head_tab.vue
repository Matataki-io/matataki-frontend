<template>
  <div class="dashboard-tab">
    <router-link :to="{ name: 'dashboard' }" class="tab-link" :class="$route.name === 'dashboard' && 'active'">
      阅览数据
    </router-link>
    <router-link :to="{ name: 'dashboard-income' }" class="tab-link" :class="$route.name === 'dashboard-income' && 'active'">
      收益数据
    </router-link>
    <el-select
      v-model="value"
      placeholder="请选择"
      class="select"
      size="small"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>


<script>
export default {
  props: {
    active: {
      type: String,
      default: ''
    },
    sortValue: {
      type: String,
      default: '30'
    }
  },
  data() {
    return {
      options: [{
        value: '30',
        label: '30天'
      }, {
        value: 'all',
        label: '全部'
      }],
      value: ''
    }
  },
  created() {
    this.value = this.sortValue
  },
  methods: {
    change(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-tab {
  display: flex;
  align-items: center;
}
.tab-link {
  padding: 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color:rgba(178,178,178,1);
  line-height:28px;
  margin-right: 40px;
  &:nth-last-child(1) {
    margin-right: 0;
  }
  &.active {
    color: #000;
  }

  @media screen and (max-width: 540px) {
    font-size: 16px;
    margin-right: 20px;
  }
}
.select {
  width: 100px;
  margin-left: auto;
}
</style>