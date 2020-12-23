<template>
  <div class="album">
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
      <mastodonGif
        v-if="gifvs[0]"
        :src="gifvs[0]"
      />
      <el-image
        v-else
        :src="previewUrls[0]"
        alt="image"
        :preview-src-list="imgUrls"
        fit="cover"
        lazy
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
        <mastodonGif
          v-if="gifvs[0]"
          :src="gifvs[0]"
        />
        <el-image
          v-else
          :src="previewUrls[0]"
          alt="image"
          :preview-src-list="imgUrls"
          fit="cover"
          lazy
        />
      </div>
      <div class="album-two-column">
        <mastodonGif
          v-if="gifvs[1]"
          :src="gifvs[1]"
        />
        <el-image
          v-else
          :src="previewUrls[1]"
          alt="image"
          :preview-src-list="imgUrls"
          fit="cover"
          lazy
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
        <mastodonGif
          v-if="gifvs[0]"
          :src="gifvs[0]"
        />
        <el-image
          v-else
          :src="previewUrls[0]"
          alt="image"
          :preview-src-list="imgUrls"
          fit="cover"
          lazy
        />
      </div>
      <div class="album-three-column">
        <div class="album-three-column-line">
          <mastodonGif
            v-if="gifvs[1]"
            :src="gifvs[1]"
          />
          <el-image
            v-else
            :src="previewUrls[1]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
        <div class="album-three-column-line">
          <mastodonGif
            v-if="gifvs[2]"
            :src="gifvs[2]"
          />
          <el-image
            v-else
            :src="previewUrls[2]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
      </div>
    </div>
    <!-- 四张图片 -->
    <div
      v-else-if="previewUrls.length > 3"
      class="album-three"
      :class="locked && 'sensitive'"
      @click="openSensitiveShow"
    >
      <div class="album-three-column">
        <div class="album-three-column-line">
          <mastodonGif
            v-if="gifvs[0]"
            :src="gifvs[0]"
          />
          <el-image
            v-else
            :src="previewUrls[0]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
        <div class="album-three-column-line">
          <mastodonGif
            v-if="gifvs[2]"
            :src="gifvs[2]"
          />
          <el-image
            v-else
            :src="previewUrls[2]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
      </div>
      <div class="album-three-column">
        <div class="album-three-column-line">
          <mastodonGif
            v-if="gifvs[1]"
            :src="gifvs[1]"
          />
          <el-image
            v-else
            :src="previewUrls[1]"
            alt="image"
            :preview-src-list="imgUrls"
            fit="cover"
            lazy
          />
        </div>
        <div class="album-three-column-line">
          <mastodonGif
            v-if="gifvs[3]"
            :src="gifvs[3]"
          />
          <el-image
            v-else
            :src="previewUrls[3]"
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
import mastodonGif from './mastodon_gif'

export default {
  components: {
    mastodonGif
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
    }
  },
  data () {
    return {
      showSensitive: false
    }
  },
  computed: {
    imgUrls () {
      try {
        if (this.locked) return null
        return this.media.map(item => item.type === 'image' ? item.url : '').filter(item => item)
      } catch (e) {
        console.error('[Unable to display picture]:', e)
        return []
      }
    },
    previewUrls () {
      try {
        return this.media.map(item => item.preview_url)
      } catch (e) {
        console.error('[Unable to display picture]:', e)
        return []
      }
    },
    gifvs () {
      try {
        return this.media.map(item => item.type === 'gifv' ? item.url : '')
      }
      catch (e) {
        console.error('[Unable to display picture]:', e)
        return []
      }
    },
    locked () {
      return this.sensitive && !this.showSensitive
    }
  },
  mounted () {
    console.log('图片TYPE:', this.media[0].type)
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
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.album {
  border: 1px solid #ccd6dd;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;

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