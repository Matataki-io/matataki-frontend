<template>
  <n-link target="_blank" :to="{name: 'p-id', params: {id: card.id}}">
    <div class="slide">
      <img
        v-if="cover"
        :src="cover"
        alt="cover"
      >
      <div class="title">
        {{ card&& card.title }}
      </div>
    </div>
  </n-link>
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
      return this.card.cover ? this.$backendAPI.getAvatarImage(this.card.cover) : ''
    }
  }
}
</script>

<style lang="less" scoped>
.slide {
  display: flex;
  height: 394px;
  background: #fff;
  box-sizing: border-box;
  border-radius: 10px;
  margin-top: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  transform: rotate(0deg);
  position: relative;
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

  .title {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 22px;
    line-height: 1.5;
    padding: 14px 20px;
    font-weight: bold;
  }
}

</style>
