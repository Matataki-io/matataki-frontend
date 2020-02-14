<template>
  <!-- // TODO: 需要调整 -->
  <div @click.stop="documentClick">
    <!-- 关联文章侧边栏 -->
    <div :class="relatedLeftCollapse && 'open'" @click.stop class="related left">
      <div class="related-container">
        <slot name="left" />
      </div>

      <div @click.stop="relatedLeftCollapse = !relatedLeftCollapse" class="related-arrow">
        <svg-icon icon-class="arrow" class="icon" />
        <span v-if="!relatedLeftCollapse">
          <slot name="left-prompt">已引用</slot>
        </span>
      </div>
    </div>
    <div :class="relatedRightCollapse && 'open'" @click.stop class="related right">
      <div class="related-container">
        <slot name="right" />
      </div>

      <div @click.stop="relatedRightCollapse = !relatedRightCollapse" class="related-arrow">
        <svg-icon icon-class="arrow" class="icon" />
        <span v-if="!relatedRightCollapse">
          <slot name="right-prompt">被引用</slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  data() {
    return {
      relatedLeftCollapse: false, // 左侧关联
      relatedRightCollapse: false, // 右侧关联
      resizeEvent: null
    }
  },
  mounted() {
    this.setRelatedSlider()
    this.resizeEvent = throttle(this.setRelatedSlider, 300)
    window.addEventListener('resize', this.resizeEvent)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  methods: {
    // 隐藏侧边关联栏
    documentClick() {
      this.relatedLeftCollapse = false
      this.relatedRightCollapse = false
    },
    // 设置侧边栏宽度
    setRelatedSlider() {
      this.$nextTick(() => {
        const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        // 10 + 37
        const sliderWidth = (clientWidth / 2) - 47
        if (sliderWidth < 580) {
          const relatedDom = document.querySelectorAll('.related')
          relatedDom.forEach((ele, i) => {
            // console.log(ele)
            ele.style.maxWidth = sliderWidth + 'px'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// related
.related {
  position: fixed;
  top: 60px;
  bottom: 0;
  background: #fff;
  width: 580px;
  box-sizing: border-box;
  // overflow: auto;
  transition: transform .3s;
  &.left {
    z-index: 1;
    left: 0;
    transform: translate3d(-100%, 0, 0);
    &.open {
      box-shadow:8px 0px 16px 0px rgba(0,0,0,0.1);
      transform: translate3d(0, 0, 0);
      .related-arrow .icon {
        transform: rotate(-180deg);
      }
    }
  }
  &.right {
    right: 0;
    transform: translate3d(100%, 0, 0);
    &.open {
      box-shadow:-8px 0px 16px 0px rgba(0,0,0,0.1);
      transform: translate3d(0, 0, 0);
      .related-arrow .icon {
        transform: rotate(0);
      }
    }
  }

  &-title {
    font-size:24px;
    font-weight:bold;
    color:rgba(0,0,0,1);
    span {
      color: @purpleDark;
      margin-left: 10px;
    }
  }
}

.related-container {
  overflow: auto;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.related-arrow {
  position: absolute;
  top: 50%;
  // transform: translate(0, -50%);
  color: @purpleDark;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .icon {
    font-size: 30px;
    color: @purpleDark;
    transition: transform .28s;
  }
  span {
    font-size:14px;
    color:rgba(178,178,178,1);
    margin-top: 10px;
  }
}
&.left .related-arrow {
  right: -10px;
  transform: translate(100%, -50%);
}
&.right .related-arrow {
  left: -10px;
  transform: translate(-100%, -50%);
  .icon {
    transform: rotate(180deg);
  }
}

</style>
