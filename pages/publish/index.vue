<template>
  <div class="new-post" @click.stop="transferButton = false">
    <div class="edit-content">
      <div class="edit-head">
        <input
          v-model="title"
          class="edit-title"
          placeholder="请输入文章标题..."
          size="large"
          clearable
        >
        <el-button class="import-button" @click="importVisible = true">
          <svg-icon class="import-icon" icon-class="import" />
          导入文章
        </el-button>

        <el-dropdown trigger="click" @command="postArticle">
          <el-button type="primary" icon="el-icon-s-promotion">
            发布
          </el-button>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item command="public">
              公开发布
            </el-dropdown-item>
            <el-dropdown-item v-if="editorMode !== 'edit'" command="draft">
              保存到草稿箱
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown v-if="isShowTransfer" slot="more" trigger="click" @command="handleMoreAction">
          <div class="more-icon">
            <svg-icon class="icon" icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item command="transfer">
              转让
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <no-ssr>
        <mavon-editor
          ref="md"
          v-model="markdownData"
          class="editor"
          :toolbars="toolbars"
          :box-shadow="false"
          :autofocus="false"
          :style="mavonStyle"
          placeholder="请输入 Markdown 格式的文字开始编辑"
          @imgAdd="$imgAdd"
        />
      </no-ssr>
      <div v-if="editorMode !== 'edit'" class="fission">
        <p>
          裂变系数
          <el-tooltip
            class="item"
            effect="light"
            content="决定每名投资者的收益上限 = 投资金额 * 裂变系数 裂变系数越大投资者的收益预期越高"
            placement="top-start"
          >
            <span class="question">?</span>
          </el-tooltip>
        </p>
        <div v-if="editorMode !== 'edit'" class="fission-num-slider">
          <el-slider
            v-model="fissionNum"
            class="fission-num-slider2"
            :min="1"
            :max="2"
            :step="0.1"
          />
        </div>
        <div class="fission-num-Input">
          {{ fissionNum }}
        </div>
      </div>
      <div class="cover-container">
        <div v-show="cover">
          <img class="cover-img" :src="coverEditor" alt="cover">
        </div>
        <div class="cover">
          <p>图文封面 <span class="cover-tip">请上传宽高2:1尺寸的图片</span></p>
          <img-upload
            v-show="!cover"
            :img-upload-done="imgUploadDone"
            :aspect-ratio="2 / 1"
            class="cover-upload"
            :update-type="'artileCover'"
            @doneImageUpload="doneImageUpload"
          >
            <img slot="uploadButton" class="cover-add" src="@/assets/img/add.svg" alt="add">
          </img-upload>
          <img
            v-show="cover"
            class="cover-btn"
            src="@/assets/img/del.svg"
            alt="remove"
            @click.prevent="removeCover"
          >
        </div>
      </div>
    </div>
    <div class="cover-container">
      <el-checkbox v-model="isOriginal" class="is-original" @change="originalChange">
        我声明此文章为原创
      </el-checkbox>
    </div>
    <div class="tag">
      <p>选择标签</p>
      <div class="tag-content">
        <tag-card
          v-for="(item, index) in tagCards"
          :key="index"
          :tag-card="item"
          @toggleTagStatus="toggleTagStatus"
        />
      </div>
    </div>
    <article-transfer
      v-if="isShowTransfer"
      v-model="transferModal"
      :article-id="$route.params.id"
      :from="$route.query.from"
      @toggleDone="allowLeave = true"
    />
    <articleImport :visible="importVisible" @close="importVisible = false" @importArticle="importArticle" />
    <statement :visible="statementVisible" @close="closeStatement" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
import { toolbars } from '@/config/toolbars' // 编辑器配置
import defaultImagesUploader from '@/api/imagesUploader'
import { sendPost } from '@/api/ipfs'
import { strTrim } from '@/utils/reg'

import imgUpload from '@/components/imgUpload' // 图片上传
import tagCard from '@/components/tag_card'
import articleTransfer from '@/components/articleTransfer'

import articleImport from '@/components/article_import/index.vue'
import statement from '@/components/statement/index.vue'

