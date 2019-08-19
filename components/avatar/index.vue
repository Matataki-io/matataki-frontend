<template>
  <div
    class="g-avatar"
    :style="{
      width: size,
      height: size
    }"
  >
    <template v-if="imgStatus">
      <img v-if="src" :src="src" alt="avatar" @onerror="() => imgStatus = false">
      <svg-icon v-else icon-class="avatar" class="icon-avatar" />
    </template>
    <svg-icon v-else icon-class="crack" class="icon-crack" />
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
  },
  data() {
    return {
      imgStatus: true
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
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    .imgObjectFitCover();
  }
  .icon-avatar {
    .imgObjectFitCover();
    color: #c1c4cc;
  }
  .icon-crack {
    width: 50%;
    height: 50%;
    object-fit: cover;
    color: #5d5d5d;
  }
}
</style>
