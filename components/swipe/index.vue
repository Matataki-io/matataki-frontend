<template>
  <div ref="swipe" class="swipe">
    <el-carousel :interval="3000" @change="swipeChange" type="card" height="390px" arrow="always">
      <el-carousel-item v-for="(item, index) in card" :key="index">
        <div @click="viewP(index, item.id)" class="swipe-content">
          <img v-if="item.cover" :src="cover(item.cover)" :alt="item.title">
          <p>{{ item.title }}</p>
          <!-- <div class="full" /> -->
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { recommend } from '@/api/async_data_api.js'

export default {
  props: {
    card: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      swipeIndex: 0
    }
  },
  methods: {
    cover(src) {
      return src ? this.$API.getImg(src) : ''
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
    }
  }
}
</script>

<style lang="less" scoped>
.swipe {
  width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
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
        bottom: 20px;
        left: 20px;
        right: 20px;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 1px;
        color: #ffffff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0;
        margin: 0;
      }
      // .full {
      //   position: absolute;
      //   top: 0;
      //   right: 0;
      //   bottom: 0;
      //   left: 0;
      //   background-color: rgba(0, 0, 0, 0.1);
      // }
  }
}
</style>

<style lang="less">
  .swipe {
    .el-carousel__item--card.is-active {
      width: 760px;
      transform: translateX(220px) scale(1) !important;
    }
    .el-carousel__arrow {
      background: transparent;
    }

    .el-carousel__indicator {
      .el-carousel__button {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      &.is-active {
        .el-carousel__button {
          background-color: #542DE0;
        }
      }
    }

    .el-carousel__indicators {
      overflow: hidden;
    }
  }
</style>
