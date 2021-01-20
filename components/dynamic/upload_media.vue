<template>
  <el-popover
    v-model="visible"
    placement="bottom-start"
    width="245"
    trigger="manual"
  >
    <!-- Button -->
    <template slot="reference">
      <span class="upload-media-button" :class="!visible && 'media-button-active'" @click="showPopover">
        <i class="el-icon-picture-outline" />
      </span>
    </template>

    <!-- 内容 -->
    <div class="upload-main">
      <div class="upload-main-topbar">
        <h3 class="upload-main-topbar-title">
          上传图片
          <span>
            {{ mediaList.length }}/9
          </span>
        </h3>
        <div class="upload-main-topbar-close" @click="closePopup">
          <svg-icon icon-class="close" />
        </div>
      </div>
      <div class="upload-main-list">
        <!-- 图片列表 -->
        <div v-for="(media, index) in mediaList" :key="index" class="upload-main-list-unit">
          <img :src="media.localPreviewUrl">
          <div v-if="media.uploading" class="upload-main-list-unit-uploading">
            <i class="el-icon-loading" />
          </div>
          <div v-else class="upload-main-list-unit-control" @click="deleteMedia(index)">
            <i class="el-icon-delete" />
          </div>
        </div>
        <!-- 上传图片 -->
        <FileUpload
          v-if="isShowFileUpload && mediaList.length < 9"
          ref="upload"
          v-model="files"
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          class="upload-main-list-fileupload"
          @input-file="inputFile"
          @input-filter="inputFilter"
        >
          <div class="upload-main-list-fileupload-add">
            <i class="el-icon-plus" />
          </div>
        </FileUpload>
      </div>
    </div>
  </el-popover>
</template>

<script>
import VueUploadComponent from 'vue-upload-component'
import Compressor from 'compressorjs'
import { ifpsUpload } from '@/api/ipfs'

export default {
  components: {
    FileUpload: VueUploadComponent
  },
  props: {
    // 显示上传图片大小 单位 M
    imgSize: {
      type: Number,
      default: 5
    },
    value: {
      type: Array,
      default: () => []
    },
    visibleState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // popover
      visible: false,
      // upload
      isShowFileUpload: false,
      files: [], // 文件数据
      postAction: ifpsUpload, // 上传地址
      quality: 0.8, // 压缩品质
      updateType: 'artileCover', // 上传类型
      mediaList: [],
      maxIndex: 0,
    }
  },
  computed: {
    isUploading() {
      return !!this.mediaList.find(item => item.uploading)
    }
  },
  watch: {
    isUploading(value) {
      console.log('uploading:', value)
      this.$emit('uploading', value)
    },
    visibleState(value) {
      if (value !== this.visible) {
        this.visible = value
        // 如果是关闭状态，需要对 mediaList 进行清空
        if (!value) {
          this.mediaList = []
          this.$emit('input', [])
        }
      }
    }
  },
  mounted() {
    this.isShowFileUpload = true
  },
  methods: {
    /**
     * Pretreatment // 过滤操作可以写在这里
     * @param  Object|undefined   newFile   读写
     * @param  Object|undefined   oldFile   只读
     * @param  Function           prevent   阻止回调
     * @return undefined
     */
    // eslint-disable-next-line consistent-return
    async inputFilter(newFile, oldFile, prevent) {
      if (this.mediaList.length >= 9) {
        this.$message.error({
          duration: 1000,
          message: '最多只能上传九张图片'
        })
        return prevent()
      }
      if (newFile && !oldFile) {
        // 过滤不是图片后缀的文件
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.$message.error({
            duration: 1000,
            message: this.$t('imgUpload.selectImg')
          })
          return prevent()
        }
      }
      const maxSizeResult = this.maxSize(newFile.file, 10)
      if (!maxSizeResult) return true
      let cFile = newFile.file

      // 原图压缩
      if (newFile.file.type !== 'image/gif') {
        cFile = await this.compressorFunc(newFile.file)
      }

      // 失败情况情况检查
      if (!this.visible) return prevent()
      if (this.mediaList.length >= 9) return prevent()
      if (!cFile) {
        console.error('图片压缩失败')
        return prevent()
      }
      if (!this.maxSize(cFile, this.imgSize)) {
        console.error('图片大小超出限制')
        return prevent()
      }
      console.log('newFile:', cFile)

      // 创建图片的本地预览 url，用于列表中展示图片
      const URL = window.URL || window.webkitURL
      let localPreviewUrl = ''
      if (URL && URL.createObjectURL) {
        localPreviewUrl = URL.createObjectURL(cFile)
      }

      // 获取唯一索引用于在列表中定位，创建媒体对象并加入列表
      const mediaIndex = this.addIndexAndReturn()
      const mediaObj = {
        id: mediaIndex,
        file: cFile,
        localPreviewUrl,
        type: cFile.type,
        url: '',
        uploading: true
      }
      this.mediaList.push(mediaObj)

      // 上传
      const imgUrl = await this.uploadFile(mediaObj.file)
      // 如果失败了
      if (!imgUrl) {
        this.mediaList.splice(this.mediaList.findIndex(item => item.id === mediaIndex) ,1)
        return prevent()
      }
      // 检查是否在上传期间被取消
      if (!this.mediaList.find(item => item.id === mediaIndex)) return prevent()

      console.log('全部上传完成', { imgUrl })
      mediaObj.uploading = false
      mediaObj.url = imgUrl
      this.$emit('input', this.mediaList)
    },

    // 限定最大字节
    maxSize(file, size) {
      console.log('检测字节数:', size, (file.size / 1024 / 1024).toFixed(4))
      if (file.size >= 0 && file.size > 1024 * 1024 * size) {
        console.log('超过字节数')
        this.$message.error({
          duration: 1000,
          message: this.$t('imgUpload.imgVeryBIg')
        })
        return false
      }
      return true
    },

    // 压缩方法
    compressorFunc(file, crop) {
      return new Promise((resolve) => {
        const thumbnailConfig = crop ? {
          maxHeight: 680,
          maxWidth: 680,
        } : {}
        new Compressor(file, {
          ...thumbnailConfig,
          quality: this.quality,
          strict: true,
          convertSize: 1024 * 1024 * this.imgSize,
          success: (newfile) => {
            const file = new File([newfile], newfile.name, {type: newfile.type, lastModified: Date.now()})
            resolve(file)
          },
          error: (err) => {
            console.log(err)
            this.$message.error({
              duration: 1000,
              message: this.$t('imgUpload.autoCompressionFail')
            })
            resolve(null)
          }
        })
      })
    },
    // 上传图片
    async uploadFile(file) {
      console.log('上传图片时的尺寸:', (file.size / 1024 / 1024).toFixed(4))
      try {
        const res = await this.$API.uploadImage(this.updateType, file)
        if (res.code === 0 && res.data && res.data.cover) {
          console.log('上传成功！', this.updateType, res)
          return res.data.cover
        } else {
          console.error('图片上传失，result:', res)
          this.$message.error({
            duration: 1000,
            message: this.$t('imgUpload.uploadImgFail')
          })
          return null
        }

        // console.log(file)
      } catch (error) {
        // 捕获错误 未登陆提示
        console.log(error)
        if (error.toString().includes('code 401')) {
          this.$message({
            showClose: true,
            duration: 1000,
            message: this.$t('error.pleaseLogin')
          })
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            message: this.$t('imgUpload.uploadImgFail')
          })
        }
        return null
      }
    },
    /**
     * Has changed // 上传完的操作写在这里
     * @param  Object|undefined   newFile   只读
     * @param  Object|undefined   oldFile   只读
     * @return undefined
     */
    // eslint-disable-next-line no-unused-vars
    async inputFile(newFile, oldFile, prevent) {
      // if (newFile && !oldFile) {
      //   //
      // }
      // if (!newFile && oldFile) {
      //   //
      // }
    },
    addIndexAndReturn() {
      this.maxIndex++
      return this.maxIndex
    },
    deleteMedia(index) {
      this.mediaList.splice(this.mediaList.findIndex(item => item.id === index) ,1)
      this.$emit('input', this.mediaList)
    },
    showPopover() {
      this.visible = true
      this.$emit('update:visible-state', true)
    },
    closePopup() {
      this.visible = false
      this.$emit('update:visible-state', false)
      this.mediaList = []
      this.$emit('input', [])
    }
  }
}
</script>

