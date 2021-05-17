<template>
  <div class="swipe-wrapper">
    <div
      ref="swipe"
      class="swipe"
    >
      <el-carousel
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
          <ItemPc
            :item="item"
            :index="index"
            @handleClick="e => viewP(e.index, e.id)"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <van-swipe
      :autoplay="30000"
      indicator-color="#542DE0"
      :height="200"
      class="mobile"
    >
      <van-swipe-item
        v-for="(item, index) in card"
        :key="index"
      >
        <ItemMobile
          :item="item"
          :index="index"
          @handleClick="e => viewPM(e.id)"
        />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import ItemPc from './item_pc.vue'
import ItemMobile from './item_mobile.vue'

export default {
  name: 'ArticleSwipe',
  components: {
    ItemPc,
    ItemMobile
  },
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
      return src ? this.$ossProcess(src, { h: 390 }) : this.$ossProcess('/material/default_cover_v1.png', { h: 390 })
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
  @media screen and (max-width: 768px) {
    min-height: 200px;
  }
}
.swipe {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
}
.pc {
  margin: 20px 10px;
  @media screen and (max-width: 768px) {
    display: none;
  }
}
.mobile {
  display: none;
  margin: 10px 10px 0;
  // border-radius: 10px;
  box-sizing: border-box;
  /deep/ .van-swipe-item {
    box-sizing: border-box;
  }
  /deep/ .van-swipe__indicators {
    .van-swipe__indicator {
      background: #dbdbdb;
      opacity: 1;
    }
  }
  @media screen and (max-width: 768px) {
    display: block !important;
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
</style>