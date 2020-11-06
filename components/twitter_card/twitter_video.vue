<template>
  <div class="videobox">
    <video
      controls
      :loop="video.type === 'gif'"
    >
      <source :src="video.url" :type="video.content_type">
      您的浏览器不支持 HTML5 video 标签。
    </video>
    <div v-if="video.type === 'gif'" class="videobox-gif">
      GIF
    </div>
  </div>
</template>

<script>

export default {
  props: {
    // 卡片数据
    video: {
      type: Object,
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
  background: black;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  video {
    width: 100%;
    height: 100%;
  }
  &-gif {
    position: absolute;
    left: 10px;
    top: 10px;
    background: #000000c4;
    border-radius: 4px;
    font-size: 13px;
    color: white;
    font-weight: 700;
    line-height: 20px;
    height: 20px;
    padding: 0 5px;
  }
}
</style>