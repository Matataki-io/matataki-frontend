<template>
  <div
    class="g-avatar"
    :style="{
      width: size,
      height: size
    }"
  >
    <el-image v-if="src" :src="src" class="img-lazy" alt="avatar">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline" />
      </div>
    </el-image>
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
  },
  data() {
    return {
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
.img-lazy {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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

<style lang="less">
.g-avatar .el-icon-picture-outline {
  font-size: 18px;
  color: #848484;
}
</style>
