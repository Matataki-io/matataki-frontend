<template>
  <div class="videobox">
    <video controls>
      <source :src="video.url" :type="video.content_type">
      您的浏览器不支持 HTML5 video 标签。
    </video>
  </div>
</template>

<script>

export default {
  props: {
    // 卡片数据
    video: {
      type: Array,
      required: true
    }
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>

.videobox {
  border: 1px solid #ccd6dd;
  background: #f1f1f1;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>