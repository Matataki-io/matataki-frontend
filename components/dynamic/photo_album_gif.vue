<template>
  <div class="videobox">
    <video
      loop
      muted
      onMouseOver="this.play()"
      onMouseOut="this.pause()"
    >
      <source :src="src">
      您的浏览器不支持 HTML5 video 标签。
    </video>
    <div class="videobox-gif">
      GIF
    </div>
  </div>
</template>

<script>

export default {
  props: {
    // 卡片数据
    src: {
      type: String,
      required: true
    }
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>

.videobox {
  background: black;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
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