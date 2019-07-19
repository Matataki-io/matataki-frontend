<template>
  <div class="slide-item" @click="jumpPage(slide.id)">
    <img v-if="cover" :src="cover" alt="cover" />
    {{ cover }}
    <div class="slide-read">
      {{ slideIndex === 0 ? '浏览量: ' + slide.read : '总销量: ' + slide.sale }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSlideItem',
  props: {
    slide: {
      type: Object,
      default: () => {}
    },
    slideIndex: {
      type: Number,
      default: () => 0
    }
  },
  computed: {
    cover() {
      return this.slide.cover ? this.$backendAPI.getAvatarImage(this.slide.cover) : ''
    }
  },
  methods: {
    jumpPage(id) {
      this.$router.push({ name: 'Article', params: { hash: id } })
    }
  }
}
</script>

<style lang="less" scoped>
.slide-item {
  height: 130px;
  width: 260px;
  flex: 1 0 260px;
  margin: 0 0 0 20px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: rgba(216, 216, 216, 1);
  box-shadow: -4px 10px 14px 0 rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &:nth-last-child(1) {
    margin: 0 20px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .slide-read {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fb6877;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 20px;
    text-align: center;
    border-radius: 0 20px 0 0;
    line-height: 1.5;
  }
}
</style>
