<template>
  <div class="card-list">
    <h3 class="card-list-title">
      引用动态：
    </h3>
    <template v-for="(item, index) in befs">
      <shareOuterCard
        v-if="item.ref_sign_id === 0"
        :key="'shareOuterCard' + index"
        class="card-list-item"
        :card="item"
        card-type="read"
        @ref="val => $emit('ref', val)"
      />
      <sharePCard
        v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
        :key="'sharePCard' + index"
        class="card-list-item"
        :card="item"
        card-type="read"
        @ref="val => $emit('ref', val)"
      />
      <shareInsideCard
        v-else-if="item.ref_sign_id && item.channel_id === 3"
        :key="'shareInsideCard' + index"
        class="card-list-item"
        :card="item"
        card-type="read"
        from="beref"
        @ref="val => $emit('ref', val)"
      />
    </template>
  </div>
</template>

<script>

import shareOuterCard from '@/components/share_outer_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'

export default {
  components: {
    shareOuterCard,
    sharePCard,
    shareInsideCard,
  },
  props: {
    // 卡片数据
    befs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.card-list {
  padding: 20px 20px 0;

  &-title {
    font-size: 18px;
    margin: 0 0 10px;
    padding: 0;
    color: black;
  }

  &-item {
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }

    /deep/ .card {
      background-color: #fff;
      border-radius:10px;
      box-sizing: border-box;
      box-shadow: 0 0 2px 0 #0000001a;
      border: none;
    }
  }
}
</style>