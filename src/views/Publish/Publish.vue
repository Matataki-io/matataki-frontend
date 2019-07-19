<template>
  <div class="new-post" @click.stop="transferButton = false">
    <BaseHeader
      ref="baseHeader"
      :is-center="false"
      :pageinfo="{ title: editorText, rightPage: 'home' }"
      :customize-back-func="true"
      :customize-home-func="true"
      :customize-header-bc="'#fff'"
      @headerBackFunc="headerBackFunc"
      @headerHomeFunc="headerHomeFunc"
    >
      <div slot="right" class="header-right-slot">
        <span class="send-button" @click="sendThePost">{{ sendBtnText }}</span>
        <div
          v-if="isShowTransfer"
          slot="right"
          class="more"
          @click.stop="transferButton = !transferButton"
        >
          <img src="@/assets/more.svg" alt="more" />
          <transition name="fade" mode="out-in">
            <div v-show="transferButton" class="dropdown">
              <div class="dropdown-item" @click="transferModal = true">转让</div>
            </div>
          </transition>
        </div>
      </div>
    </BaseHeader>
    <div class="edit-content">
      <input
        v-model="title"
        class="edit-title"
        placeholder="请输入你的文章标题..."
        size="large"
        clearable
      />

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
      <div v-if="editorMode !== 'edit'" class="fission">
        <p>
          裂变系数
          <Poptip
            popper-class="my-poptip"
            content="决定每名投资者的收益上限 = 投资金额 * 裂变系数 裂变系数越大投资者的收益预期越高"
            width="250"
            word-wrap
            placement="top-start"
          >
            <span class="question">?</span>
          </Poptip>
        </p>
        <div v-if="editorMode !== 'edit'" class="fission-num-slider">
          <VueSlider
            v-model="fissionNum"
            class="fission-num-slider2"
            :min="1"
            :max="2"
            :interval="0.1"
          ></VueSlider>
        </div>
        <div class="fission-num-Input">
          {{ fissionNum }}
        </div>
      </div>
      <div class="cover-container">
        <div v-show="cover">
          <img class="cover-img" :src="coverEditor" alt="cover" />
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
            <img slot="uploadButton" class="cover-add" src="@/assets/newimg/add.svg" alt="add" />
          </img-upload>
          <img
            v-show="cover"
            class="cover-btn"
            src="@/assets/newimg/del.svg"
            alt="remove"
            @click.prevent="removeCover"
          />
        </div>
      </div>
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
    <van-radio-group v-if="isShowEditorMode" v-model="saveType">
      <van-cell-group>
        <van-cell title="公开发布" clickable @click="saveType = 'public'">
          <van-radio name="public">
            <div slot="icon" slot-scope="props" class="my-radio">
              <div v-if="props.checked" class="radio-active"></div>
            </div>
          </van-radio>
        </van-cell>
        <van-cell title="保存到草稿箱" clickable @click="saveType = 'draft'">
          <van-radio name="draft">
            <div slot="icon" slot-scope="props" class="my-radio">
              <div v-if="props.checked" class="radio-active"></div>
            </div>
          </van-radio>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-cell clickable title="确认为原创" @click="isOriginal = !isOriginal">
      <van-checkbox v-model="isOriginal">
        <div slot="icon" slot-scope="props">
          <div v-if="!props.checked" class="my-checkbox"></div>
          <div v-else class="my-checkbox-active">
            <img src="../../assets/newimg/select.svg" alt="select" />
          </div>
        </div>
      </van-checkbox>
    </van-cell>

    <!--<div class="is-original">
      <Checkbox v-model="isOriginal" size="large">&nbsp;确认为原创</Checkbox>
    </div>-->
    <modal-prompt
      :show-modal="showModal"
      :modal-text="modalText"
      @changeInfo="changeInfo"
      @modalCancel="modalCancel"
    />
    <BaseModalForSignIn :show-modal="showSignInModal" @changeInfo="changeInfo2" />
    <article-transfer
      v-if="isShowTransfer"
      :transfer-modal="transferModal"
      :article-id="$route.params.id"
      :from="$route.query.from"
      @changeTransferModal="status => (transferModal = status)"
    />
    <Prompt
      v-model="prompt"
      :content="{
        title: '是否保存为草稿？',
        confirmText: '保存草稿',
        cancelText: '不保存'
      }"
      @confirm="createDraft(saveInfo)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { defaultImagesUploader } from '@/api'
import { sendPost } from '@/api/ipfs'
import { mavonEditor } from 'mavon-editor'
import { strTrim } from '@/common/reg'

import 'mavon-editor/dist/css/index.css' // editor css
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { sleep } from '@/common/methods'
import debounce from 'lodash/debounce'
import { toolbars } from './toolbars' // 编辑器配置
import imgUpload from '@/components/imgUpload/index.vue' // 图片上传
import modalPrompt from './components/modalPrompt.vue' // 弹出框提示
import { Prompt } from '@/components/'

import tagCard from '@/components/tagCard/index.vue'
import articleTransfer from '@/components/articleTransfer/index.vue'

