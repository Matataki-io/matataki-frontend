<template>
  <div class="slide">
    <img
      v-if="cover"
      src="https://image.gcores.com/6aea3b43-cd75-4476-ba01-bbf7323f6376.jpg?x-oss-process=image/quality,q_90/resize,limit_1,m_lfit,w_1600"
      alt="cover"
    >
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    cover() {
      // return this.card.cover ? this.$backendAPI.getAvatarImage(this.card.cover) : ''
      return 1
    }
  }
}
</script>

<style lang="less" scoped>
.slide {
  display: flex;
  max-width: 787px;
  flex: 0 0 787px;
  height: 394px;
  background: #fff;
  box-sizing: border-box;
  border-radius: 10px;
  margin-top: 40px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  }
  &:hover img {
    transform: scale(1.02);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s;
  }
}
</style>
