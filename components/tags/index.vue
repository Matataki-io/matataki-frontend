<template>
  <el-row class="tag-list">
    <el-col
      v-for="(item, index) in tagCards"
      :key="index"
      :span="typeIndex === 0 ? 8 : 12"
    >
      <n-link class="tag-card" :to=" {name: 'tag-id', params: {id: item.id}, query: {name: item.name, type: item.type}}">
        {{ item.name }}
      </n-link>
      <!-- <tag :type-index="typeIndex" :tag="item" /> -->
    </el-col>
  </el-row>
</template>

<script>
import throttle from 'lodash/throttle'
// import tag from './tag.vue'

export default {
  components: {
    // tag
  },
  props: {
    typeIndex: { // 通过 0 1 判断标签和布局类型  0 => 12 1 => 24
      type: Number,
      default: 0
    },
    tagCards: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less" scoped>
  .tag-card {
    display: block;
    background:rgba(230,244,255,1);
    border-radius:20px;
    font-size:16px;
    color:rgba(28,156,254,1);
    padding: 8px 0;
    margin: 10px 0;
    text-align: center;
    transition: all .18s;
    &:hover {
      background-color: #1C9CFE;
      color: #fff;
    }
  }
</style>
