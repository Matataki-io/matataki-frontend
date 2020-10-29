<template>
  <div class="album">
    <!-- 单张图片 -->
    <div v-if="imgUrls.length === 1" class="album-one">
      <img :src="imgUrls[0]" alt="image">
    </div>
    <!-- 两张图片 -->
    <div v-else-if="imgUrls.length === 2" class="album-two">
      <div class="album-two-column">
        <img :src="imgUrls[0]" alt="image">
      </div>
      <div class="album-two-column">
        <img :src="imgUrls[1]" alt="image">
      </div>
    </div>
    <!-- 三张图片 -->
    <div v-else-if="imgUrls.length === 3" class="album-three">
      <div class="album-three-column">
        <img :src="imgUrls[0]" alt="image">
      </div>
      <div class="album-three-column">
        <div class="album-three-column-line">
          <img :src="imgUrls[2]" alt="image">
        </div>
        <div class="album-three-column-line">
          <img :src="imgUrls[2]" alt="image">
        </div>
      </div>
    </div>
    <!-- 四张图片 -->
    <div v-else-if="imgUrls.length > 3" class="album-three">
      <div class="album-three-column">
        <div class="album-three-column-line">
          <img :src="imgUrls[0]" alt="image">
        </div>
        <div class="album-three-column-line">
          <img :src="imgUrls[2]" alt="image">
        </div>
      </div>
      <div class="album-three-column">
        <div class="album-three-column-line">
          <img :src="imgUrls[1]" alt="image">
        </div>
        <div class="album-three-column-line">
          <img :src="imgUrls[3]" alt="image">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    // 卡片数据
    imgs: {
      type: Array,
      required: true
    },
    length: {
      type: Number,
      default: 1,
    }
  },
  computed: {
    imgUrls () {
      const img = 'https://picsum.photos/1280/720?random'
      return [ ...Array(this.length) ].map(() => img)
    }
  }
}
</script>

<style lang="less" scoped>
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.album {
  border: 1px solid #ccd6dd;
  background: #f1f1f1;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;

  &-one {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  &-two {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    &-column {
      height: 100%;
      flex: 1;

      &:nth-child(1) {
        margin-right: 2px;
      }
    }

  }

  &-three {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    &-column {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      &-line {
        height: 100%;
        flex: 1;

        &:nth-child(1) {
          margin-bottom: 2px;
        }
      }

      &:nth-child(1) {
        margin-right: 2px;
      }
    }

  }
}
</style>