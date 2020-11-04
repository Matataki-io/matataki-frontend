<template>
  <div class="album">
    <!-- 单张图片 -->
    <div v-if="imgUrls.length === 1" class="album-one">
      <el-image
        :src="imgUrls[0]"
        alt="image"
        :preview-src-list="imgUrls"
        fit="cover"
        lazy
      />
    </div>
    <!-- 两张图片 -->
    <div v-else-if="imgUrls.length === 2" class="album-two">
      <div class="album-two-column">
        <el-image
          :src="imgUrls[0]"
          alt="image"
          :preview-src-list="imgUrls"
          fit="cover"
          lazy
        />
      </div>
      <div class="album-two-column">
        <el-image
          :src="imgUrls[1]"
          alt="image"
          :preview-src-list="imgUrls"
          fit="cover"
          lazy
        />
      </div>
    </div>
    <!-- 三张图片 -->
    <div v-else-if="imgUrls.length === 3" class="album-three">
      <div class="album-three-column">
        <el-image
          :src="imgUrls[0]"
          alt="image"
          :preview-src-list="imgUrls"
          fit="cover"
          lazy
        />
      </div>
      <div class="album-three-column">
        <div class="album-three-column-line">
          <el-image
            :src="imgUrls[1]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
        <div class="album-three-column-line">
          <el-image
            :src="imgUrls[2]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
      </div>
    </div>
    <!-- 四张图片 -->
    <div v-else-if="imgUrls.length > 3" class="album-three">
      <div class="album-three-column">
        <div class="album-three-column-line">
          <el-image
            :src="imgUrls[0]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
        <div class="album-three-column-line">
          <el-image
            :src="imgUrls[2]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
      </div>
      <div class="album-three-column">
        <div class="album-three-column-line">
          <el-image
            :src="imgUrls[1]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
        <div class="album-three-column-line">
          <el-image
            :src="imgUrls[3]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    // 卡片数据
    media: {
      type: Array,
      required: true
    }
  },
  computed: {
    imgUrls () {
      return this.media
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
    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  &-two {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    .el-image {
      width: 100%;
      height: 100%;
    }
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
    .el-image {
      width: 100%;
      height: 100%;
    }
    &-column {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      &-line {
        height: 50%;
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