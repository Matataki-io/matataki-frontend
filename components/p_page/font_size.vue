<template>
  <div class="font-size">
    <div class="font-btn" :class="toggleSlider && 'active'" @click="toggleSlider = !toggleSlider">
      A
    </div>
    <div v-if="toggleSlider" class="fl ac">
      <span class="symbol min">a</span>
      <div class="font-slider-content">
        <div class="line step" />
        <div class="line step" />
        <div class="line step" />
        <div class="line before" />
        <div class="line after" />
        <span class="font-title">标准</span>
        <el-slider
          v-model="value"
          :step="1"
          :min="0"
          :max="4"
          class="font-slider"
          :show-tooltip="false"
        />
      </div>
      <span class="symbol max">a</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      toggleSlider: false,
      sliderValue: 1
    }
  },
  watch: {
    value(newVal) {
      this.sliderValue = newVal
    },
    sliderValue(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
.font-btn {
    width: 20px;
    height: 20px;
    background-color: #DBDBDB;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;
    user-select: none;
    &.active {
      background-color: mix(#DBDBDB, #000, 80%);
    }
}
.font-slider-content {
  position: relative;
      display: flex;
    align-items: center;
}
.font-size {
  height: 40px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  .symbol {
    user-select: none;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:30px;
    margin: 0 10px;
    &.max {
    font-size:22px;
    }
    &.min {
      font-size: 14px;
    }
  }

  .line {
    height: 10px;
    width: 1px;
    background-color: #B2B2B2;
    position: absolute;
    &.before {
      left: 0;
    }
    &.after {
      right: 0;
    }
    &.step {
      &:nth-of-type(1) {
        left: 25%;
      }
      &:nth-of-type(2) {
        left: 50%;
      }
      &:nth-of-type(3) {
        left: 75%;
      }
    }
  }
  .font-title {
    position: absolute;
    left: 25%;
    top: -12px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0,0,0,1);
    line-height: 17px;
    transform: translateX(-50%);
  }
  /deep/ .el-slider__bar {
    background-color: transparent !important;
  }
  /deep/ .el-slider__button-wrapper {
    top: -18px;
  }
  /deep/ .el-slider__runway {
    background-color: #B2B2B2;
    height: 1px;
  }
  /deep/ .el-slider__button {
    border: none;
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.25);
  }
}
.font-slider {
  width: 200px;
}
</style>