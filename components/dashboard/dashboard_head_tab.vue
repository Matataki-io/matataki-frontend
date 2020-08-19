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
    }
  },
  data() {
    return {
      options: [{
        value: '30',
        label: '30天'
      }, {
        value: '15',
        label: '15天'
      }, {
        value: '7',
        label: '7天'
      }, {
        value: '1',
        label: '1天'
      }],
      value: '30'
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
  font-size:20px;
  font-weight:600;
  color:rgba(178,178,178,1);
  line-height:28px;
  margin-right: 40px;
  &:nth-last-child(1) {
    margin-right: 0;
  }
  &.active {
    color: #000;
  }
}
.select {
  margin-left: auto;
}
</style>