<template>
  <div class="components-avatar">
    <img v-show="src" :src="src" alt="avatar">
  </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.components-avatar {
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  border: 1px solid #ddd;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