<style lang="less" scoped>
.upload-media-button {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 20px;
  border-radius: 5px;
  outline: inherit;
  background: #00000000;

  &.media-button-active {
    color: #b2b2b2;
    cursor: pointer;
    &:hover {
      background: #00000010;
      color: black;
    }
  }
}

.upload-main {
  &-topbar {
    display: flex;
    align-items: center;
    margin: 0 0 10px;

    &-title {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin: 0;
      flex: 1;

      span {
        margin: 0 0 0 5px;
        font-size: 12px;
        font-weight: 400;
        color: #B2B2B2;
        line-height: 17px;
      }
    }

    &-close {
      width: 25px;
      height: 25px;
      font-size: 14px;
      color: #b2b2b2;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &:hover {
        color: #ff8080;
        background: #00000010;
      }
    }
  }

  &-list {
    display: flex;
    flex-wrap: wrap;

    &-unit {
      position: relative;
      width: 75px;
      height: 75px;
      color: #b2b2b2;
      border: 1px solid #ccd6dd;
      background: #542DE0;
      border-radius: 5px;
      box-sizing: border-box;
      margin: 0 10px 10px 0;
      overflow: hidden;
      &:nth-child(3n+0) {
        margin: 0;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &-uploading {
        position: absolute;
        background: #00000096;
        color: white;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
      }

      &-control {
        display: none;
        position: absolute;
        background: #000000b0;
        color: #ff5050;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
        justify-content: center;
        align-items: center;
        font-size: 35px;
        cursor: pointer;
      }

      &:hover .upload-main-list-unit-control {
        display: flex;
      }
    }

    &-fileupload {

      &-add {
        width: 75px;
        height: 75px;
        color: #b2b2b2;
        border: 4px dashed #b2b2b2;
        border-radius: 5px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        box-sizing: border-box;
        cursor: pointer;
      }

      &:hover .upload-main-list-fileupload-add {
        color: #542DE0;
        border-color: #542DE0;
      }
    }
  }
}
</style>
