<template>
  <div class="album-frame">
    <div class="album-frame-pillar" />
    <div class="album" :class="albumClass">
      <div v-if="locked" class="album-sensitivetab" @click="openSensitiveShow">
        敏感内容
      </div>
      <!-- 单张图片 -->
      <div
        v-if="previewUrls.length === 1"
        class="album-one"
        :class="locked && 'sensitive'"
        @click="openSensitiveShow"
      >
        <div v-if="isGif(0)" class="gif-label">
          GIF
        </div>
        <el-image
          :src="previewUrls[0]"
          alt="image"
          :preview-src-list="getImgList(0)"
          fit="cover"
          lazy
          @mouseenter="playGif(0)"
          @mouseout="stopGif(0)"
        />
      </div>
      <!-- 两张图片 -->
      <div
        v-else-if="previewUrls.length === 2"
        class="album-two"
        :class="locked && 'sensitive'"
        @click="openSensitiveShow"
      >
        <div class="album-two-column">
          <div v-if="isGif(0)" class="gif-label">
            GIF
          </div>
          <el-image
            :src="previewUrls[0]"
            alt="image"
            :preview-src-list="getImgList(0)"
            fit="cover"
            lazy
            @mouseenter="playGif(0)"
            @mouseout="stopGif(0)"
          />
        </div>
        <div class="album-two-column">
          <div v-if="isGif(1)" class="gif-label">
            GIF
          </div>
          <el-image
            :src="previewUrls[1]"
            alt="image"
            :preview-src-list="getImgList(1)"
            fit="cover"
            lazy
            @mouseenter="playGif(1)"
            @mouseout="stopGif(1)"
          />
        </div>
      </div>
      <!-- 三张图片 -->
      <div
        v-else-if="previewUrls.length === 3"
        class="album-three"
        :class="locked && 'sensitive'"
        @click="openSensitiveShow"
      >
        <div class="album-three-column">
          <div v-if="isGif(0)" class="gif-label">
            GIF
          </div>
          <el-image
            :src="previewUrls[0]"
            alt="image"
            :preview-src-list="getImgList(0)"
            fit="cover"
            lazy
            @mouseenter="playGif(0)"
            @mouseout="stopGif(0)"
          />
        </div>
        <div class="album-three-column">
          <div class="album-three-column-line">
            <div v-if="isGif(1)" class="gif-label">
              GIF
            </div>
            <el-image
              :src="previewUrls[1]"
              alt="image"
              :preview-src-list="getImgList(1)"
              fit="cover"
              lazy
              @mouseenter="playGif(1)"
              @mouseout="stopGif(1)"
            />
          </div>
          <div class="album-three-column-line">
            <div v-if="isGif(2)" class="gif-label">
              GIF
            </div>
            <el-image
              :src="previewUrls[2]"
              alt="image"
              :preview-src-list="getImgList(2)"
              fit="cover"
              lazy
              @mouseenter="playGif(2)"
              @mouseout="stopGif(2)"
            />
          </div>
        </div>
      </div>
      <!-- 四张图片 -->
      <div
        v-else-if="previewUrls.length === 4"
        class="album-three"
        :class="locked && 'sensitive'"
        @click="openSensitiveShow"
      >
        <div class="album-three-column">
          <div class="album-three-column-line">
            <div v-if="isGif(0)" class="gif-label">
              GIF
            </div>
            <el-image
              :src="previewUrls[0]"
              alt="image"
              :preview-src-list="getImgList(0)"
              fit="cover"
              lazy
              @mouseenter="playGif(0)"
              @mouseout="stopGif(0)"
            />
          </div>
          <div class="album-three-column-line">
            <div v-if="isGif(2)" class="gif-label">
              GIF
            </div>
            <el-image
              :src="previewUrls[2]"
              alt="image"
              :preview-src-list="getImgList(2)"
              fit="cover"
              lazy
              @mouseenter="playGif(2)"
              @mouseout="stopGif(2)"
            />
          </div>
        </div>
        <div class="album-three-column">
          <div class="album-three-column-line">
            <div v-if="isGif(1)" class="gif-label">
              GIF
            </div>
            <el-image
              :src="previewUrls[1]"
              alt="image"
              :preview-src-list="getImgList(1)"
              fit="cover"
              lazy
              @mouseenter="playGif(1)"
              @mouseout="stopGif(1)"
            />
          </div>
          <div class="album-three-column-line">
            <div v-if="isGif(3)" class="gif-label">
              GIF
            </div>
            <el-image
              :src="previewUrls[3]"
              alt="image"
              :preview-src-list="getImgList(3)"
              fit="cover"
              lazy
              @mouseenter="playGif(3)"
              @mouseout="stopGif(3)"
            />
          </div>
        </div>
      </div>

      <!-- 五到九张图片 -->
      <div
        v-else-if="previewUrls.length > 4"
        class="album-nine"
        :class="locked && 'sensitive'"
        @click="openSensitiveShow"
      >
        <div v-for="(item, index) of previewUrls" :key="index" class="album-nine-column">
          <div v-if="isGif(index)" class="gif-label">
            GIF
          </div>
          <el-image
            :src="item"
            alt="image"
            :preview-src-list="getImgList(index)"
            fit="cover"
            lazy
            @mouseenter="playGif(index)"
            @mouseout="stopGif(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    // 卡片数据
    media: {
      type: Array,
      required: true
    },
    sensitive: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      showSensitive: false,
      gifSize: 320,
      mediaPlays: [],
    }
  },
  computed: {
    imgUrls () {
      try {
        if (this.locked) return null
        return this.media.map(item => this.$ossProcess(item.url))
      } catch (e) {
        console.error('[Unable to display picture]:', e)
        return []
      }
    },
    previewUrls () {
      try {
        return this.media.map((item, index) => {
          let xOssProcess = '?x-oss-process=image/resize,l_680,m_mfit/format,jpg'
          if (item.type === 'image/gif' && this.mediaPlays[index])
            xOssProcess = '?x-oss-process=image/resize,l_680,m_mfit'

          return this.$API.getImg(item.url) + xOssProcess
        })
      } catch (e) {
        console.error('[Unable to display picture]:', e)
        return []
      }
    },
    locked () {
      return this.sensitive && !this.showSensitive
    },
    albumClass () {
      return {
        'album-frameless': this.previewUrls.length > 4,
        'album-six': this.previewUrls.length === 5 || this.previewUrls.length === 6
      }
    }
  },
  methods: {
    openSensitiveShow () {
      if (!this.sensitive) return
      this.showSensitive = true
    },
    isGif(index) {
      return { ...this.media[index] }.type === 'image/gif'
    },
    playGif(index) {
      if (this.media[index].type !== 'image/gif') return
      this.$set(this.mediaPlays, index, true)
    },
    stopGif(index) {
      if (this.media[index].type !== 'image/gif') return
      this.$set(this.mediaPlays, index, false)
    },
    getImgList(index) {
      const imgs = [...this.imgUrls]
      imgs.push(...imgs.splice(0, index))
      return imgs
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
.gif-label {
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
  z-index: 1;
}

.album-frame {
  position: relative;
  margin-top: 10px;
  width: 100%;

  &-pillar {
    padding-bottom: 56.25%;
  }
}

.album {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid #ccd6dd;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;

  &.album-frameless {
    border: none;
    background: none;
    border-radius: 0;
  }

  &.album-six {
    margin-bottom: -28.3%;
  }

  .sensitive-filter {
    &.sensitive {
      filter: blur(50px);
      cursor: pointer;
    }
  }

  &-sensitivetab {
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

  &-one {
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    .sensitive-filter();

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
    .sensitive-filter();

    .el-image {
      width: 100%;
      height: 100%;
    }
    &-column {
      position: relative;
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
    .sensitive-filter();

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
        position: relative;
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

  &-nine {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .sensitive-filter();

    .el-image {
      width: 100%;
      height: 100%;
    }
    &-column {
      height: calc(33.3% - 1.33px);
      width: calc(33.3% - 1.33px);
      min-width: calc(33.3% - 1.33px);
      min-height: calc(33.3% - 1.33px);
      display: flex;
      flex-direction: column;
      position: relative;
      margin: 0 2px 2px 0;
      border: 1px solid #ccd6dd;
      box-sizing: border-box;
      background: #f1f1f1;
      border-radius: 10px;
      overflow: hidden;

      &:nth-child(3n+0) {
        margin-right: 0;
      }
    }

  }
}
</style>