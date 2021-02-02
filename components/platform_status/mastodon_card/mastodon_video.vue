<template>
  <div class="videobox">
    <video controls>
      <source :src="video.url">
      {{ $t('your-browser-does-not-support-the-HTML5-video-tag') }}
    </video>
    <div v-if="locked" class="videobox-sensitive" @click="openSensitiveShow">
      <div class="videobox-sensitive-tab">
        {{ $t('sensitive-content') }}
      </div>
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
    },
    sensitive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showSensitive: false
    }
  },
  computed: {
    locked () {
      return this.sensitive && !this.showSensitive
    }
  },
  methods: {
    openSensitiveShow () {
      if (!this.sensitive) return
      this.showSensitive = true
    }
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
  position: relative;

  video {
    width: 100%;
    height: 100%;
  }

  &-sensitive {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    backdrop-filter: blur(50px);
    border-radius: 16px;
    cursor: pointer;

    &-tab {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: black;
      z-index: 1;
      background: #ffffff80;
      cursor: pointer;
    }
  }
}
</style>