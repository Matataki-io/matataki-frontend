<template>
  <div
    class="swipe-content"
    @click="$emit('handleClick', {
      index: index, id: item.id
    })"
  >
    <img
      v-lazy="cover(item.cover)"
      :alt="item.title"
    >
    <p>{{ item.title }}</p>
    <div class="full" />
  </div>
</template>

<script>
export default {
  name: 'ArticleSwipeItemPc',
  serverCacheKey(props) {
    return `ArticleSwipeItemPc::${props.index}::${props.item.title}::${props.item.cover}`
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
.swipe-content {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background-color: #f1f1f1;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  p {
    position: absolute;
    bottom: 40px;
    left: 50px;
    right: 40px;
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #ffffff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin: 0;
    z-index: 10;
    opacity: 0.5;
    padding: 0 0 0 15px;
    &::before {
      display: block;
      content: "";
      width: 5px;
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
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
}
// 小于768
@media screen and (max-width: 768px) {
  .swipe-content p {
    bottom: 30px;
    left: 20px;
    right: 20px;
    font-size: 20px;
  }
}
</style>