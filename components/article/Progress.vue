<template>
  <div role="progressbar" class="progress">
    <div class="progress-circle" style="height: 60px; width: 60px;">
      <svg viewBox="0 0 100 100">
        <path
          d="
        M 50 50
        m 0 -47
        a 47 47 0 1 1 0 94
        a 47 47 0 1 1 0 -94
        "
          stroke="#e5e9f2"
          stroke-width="5"
          fill="none"
          class="progress-circle__track"
          style="stroke-dasharray: 300px,300px; stroke-dashoffset: 0px;"
        />
        <path
          d="
        M 50 50
        m 0 -47
        a 47 47 0 1 1 0 94
        a 47 47 0 1 1 0 -94
        "
          stroke="#1C9CFE"
          fill="none"
          stroke-linecap="round"
          stroke-width="5"
          class="progress-circle__path"
          :style="`stroke-dasharray: ${strokeDasharray}px, 300px; stroke-dashoffset: 0px; transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;`"
        />
      </svg>
    </div>
    <div class="progress-text">
      <slot name="text" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    p: {
      type: Number,
      default: 0
    },
    clicked: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      circle: 60
    }
  },
  computed: {
    strokeDasharray() {
      if (this.clicked) {
        return 300
      }
      if (this.p === 0) {
        return 0
      } else if (this.p % this.circle === 0) {
        return 300
      } else {
        return (this.p % this.circle) * 5
      }
    }
  },
  watch: {},
  methods: {}
}
</script>

<style scoped lang="less">
.progress {
  position: relative;
  line-height: 1;
  display: inline-block;
  z-index: 200;
  background: #F1F1F1;
  border-radius: 50%;
  cursor: pointer;
}
.progress-text {
  font-size: 16px;
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 0;
  transform: translateY(-50%);
  color: #606266;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
</style>
