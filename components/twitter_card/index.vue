<template>
  <div class="card">
    <div v-for="(item, index) in queue" :key="index">
      <twitterCardUnit
        v-if="item !== 1"
        :show-up-line="index !== 0"
        :show-down-line="index !== queue.length - 1"
      />
      <moreReplies v-else />
    </div>
  </div>
</template>

<script>
import twitterCardUnit from './twitter_card_unit'
import moreReplies from './more_replies'

export default {
  components: {
    twitterCardUnit,
    moreReplies
  },
  props: {
    // 卡片数据
    card: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      queue: [ ...Array(3) ]
    }
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>

.card {
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;

}
</style>