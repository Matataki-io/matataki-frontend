<template>
  <div
    class="swip-container"
    @click="$emit('handleClick', {
      id: item.id
    })"
  >
    <img
      :src="cover(item.cover)"
      :alt="item.title"
    >
    <p>{{ item.title }}</p>
    <div class="full" />
  </div>
</template>

<script>
export default {
  name: 'ArticleSwipeItemMobile',
  serverCacheKey(props) {
    return `ArticleSwipeItemMobile::${props.index}::${props.item.title}::${props.item.cover}`
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    cover(src) {
      return src ? this.$ossProcess(src, { h: 390 }) : this.$ossProcess('/material/default_cover_v1.png', { h: 390 })
    },
  }
}
</script>

<style lang="less" scoped>
// 小于768
@media screen and (max-width: 768px) {
  .swipe-content p {
    bottom: 30px;
    left: 20px;
    right: 20px;
    font-size: 20px;
  }
}
.swip-container {
  overflow: hidden;
  background: #f1f1f1;
  border: 1px solid #f1f1f1;
  box-sizing: border-box;
  height: 170px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  p {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 1);
    line-height: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    z-index: 10;
    margin: 0;
    padding: 0 0 0 8px;
    &::before {
      display: block;
      content: "";
      width: 2px;
      // height: 30px;
      background: #fff;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
    }
  }
  .full {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    height: 60px;
    top: auto;
    background: linear-gradient(0, rgba(0, 0, 0, 0.5) 0, transparent 100%);
  }
}
</style>