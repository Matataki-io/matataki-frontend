<template>
  <div class="db-tab">
    <div
      v-for="(item, index) in tab"
      :key="index"
      class="db-tab-block"
      :class="value === item.value && 'active'"
      @click="value = item.value"
    >
      {{ item.label }}
    </div>
  </div>
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
      value: 'read'
    }
  },
  created() {
    this.value = this.tab.length >= 1 ? this.tab[0].value : ''
  }
}
</script>

<style lang="less" scoped>
.db-tab {
  .clearfix();

  border: 1px solid #DBDBDB;
  border-radius:4px;
  display: inline-block;
  overflow: hidden;

  .db-tab-block {
    float: left;
    font-size:14px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:20px;
    padding: 5px 30px;
    margin: 0;
    border-left: 1px solid #DBDBDB;
    cursor: pointer;
    transition: all .1s;

    &.active {
      background-color: #542DE0;
      color: #fff;
    }

    &:hover {
      background-color: #542DE0;
      color: #fff;
    }

    &:nth-child(1) {
      border-left: none;
    }
  }
}
</style>