export default {
  name: 'NewPost',
  components: {
    imgUpload,
    tagCard,
    articleTransfer,
    articleImport,
    statement
  },
  data: () => ({
    prompt: false,
    title: '',
    author: '',
    markdownData: '',
    fissionFactor: 2000,
    toolbars: {},
    screenWidth: 1000,
    mavonStyle: {
      minHeight: `800px`
    },
    fissionNum: 2,
    cover: '',
    signature: '',
    signId: '',
    id: '',
    editorMode: 'create', // 默认是创建文章
    saveType: 'public', // 发布文章模式， 公开 || 草稿
    isOriginal: false, // 是否原创
    imgUploadDone: 0,
    showModal: false, // 弹框显示
    modalText: {
      text: ['文章尚未保存，是否退出？'], // 退出
      button: ['再想想', '退出']
    },
    modalMode: null, // header 判断点击的 back 还是 home
    tagCards: [], // 文章标签
    articleData: {}, // 文章数据
    transferButton: false, // 转让按钮
    transferModal: false, // 转让弹框
    allowLeave: false, // 允许离开
    saveInfo: {},
    importVisible: false, // 导入
    statementVisible: false // 原创声明
  }),
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    isShowEditorMode() {
      // 创建和草稿的时候是否可以显示编辑器模式（单选按钮显示
      return !!(this.editorMode === 'create' || this.editorMode === 'draft')
    },
    editorText() {
      let text = '文章'
      if (this.editorMode === 'create') {
        // 发布文章
        text = '文章发布'
      }
      if (this.editorMode === 'edit') {
        // 编辑文章
        text = '编辑文章'
      } else if (this.editorMode === 'draft') {
        // 草稿箱
        text = '编辑草稿'
      }
      return text
    },
    sendBtnText() {
      let text = '发布'
      if (this.editorMode === 'create') {
        // 发布文章
        text = '发布'
      }
      if (this.editorMode === 'edit') {
        // 编辑文章
        text = '修改'
      } else if (this.editorMode === 'draft' && this.saveType === 'public') {
        // 草稿箱  发布
        text = '发布'
      } else if (this.editorMode === 'draft' && this.saveType === 'draft') {
        // 草稿箱 修改
        text = '修改'
      }
      return text
    },
    coverEditor() {
      return this.$backendAPI.getAvatarImage(this.cover)
    },
    isShowTransfer() {
      return this.$route.query.from === 'draft'
    }
  },
  watch: {
    screenWidth(val) {
      this.setToolBar(val)
    },
    mavonStyle(newVal) {
      console.log(newVal)

      this.mavonStyle = newVal
    },
    fissionNum() {
      this.fissionFactor = this.fissionNum * 1000
    }
  },
  created() {
    const { id } = this.$route.params
    const { from, hash } = this.$route.query
    // console.log(id, from);
    if (id === 'create' && !from) {
      // 发布文章 from 为 undefined
      // console.log('发布文章');
    } else if (from === 'edit') {
      // 编辑文章
      this.editorMode = from
      this.setArticleDataById(hash, id)
    } else if (from === 'draft') {
      // 草稿箱
      this.editorMode = from
      this.saveType = 'draft'
      this.getDraft(id)
    } else {
      this.editorMode = 'create' // 当作发布文章处理
    }

    this.getTags()
  },
  beforeRouteLeave(to, from, next) {
    if (this.changed()) return next()
    if (window.confirm('文章尚未保存，是否确认退出？')) {
      next()
    } else {
      next(false)
    }
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.unload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.unload)
  },
  mounted() {
    this.resize()
    this.setToolBar(this.screenWidth)
  },

  methods: {
    ...mapActions(['getSignatureOfArticle']),
    handleMoreAction(command) {
      this[command]()
    },
    transfer() {
      this.transferModal = true
    },
    postArticle(saveType) {
      console.log(saveType)
      this.saveType = saveType
      this.sendThePost()
    },
    unload($event) {
      // 刷新页面 关闭页面有提示
      // https://jsfiddle.net/jbf4vL7h/29/
      const confirmationMessage = 'o/'
      $event.returnValue = confirmationMessage // Gecko, Trident, Chrome 34+
      return confirmationMessage // Gecko, WebKit, Chrome <34
    },
    changed() {
      // 如果允许关闭 或者 内容都为空
      return this.allowLeave || (!strTrim(this.title) && !strTrim(this.markdownData))
    },
    popstateFunc() {
      // Your logic
      alert('pushState')
    },
    setTag(data) {
      console.log(data)
      this.articleData = data // 设置文章数据
      // 编辑的时候设置tag状态
      const { from } = this.$route.query
      if ((from && from === 'edit') || from === 'draft') this.setTagStatus()
    },
    // 通过ID拿数据
    async setArticleDataById(hash, id) {
      const articleData = await this.$backendAPI.getArticleDatafromIPFS(hash)
      try {
        // 获取文章信息
        const { data } = await this.$backendAPI.getMyPost(id)
        if (data.code === 0) {
          this.fissionNum = data.data.fission_factor / 1000
          this.signature = data.data.sign
          this.cover = data.data.cover
          this.signId = data.data.id
          this.isOriginal = Boolean(data.data.is_original)

          this.setTag(data.data)
        } else {
          this.$message.success(data.message)
          this.$router.push({ path: '/' })
        }
      } catch (error) {
        console.error(error)
        this.$message.error('获取文章信息发生错误')
        this.$router.push({ path: '/' })
      }
      // 设置文章内容
      const { data } = articleData.data
      this.title = data.title
      this.markdownData = data.content
    },
    // 得到草稿箱内容 by id
    async getDraft(id) {
      const { data } = await this.$backendAPI.getDraft({ id })
      this.fissionNum = data.fission_factor ? data.fission_factor / 1000 : 2
      this.cover = data.cover
      this.title = data.title
      this.markdownData = data.content
      this.id = id
      this.isOriginal = Boolean(data.is_original)

      this.setTag(data)
    },
    // 错误提示
    failed(error) {
      console.error('发送失败', error)
      this.$message.error(error)
    },
    // 跳转页面
    jumpToArticle(hash) {
      this.$router.push({ path: `/p/${hash}` })
    },
    // 成功提示
    success(hash, msg = '发送成功,自动跳转到你发表的文章') {
      this.$message.success(msg)
      this.jumpToArticle(hash)
    },
    // 发送文章到ipfs
    async sendPost({ title, author, content }) {
      const data = await this.$API.sendPost({
        title,
        author,
        content,
        desc: 'whatever'
      })
      // console.log(data)
      if (data.code !== 0) this.failed('文章发布ipfs失败')
      return data
    },
    // 文章标签 tag
    setArticleTag(tagCards) {
      let tags = ''
      const tagCardsFilter = tagCards.filter(i => i.status === true)
      if (tagCardsFilter.length !== 0) {
        tagCardsFilter.map((i, index) => {
          if (index === 0) tags += i.id
          else tags += `,${i.id}`
        })
      }
      return tags
    },
    // 发布文章
    async publishArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      const { failed, success } = this
      try {
        const { author, hash } = article
        let signature = null
        if (!this.$publishMethods.invalidId(this.currentUserInfo.idProvider)) {
          signature = await this.getSignatureOfArticle({ author, hash })
        }
        const response = await this.$API.publishArticle({ article, signature })
        if (response.code !== 0) throw new Error(response.message)
        success(response.data, '发文成功，奖励10 SS积分')
      } catch (error) {
        console.error(error)
        failed(error)
        throw error
      }
    },
    // 创建草稿
    async createDraft(article) {
      // 设置文章标签 🏷️
      this.allowLeave = true
      article.tags = this.setArticleTag(this.tagCards)
      const response = await this.$API.createDraft(article)
      if (response.code !== 0) this.failed('失败请重试')
      else {
        this.$message.success('保存成功')
        this.$router.push({
          name: 'user-id-draft',
          params: {
            id: this.currentUserInfo.id
          }
        })
      }
    },
    // 编辑文章
    async editArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      const { author, hash } = article
      let signature = null
      if (!this.$publishMethods.invalidId(this.currentUserInfo.idProvider)) {
        signature = await this.getSignatureOfArticle({ author, hash })
      }
      const response = await this.$API.editArticle({ article, signature })
      if (response.code === 0) this.success(response.data)
      else this.failed('失败请重试')
    },
    // 删除草稿
    async delDraft(id) {
      if (!id) {
        return this.failed('自动删除草稿失败,请手动删除')
      }
      try {
        const response = await this.$backendAPI.delDraft({ id })
        if (response.status !== 200) this.failed('自动删除草稿失败,请手动删除')
      } catch (error) {
        this.failed('自动删除草稿失败,请手动删除')
      }
    },
    // 更新草稿
    async updateDraft(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      try {
        const response = await this.$API.updateDraft(article)
        if (response.code === 0) {
          this.$message('草稿更新成功')
          this.$router.go(-1)
        } else this.failed('失败请重试')
      } catch (error) {
        this.failed('失败请重试')
      }
    },
    // 发布||修改按钮
    async sendThePost() {
      // 没有登陆 点击发布按钮都提示登陆  编辑获取内容的时候会被前面的func拦截并返回home page
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      // 标题或内容为空时
      if (!strTrim(this.title) || !strTrim(this.markdownData)) return this.failed('标题或正文不能为空')

      if (this.saveType === 'public' && !this.cover) return this.failed('请上传封面')

      if (this.fissionFactor === '') this.fissionFactor = 2 // 用户不填写裂变系数则默认为2

      this.allowLeave = true
      const {
        currentUserInfo,
        title,
        markdownData: content,
        fissionFactor,
        cover,
        editorMode,
        saveType
      } = this
      const { name: author } = currentUserInfo
      const isOriginal = Number(this.isOriginal)
      console.log('sendThePost mode :', editorMode, saveType)
      // 发布文章需要先登录
      // await this.$store.dispatch('signIn', {})
      if (editorMode === 'create' && saveType === 'public') {
        // 发布文章
        const { hash } = await this.sendPost({ title, author, content })
        console.log('sendPost result :', hash)
        this.publishArticle({
          author,
          title,
          hash,
          fissionFactor,
          cover,
          isOriginal
        })
      } else if (editorMode === 'create' && saveType === 'draft') {
        // 发布到草稿箱
        this.createDraft({
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        })
      } else if (editorMode === 'edit') {
        // 编辑文章
        const { hash } = await this.sendPost({ title, author, content })
        this.editArticle({
          signId: this.signId,
          author,
          title,
          hash,
          fissionFactor,
          signature: this.signature,
          cover,
          isOriginal
        })
      } else if (editorMode === 'draft' && saveType === 'public') {
        // 草稿箱编辑 发布
        const { hash } = await this.sendPost({ title, author, content })
        this.publishArticle({
          author,
          title,
          hash,
          fissionFactor,
          cover,
          isOriginal
        })
          .then(() => {
            this.delDraft(this.id)
          })
          .catch(() => {
            console.log('发布错误')
          })
      } else if (editorMode === 'draft' && saveType === 'draft') {
        // 草稿箱编辑 更新
        await this.updateDraft({
          id: this.id,
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        })
      }
    },
    $imgAdd(pos, imgfile) {
      // 想要更换默认的 uploader， 请在 src/api/imagesUploader.js 修改 currentImagesUploader
      // 不要在页面组件写具体实现，谢谢合作 - Frank
      if (imgfile.type === 'image/gif') {
        defaultImagesUploader(imgfile).then(({ data }) => {
          const { url } = data.data
          this.$refs.md.$img2Url(pos, url)
        })
      } else {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const image = new Image()
        image.onload = () => {
          canvas.width = image.width
          canvas.height = image.height
          ctx.drawImage(image, 0, 0)
          canvas.toBlob(
            blob => {
              defaultImagesUploader(blob).then(({ data }) => {
                const { url } = data.data
                this.$refs.md.$img2Url(pos, url)
              })
            },
            imgfile.type,
            0.3
          )
        }
        image.src = imgfile.miniurl
      }
    },
    setToolBar(val) {
      if (val > 750) this.toolbars = Object.assign(toolbars.pc, toolbars.public)
      else this.toolbars = Object.assign(toolbars.mobile, toolbars.public)
    },
    resize() {
      window.onresize = debounce(() => {
        const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
        const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        this.screenWidth = clientWidth
        /* this.mavonStyle = {
          minHeight: `${clientHeight - 174}px`
        } */
      }, 150)
    },
    // 上传完成
    doneImageUpload(res) {
      // console.log(res);
      this.imgUploadDone += Date.now()
      this.cover = res.data.data.cover
    },
    // 删除cover
    removeCover() {
      this.cover = ''
    },
    // head 返回
    headerBackFunc() {
      this.modalMode = 'back'
      this.headLeavePageFunc()
    },
    // head 返回首页
    headerHomeFunc() {
      this.modalMode = 'home'
      this.headLeavePageFunc()
    },
    // head 离开页面方法
    headLeavePageFunc() {
      if (!strTrim(this.title) && !strTrim(this.markdownData)) {
        this.allowLeave = true
        this.leavePage()
      } else this.showModal = true
    },
    // 关闭modal
    changeInfo(status) {
      this.showModal = status
    },
    // modal 同意
    modalCancel() {
      this.showModal = false
      this.allowLeave = true
      this.leavePage()
    },
    // 离开页面
    leavePage() {
      if (this.modalMode === 'back') this.$router.go(-1)
      else if (this.modalMode === 'home') this.$router.push({ path: '/' })
      else this.$router.go(-1)
    },
    // 获取标签
    async getTags() {
      await this.$backendAPI
        .getTags()
        .then(res => {
          console.log(649, res)
          if (res.status === 200 && res.data.code === 0) {
            const { data } = res.data
            // 过滤商品标签 id <= 100
            const filterId = i => i.id <= 100
            const filterTag = data.filter(filterId)
            // 过滤商品标签 id <= 100

            filterTag.map(i => (i.status = false))
            this.tagCards = filterTag
          } else console.log(res.data.message)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 切换状态
    toggleTagStatus(data) {
      const tagCardsIndex = this.tagCards.findIndex(i => i.id === data.id)
      if (tagCardsIndex === -1) return
      this.tagCards.map(i => (i.status = false))
      this.tagCards[tagCardsIndex].status = data.status
      // console.log(this.tagCards, data)
    },
    // 设置标签状态
    setTagStatus() {
      const tagCardsCopy = this.tagCards
      this.articleData.tags.map(i => {
        tagCardsCopy.map((j, index) => {
          if (i.id === j.id) tagCardsCopy[index].status = true
        })
      })
      this.tagCards = tagCardsCopy
    },
    // 导入文章数据
    importArticle(data) {
      this.markdownData = data.content
      this.title = data.title
      this.cover = data.cover
    },
    // 关闭原创声明框
    closeStatement(val) {
      console.log(val)
      this.isOriginal = val
      this.statementVisible = false
    },
    // 原创改变 true 才显示原创声明
    originalChange(val) { if (val) this.statementVisible = true }
  }
}
</script>

<style scoped lang="less" src="./Publish.less"></style>
<style lang="less">
/* 全局覆盖组件样式 */
.v-note-wrapper .v-note-op {
  border: none !important;
}
.content-input-wrapper {
  padding: 8px 10px 15px 10px !important;
}
// 外层容器
.editor {
  margin-top: 60px;
}
// 工具栏
.editor .v-note-op {
  position: fixed;
  // top: 118px;
  left: 0;
  right: 0;
  border-top: 1px solid #eee !important;
  border-bottom: 1px solid #eee !important;
  box-sizing: border-box;
}
// 内容
.editor .v-note-panel {
  padding-top: 40px;
  border-top: none !important;
  border-right: none !important;
  border-left: none !important;
  border-bottom: 1px solid #eee !important;
}
// 工具栏按钮 去掉样式
.editor [type='button'] {
  -webkit-appearance: none;
}
// 工具栏样式下拉阴影
.editor .op-image.popup-dropdown,
.editor .op-header.popup-dropdown {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 4px 0px !important;
}

.editor .v-show-content.scroll-style {
  background-color: #fff !important;
}
.editor .v-note-edit.divarea-wrapper.scroll-style {
  background-color: #f8f9fa;
}
.editor .auto-textarea-input.no-border.no-resize {
  background-color: #f8f9fa;
}
.editor .v-note-op .v-left-item,
.editor .v-note-op .v-right-item {
  flex: none !important;
  display: flex;
  align-items: center;
}
.editor .v-note-op .v-right-item {
  max-width: auto !important;
}
.op-icon-divider {
  height: 18px !important;
}
.editor .op-icon {
  margin-left: 3px !important;
  margin-right: 3px !important;
}
@media screen and (max-width: 750px) {
  .editor .op-icon {
    margin-left: 1px !important;
    margin-right: 1px !important;
  }
}
</style>
