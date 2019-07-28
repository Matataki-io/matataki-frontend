<template>
  <div
    class="g-avatar"
    :style="{
      width: size,
      height: size
    }"
  >
    <img v-if="src" :src="src" alt="avatar">
    <svg-icon v-else icon-class="avatar" class="icon-avatar" />
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '1rem'
    }
  }
}
</script>

<style lang="less" scoped>
.imgObjectFitCover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.g-avatar {
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;
  img {
    .imgObjectFitCover();
  }
  .icon-avatar {
    .imgObjectFitCover();
    color: #c1c4cc;
  }
}
</style>