export default {
  name: 'NewPost',
  components: {
    mavonEditor,
    VueSlider,
    imgUpload,
    modalPrompt,
    tagCard,
    articleTransfer,
    Prompt
  },
  data: () => ({
    prompt: false,
    title: '',
    author: '',
    markdownData: '',
    fissionFactor: 2000,
    toolbars: {},
    screenWidth: document.body.clientWidth || document.documentElement.clientWidth,
    mavonStyle: {
      minHeight: `${(document.body.clientHeight || document.documentElement.clientHeight) - 174}px`
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
    showSignInModal: false,
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
    saveInfo: {}
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
    if (this.changed()) next()
    else {
      this.showModal = true
      this.modalMode = 'back'
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
    unload($event) {
      // 刷新页面 关闭页面有提示
      // https://jsfiddle.net/jbf4vL7h/29/
      var confirmationMessage = '\o/'
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
          this.$toast({ duration: 1000, message: data.message })
          this.$router.push({ name: 'home' })
        }
      } catch (error) {
        console.error(error)
        this.$toast({ duration: 1000, message: '获取文章信息发生错误' })
        this.$router.push({ name: 'home' })
      }
      // 设置文章内容
      const { data } = articleData.data
      this.title = data.title
      this.markdownData = data.content
    },
    // 设置文章数据 by hash
    /* async setArticleData(hash) {
      const articleData = await getArticleDatafromIPFS(hash);
      try { // 获取文章信息
        const { data } = await getArticleInfo(hash);
        this.fissionNum = data.fission_factor / 1000;
        this.signature = data.sign;
        this.cover = data.cover;
        this.signId = data.id;
        this.isOriginal = Boolean(data.is_original);
      } catch (error) {
        console.log(error);
        this.$Message.error('获取文章信息发生错误');
      }
      // 设置文章内容
      const { data } = articleData.data;
      this.title = data.title;
      this.markdownData = data.content;
    }, */
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
      this.$toast({ duration: 1000, message: error })
    },
    // 跳转页面
    jumpToArticle(hash) {
      this.$router.push({ name: 'Article', params: { hash } })
    },
    // 成功提示
    async success(hash) {
      this.$toast({ duration: 1000, message: '发送成功,3秒后跳转到你发表的文章' })
      await sleep(3000) // 休眠三秒
      this.jumpToArticle(hash)
    },
    // 发送文章到ipfs
    async sendPost({ title, author, content }) {
      const { data } = await sendPost({
        title,
        author,
        content,
        desc: 'whatever'
      })
      if (data.code !== 200) this.failed('1st step : send post to ipfs failed')
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
        if (this.currentUserInfo.idProvider !== 'GitHub') {
          signature = await this.getSignatureOfArticle({ author, hash })
        }
        try {
          const response = await this.$backendAPI.publishArticle({ article, signature })
          if (response.data.code !== 0) throw new Error(response.data.message)
          success(response.data.data)
          console.log(response)
          return 'success'
        } catch (error) {
          this.showSignInModal = this.$errorHandling.isNoToken(error)
          throw error
        }
      } catch (error) {
        console.error(error)
        failed(error)
        throw error
      }
    },
    confirmSaveDraft() {
      this.createDraft(this.saveInfo)
    },
    // 创建草稿
    async createDraft(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      const response = await this.$backendAPI.createDraft(article)
      if (response.data.msg !== 'success') this.failed('失败请重试')
      this.$toast.success({ duration: 1000, message: '保存成功' })
      this.$router.go(-1)
    },
    // 编辑文章
    async editArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      const { author, hash } = article
      let signature = null
      if (this.currentUserInfo.idProvider !== 'GitHub') {
        signature = await this.getSignatureOfArticle({ author, hash })
      }
      const response = await this.$backendAPI.editArticle({ article, signature })
      if (response.status === 200 && response.data.code === 0) this.success(response.data.data)
      else this.failed('失败请重试')
    },
    // 删除草稿
    async delDraft(id) {
      if (!id) {
        this.failed('自动删除草稿失败,请手动删除')
        return
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
        const response = await this.$backendAPI.updateDraft(article)
        if (response.data.msg !== 'success') this.failed('失败请重试')
        this.$toast({ duration: 1000, message: '草稿更新成功' })
        this.$navigation.cleanRoutes() // 清除路由记录
        this.$router.go(-1)
      } catch (error) {
        this.failed('失败请重试')
      }
    },
    // 发布||修改按钮
    async sendThePost() {
      // 没有登陆 点击发布按钮都提示登陆  编辑获取内容的时候会被前面的func拦截并返回home page
      if (!this.isLogined) return (this.showSignInModal = true)

      // 标题或内容为空时
      if (!strTrim(this.title) || !strTrim(this.markdownData))
        return this.$toast('标题或正文不能为空')

      if (this.saveType === 'public' && !this.cover)
        return this.$toast({ duration: 1000, message: '请上传封面' })

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
        this.prompt = true
        this.saveInfo = {
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        }
        /*this.createDraft({
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        });*/
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
        this.mavonStyle = {
          minHeight: `${clientHeight - 174}px`
        }
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
    changeInfo2(status) {
      this.showSignInModal = status
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
      else if (this.modalMode === 'home') this.$router.push({ name: 'home' })
      else this.$router.go(-1)
    },
    // 获取标签
    async getTags() {
      await this.$backendAPI
        .getTags()
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            let { data } = res.data
            data.map(i => (i.status = false))
            this.tagCards = data
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
      let tagCardsCopy = this.tagCards
      this.articleData.tags.map(i => {
        tagCardsCopy.map((j, index) => {
          if (i.id === j.id) tagCardsCopy[index].status = true
        })
      })
      this.tagCards = tagCardsCopy
    }
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
  margin-top: 68px;
}
// 工具栏
.editor .v-note-op {
  position: fixed;
  top: 113px;
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
