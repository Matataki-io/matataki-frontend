<template>
  <div class="swipe-wrapper">
    <div
      ref="swipe"
      class="swipe"
    >
      <el-carousel
        v-if="swipeMode === 'pc'"
        :key="key"
        :interval="3000"
        trigger="click"
        :type="swipeType"
        :height="swipeHeight"
        arrow="always"
        class="pc"
        @change="swipeChange"
      >
        <el-carousel-item
          v-for="(item, index) in card"
          :key="index"
        >
          <div
            class="swipe-content"
            @click="viewP(index, item.id)"
          >
            <img
              v-if="item.cover"
              v-lazy="cover(item.cover)"
              :alt="item.title"
            >
            <p>{{ item.title }}</p>
            <div class="full" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <van-swipe
      v-if="swipeMode === 'mobile'"
      :autoplay="30000"
      indicator-color="#542DE0"
      :height="200"
      class="mobile"
    >
      <van-swipe-item
        v-for="(item, index) in card"
        :key="index"
      >
        <div
          class="swip-container"
          @click="viewPM(item.id)"
        >
          <img
            v-if="item.cover"
            :src="cover(item.cover)"
            :alt="item.title"
          >
          <p>{{ item.title }}</p>
          <div class="full" />
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  props: {
    card: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      swipeIndex: 0,
      swipeHeight: '400px',
      swipeType: 'card', // card
      resizeEvent: null,
      key: 1,
      swipeMode: ''
    }
  },
  created() {
    if (process.browser) {
      this.$nextTick(() => {
        this.resizeInit()
        this.resizeEvent = throttle(this.resizeInit, 300)
        window.addEventListener('resize', this.resizeEvent)
      })
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  methods: {
    resizeInit() {
      let clientWidth = document.documentElement.clientWidth || document.body.clientWidth
      // console.log('clientWidth', clientWidth)
      if (clientWidth < 768) {
        this.swipeType = ''
        this.swipeHeight = Math.round(clientWidth / 2.6) + 'px'
        this.key++ // 组件重新渲染
      } else {
        this.swipeType = 'card'
        this.swipeHeight = '400px'
      }
      if (clientWidth < 600) {
        this.swipeMode = 'mobile'
      } else {
        this.swipeMode = 'pc'
      }
    },
    cover(src) {
      return src ? this.$ossProcess(src, { h: 390 }) : ''
    },
    swipeChange(i) {
      this.swipeIndex = i
    },
    viewP(i, id) {
      // id > 0 因为可能id = -1   接口报错id会设置为-1
      if (i === this.swipeIndex && id > 0) {
        const { href } = this.$router.resolve({
          name: 'p-id',
          params: {
            id: id
          }
        })
        window.open(href, '_blank')
      }
    },
    viewPM(id) {
      this.$router.push({
        name: 'p-id',
        params: {
          id: id
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.swipe-wrapper {
  overflow: hidden;
  min-height: 477px;
}
@media screen and (max-width: 768px) {
  .swipe-wrapper {
    min-height: 200px;
  }
}
.swipe {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
  &-content {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    background-color: #f1f1f1;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    p {
      position: absolute;
      bottom: 40px;
      left: 50px;
      right: 40px;
      font-size: 26px;
      font-weight: bold;
      letter-spacing: 1px;
      color: #ffffff;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin: 0;
      z-index: 10;
      opacity: 0.5;
      padding: 0 0 0 15px;
      &::before {
        display: block;
        content: "";
        width: 5px;
        // height: 30px;
        background: #fff;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
    .full {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9;
    }
  }
}
.pc {
  margin: 20px 10px;
}
.mobile {
  margin: 10px 10px 0;
  // border-radius: 10px;
  box-sizing: border-box;
  /deep/ .van-swipe-item {
    box-sizing: border-box;
    .swip-container {
      overflow: hidden;
      background: #f1f1f1;
      border: 1px solid #f1f1f1;
      box-sizing: border-box;
      height: 170px;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      p {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 1);
        line-height: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        z-index: 10;
        margin: 0;
        padding: 0 0 0 8px;
        &::before {
          display: block;
          content: "";
          width: 2px;
          // height: 30px;
          background: #fff;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
        }
      }
      .full {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9;
        height: 60px;
        top: auto;
        background: linear-gradient(0, rgba(0, 0, 0, 0.5) 0, transparent 100%);
      }
    }
  }
  /deep/ .van-swipe__indicators {
    .van-swipe__indicator {
      background: #dbdbdb;
      opacity: 1;
    }
  }
}
</style>

<style lang="less">
.swipe {
  .el-carousel__item--card.is-active {
    // width: 760px;
    // transform: translateX(220px) scale(1) !important;
    .full {
      height: 120px;
      top: auto;
      background: linear-gradient(0, rgba(0, 0, 0, 0.5) 0, transparent 100%);
    }
    p {
      opacity: 1;
    }
  }
  .el-carousel__arrow {
    background: transparent;
    font-size: 32px;
  }

  .el-carousel__indicator {
    .el-carousel__button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    &.is-active {
      .el-carousel__button {
        background-color: #542de0;
      }
    }
  }

  .el-carousel__indicators {
    overflow: hidden;
  }
}
</style>


<style lang="less" scoped>
// 大于1200
@media screen and (min-width: 1200px) {
  .swipe /deep/ {
    .el-carousel__item--card.is-active {
      width: 760px;
      transform: translateX(210px) scale(1) !important;
    }
  }
}

// 小于768
@media screen and (max-width: 768px) {
  .swipe {
    .swipe-content p {
      bottom: 30px;
      left: 20px;
      right: 20px;
      font-size: 20px;
    }
  }
}
</style>