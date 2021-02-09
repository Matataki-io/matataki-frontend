<template>
  <div class="card-list">
    <template v-for="(item, index) in refs.slice(0, 1)">
      <shareOuterCard
        v-if="item.ref_sign_id === 0"
        :key="'shareOuterCard' + index"
        :card="item"
        card-type="read"
        @ref="val => $emit('ref', val)"
      />
      <sharePCard
        v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
        :key="'sharePCard' + index"
        :card="item"
        card-type="read"
        @ref="val => $emit('ref', val)"
      />
      <shareInsideCard
        v-else-if="item.ref_sign_id && item.channel_id === 3"
        :key="'shareInsideCard' + index"
        :card="item"
        card-type="read"
        @ref="val => $emit('ref', val)"
      />
    </template>
    <div
      :class="toggleMore && 'open'"
      class="card-list__more"
    >
      <template v-for="(item, index) in shareListMore">
        <shareOuterCard
          v-if="item.ref_sign_id === 0"
          :key="'shareOuterCard' + index"
          class="card-list__more-item"
          :card="item"
          card-type="read"
          @ref="val => $emit('ref', val)"
        />
        <sharePCard
          v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
          :key="'shareOuterCard' + index"
          class="card-list__more-item"
          :card="item"
          card-type="read"
          @ref="val => $emit('ref', val)"
        />
        <shareInsideCard
          v-else-if="item.ref_sign_id && item.channel_id === 3"
          :key="'shareOuterCard' + index"
          class="card-list__more-item"
          :card="item"
          card-type="read"
          @ref="val => $emit('ref', val)"
        />
      </template>
    </div>
    <div
      v-if="shareListMore.length !== 0"
      :class="toggleMore && 'open'"
      class="card-more"
      @click="toggleMore = !toggleMore"
    >
      <span>{{ toggleMore ? $t('hideMore') : $t('viewMore') }}</span><i class="el-icon-d-arrow-left icon" />
    </div>
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
    refs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      toggleMore: false
    }
  },
  computed: {
    shareListMore() {
      if (this.refs && this.refs.length > 1) return this.refs.slice(1)
      else return []
    },
  }
}
</script>

<style lang="less" scoped>
.card-list {

  &__more {
    max-height: 0;
    transition: all .3s;
    overflow: hidden;
    &.open {
      max-height: none;
    }

    &-item {
      margin-top: 10px;
    }
  }
}

.card-more {
  text-align: center;
  padding: 10px 0;
  &.open .icon {
    transform: rotate(90deg);
  }
  span {
    font-size:12px;
    font-weight:400;
    color:@purpleDark;
    line-height:17px;
    margin-right: 2px;
    cursor: pointer;
  }
  .icon {
    color:@purpleDark;
    transform: rotate(-90deg);
    font-size:12px;
  }
}
</style>