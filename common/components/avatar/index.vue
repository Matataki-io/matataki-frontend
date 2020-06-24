<template>
  <div class="components-avatar">
    <img
      v-if="src"
      :src="src"
      alt="avatar"
    >
    <img
      v-else
      :src="defaultAvatar"
      alt="avatar"
    >
  </div>
</template>

<script>
import defaultAvatar from '@/assets/img/default_avatar.png'

export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultAvatar
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
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f1f1f1;
  }
}
</style>
