<template>
  <div class="new-post" @click.stop="closeDropdown">
    <div class="edit-content">
      <div class="edit-head">
        <input
          v-model="title"
          class="edit-title"
          :placeholder="$t('publish.titlePlaceholder')"
          size="large"
          clearable
        >
        <span class="save-tips" v-html="saveDraft" />
        <router-link class="save-draft" :to="{name: 'user-id-draft', params: {id: currentUserInfo.id}}">
          草稿
        </router-link>
        <div class="import-button" @click="importVisible = true">
          <svg-icon class="import-icon" icon-class="import" />
          {{ $t('publish.importArticle') }}
        </div>

        <div class="post" @click="sendThePost">
          {{ $t('publish.publish') }}
        </div>

        <el-dropdown v-if="isShowTransfer" slot="more" trigger="click" @command="handleMoreAction">
          <div class="more-icon">
            <svg-icon class="icon" icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dorpdown">
            <el-dropdown-item command="transfer">
              {{ $t('publish.transfer') }}
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
          :placeholder="$t('publish.contentPlaceholder')"
          @imgAdd="$imgAdd"
        />
      </no-ssr>

      <!-- 备份 -->
      <!-- <div class="post-content">
        <h3>持币阅读</h3>
        <el-checkbox v-model="readauThority" size="small">
          设置阅读权限
        </el-checkbox>
        <div v-show="readauThority">
          <h3>持币数量</h3>
          <el-input v-model="readToken" size="small" placeholder="请输入内容" />
          <h3>持币类型</h3>
          <el-select v-model="readSelectValue" size="small" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in readSelectOptions"
              :key="item.id"
              :label="item.symbol + '-' + item.name"
              :value="item.id"
            />
          </el-select>
          <h3>内容摘要</h3>
          <el-input
            v-model="readSummary"
            size="small"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 12}"
            placeholder="请输入内容"
            maxlength="300"
            show-word-limit
          />
        </div>
        <el-button plain size="small" class="post-btn" @click="sendThePost">
          {{ $t('publish.identifyAndPublish') }}
        </el-button>
      </div> -->

      <div class="post-content">
        <h3>
          持币阅读
          <el-tooltip effect="dark" content="添加限制条件后，读者只有在持有特定数量的粉丝币后才可查看全文的。" placement="top-start">
            <svg-icon
              class="help-icon"
              icon-class="help"
            />
          </el-tooltip>
        </h3>
        <el-checkbox v-model="readauThority" size="small">
          设置阅读权限
        </el-checkbox>
        <div v-show="readauThority" style="width: 300px;">
          <h3>持币数量</h3>
          <el-input
            v-model="readToken"
            :min="1"
            :max="100000000"
            size="small"
            placeholder="请输入内容"
          />
          <h3>持币类型</h3>
          <el-select v-model="readSelectValue" size="small" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in readSelectOptions"
              :key="item.id"
              :label="item.symbol + '-' + item.name"
              :value="item.id"
            />
          </el-select>
          <h3>内容摘要</h3>
          <el-input
            v-model="readSummary"
            size="small"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 12}"
            placeholder="请输入内容"
            maxlength="300"
            show-word-limit
          />
        </div>
      </div>
      <div v-if="$route.params.type !== 'edit'" class="set-item fl ac">
        <span class="set-title">
          {{ $t('publish.commentTitle') }}
        </span>
        <span class="set-des">
          {{ $t('publish.commentContent') }}
        </span>
        <el-input-number
          v-model="commentPayPoint"
          style="width: 110px"
          controls-position="right"
          class="price-point"
          :min="1"
          :max="99999"
          size="mini"
          label="评论价格"
          step-strictly
        />
        <span class="input-number">
          {{ $t('publish.point') }}
        </span>
      </div>
      <!-- <div v-if="editorMode !== 'edit'" class="fission">
        <p>
          裂变系数
          <el-tooltip

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
      </div> -->
      <div class="cover-container">
        <div class="cover">
          <p>
            {{ $t('publish.coverTitle') }}
            <span class="cover-tip">
              {{ $t('publish.coverDes') }}
            </span>
          </p>
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
          <div v-show="cover">
            <img class="cover-img" :src="coverEditor" alt="cover">
          </div>
        </div>
      </div>
    </div>
    <div class="cover-container">
      <el-checkbox v-model="isOriginal" class="is-original" @change="originalChange">
        {{ $t('publish.original') }}
      </el-checkbox>
    </div>
    <div class="tag">
      <p>
        {{ $t('publish.tagTitle') }}
      </p>
      <div class="tag-content">
        <tag-card
          v-for="(item, index) in tagCards"
          :key="index"
          :tag-card="item"
          @toggleTagStatus="toggleTagStatus"
        />
      </div>
    </div>

    <div class="set-item">
      <span class="set-title">添加关联文章
        <span class="set-des">可选</span>
      </span>
      <div class="related">
        <div v-loading="relatedLoading">
          <el-input
            v-model="relatedLink"
            class="related-input"
            placeholder="输入链接（可自动检测本站文章）"
          >
            <el-tooltip slot="suffix" effect="dark" content="自动检测" placement="top">
              <img class="auto-test" src="@/assets/img/auto_test.png" alt="auto test" @click="extractRefTitle">
            </el-tooltip>
          </el-input>
          <el-input
            v-model="relatedTitle"
            type="text"
            class="related-input"
            placeholder="输入标题"
            maxlength="50"
            show-word-limit
          />
          <el-input
            v-model="relatedContent"
            class="related-input"
            type="textarea"
            placeholder="推荐理由或摘要（选填）"
            maxlength="500"
            show-word-limit
            rows="6"
          />
          <div class="related-add">
            <div class="add-icon" @click="addDraftsReferences">
              <i class="el-icon-plus" />
            </div>
            <span>添加关联</span>
          </div>
        </div>

        <div v-loading="loading">
          <no-content-prompt :list="pull.list">
            <div v-loading="item.loading" v-for="(item, index) in relatedList" :key="item.number" class="related-list">
              <template v-if="item.edit">
                <el-input
                  v-model="item.urlInput"
                  class="related-input"
                  placeholder="输入链接（可自动检测本站文章）"
                >
                  <el-tooltip slot="suffix" effect="dark" content="自动检测" placement="top">
                    <img class="auto-test" src="@/assets/img/auto_test.png" alt="auto test" @click="extractRefTitle(index)">
                  </el-tooltip>
                </el-input>
                <el-input
                  v-model="item.titleInput"
                  type="text"
                  class="related-input"
                  placeholder="输入标题"
                  maxlength="50"
                  show-word-limit
                />
                <el-input
                  v-model="item.contentInput"
                  class="related-input"
                  type="textarea"
                  placeholder="推荐理由或摘要（选填）"
                  maxlength="500"
                  show-word-limit
                  rows="6"
                />
                <div class="related-add">
                  <div class="fl ac">
                    <div class="add-icon" @click="remakeRelated(index)">
                      <svg-icon icon-class="cancel" />
                    </div>
                    <span>取消修改</span>
                  </div>
                  <div class="fl ac" style="margin-left: 20px;">
                    <div class="add-icon" @click="confirmRelated(index)">
                      <i class="el-icon-plus" />
                    </div>
                    <span>确认修改</span>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="fl jsb">
                  <div class="fl ac related-7">
                    <div class="related-list-link">
                      <a :href="item.url" target="_blank">{{ item.url }}</a>
                    </div>
                    <a :href="item.url" target="_blank">
                      <svg-icon class="related-icon-icon" icon-class="link" />
                    </a>
                  </div>
                  <div class="fl ac jfe related-3">
                    <el-tooltip class="related-edit" effect="dark" content="修改" placement="top">
                      <svg-icon class="related-icon-icon" icon-class="pencli" @click="editRelated(index, item.number)" />
                    </el-tooltip>

                    <el-tooltip effect="dark" content="删除" placement="top">
                      <svg-icon class="related-icon-icon" icon-class="delete" @click="removeRelated(index, item.number)" />
                    </el-tooltip>
                    <span class="related-id">{{ item.number }}</span>
                  </div>
                </div>
                <div class="related-list-title" :class="!item.content && 'no-margin-bottom'">
                  {{ item.title }}
                </div>
                <div :class="!item.collapse && 'open'">
                  <div class="related-list-content">
                    {{ item.content }}
                  </div>
                  <div v-if="item.showCollapse" class="related-more">
                    <transition name="fade">
                      <div v-if="!item.collapse" class="more-full" />
                    </transition>
                    <span @click="item.collapse = !item.collapse">
                      {{ item.collapse ? '折叠': '展开' }}
                      <i class="el-icon-arrow-up arrow-up" /></span>
                  </div>
                </div>
              </template>
            </div>
            <!-- todo 如果id不是数字, 不让列表请求 -->
            <user-pagination
              v-show="!loading"
              :url-replace="$route.params.id + ''"
              :current-page="currentPage"
              :params="pull.params"
              :api-url="pull.apiUrl"
              :page-size="pull.params.pagesize"
              :total="total"
              class="pagination"
              :reload="pull.reload"
              @paginationData="paginationData"
              @togglePage="togglePage"
            />
          </no-content-prompt>
        </div>
      </div>
    </div>
    <article-transfer
      v-if="isShowTransfer"
      v-model="transferModal"
      :article-id="Number($route.params.id)"
      :from="$route.params.type"
      @toggleDone="allowLeave = true"
    />
    <articleImport v-model="importVisible" />
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

import { getCookie } from '@/utils/cookie'
import { toPrecision, precision } from '@/utils/precisionConversion'

import userPagination from '@/components/user/user_pagination.vue'

export default {
  name: 'NewPost',
  components: {
    imgUpload,
    tagCard,
    articleTransfer,
    articleImport,
    statement,
    userPagination
  },
  data() {
    return {
      prompt: false,
      title: '',
      author: '',
      markdownData: '',
      fissionFactor: 2000,
      toolbars: {},
      screenWidth: 1000,
      mavonStyle: {
        minHeight: '800px'
      },
      fissionNum: 2,
      cover: '',
      signature: '',
      signId: '',
      id: '',
      isOriginal: false, // 是否原创
      imgUploadDone: 0,
      showModal: false, // 弹框显示
      modalText: {
        text: [this.$t('publish.modalTextText')], // 退出
        button: [this.$t('publish.modalTextButton1'), this.$t('publish.modalTextButton2')]
      },
      modalMode: null, // header 判断点击的 back 还是 home
      tagCards: [], // 文章标签
      articleData: {}, // 文章数据
      transferButton: false, // 转让按钮
      transferModal: false, // 转让弹框
      allowLeave: false, // 允许离开
      saveInfo: {},
      importVisible: false, // 导入
      statementVisible: false, // 原创声明
      commentPayPoint: 1,
      autoUpdateDfaft: false, // 是否自动更新草稿
      autoUpdateDfaftTags: false, // 是否自动更新草稿标签
      saveDraft: '文章自动保存至',
      readContent: false,
      readauThority: false,
      readToken: 1,
      readSelectOptions: [],
      readSelectValue: '',
      readSummary: '',
      relatedLink: '',
      relatedTitle: '',
      relatedContent: '',
      relatedLoading: false,
      relatedList: [
        // {
        //   url: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
        //   urlInput: 'http://localhostlocalhostlocalhost:8080/publish/draft/create',
        //   title: '6块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
        //   titleInput: '6块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化区块链文娱产品形态猜想：文化概念的区块链化',
        //   content: '解决了区块链改造文娱行业的历的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
        //   contentInput: '解决了区块链改造文娱行业的历的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态有没有具有商业前景的产品形态？已经可行的落地路径呢？陈浩结合二次元行业的经验，设计出了以ERC721和“文化概念”为核心的“galgame+文学”社区产品。这或许是可供文娱类项目参考的思路之一。',
        //   collapse: false,
        //   showCollapse: true,
        //   edit: false
        // }
      ],
      pull: {
        params: {
          // 没有id是时候不请求list
          // pagesize: 5
        },
        apiUrl: this.$route.params.type === 'draft' ? 'draftsReferences' : 'postsReferences',
        list: [],
        reload: 0
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    coverEditor() {
      return this.$API.getImg(this.cover)
    },
    isShowTransfer() {
      return this.$route.params.type === 'draft'
    }
  },
  watch: {
    screenWidth(val) {
      this.setToolBar(val)
    },
    mavonStyle(newVal) {
      // console.log(newVal)

      this.mavonStyle = newVal
    },
    fissionNum() {
      this.fissionFactor = this.fissionNum * 1000
    },
    title() {
      this.updateDraftWatch()
    },
    markdownData() {
      this.updateDraftWatch()
    },
    commentPayPoint() {
      this.updateDraftWatch()
    },
    cover() {
      this.updateDraftWatch()
    },
    isOriginal() {
      this.updateDraftWatch()
    },
    tagCards: {
      deep: true,
      handler() {
        if (!this.autoUpdateDfaftTags) return
        this.updateDraftWatch()
      }
    }
  },
  created() {
    // 编辑文章不会自动保存
    if (this.$route.params.type === 'edit') this.saveDraft = ''
  },
  mounted() {
    // 没有登录 通过isLogined获取在页面刷新后会获取较慢 无法通过它来判断
    if (!getCookie('ACCESS_TOKEN')) return this.$router.go(-1)

    const { type, id } = this.$route.params

    if (type === 'draft' && id === 'create') {
      // 创建新草稿
      this.autoUpdateDfaft = true
    } else if (type === 'draft' && id !== 'create') {
      // 编辑草稿
      this.getDraft(id)
    } else if (type === 'edit') {
      const { hash } = this.$route.query
      // 编辑文章
      this.setArticleDataById(hash, id)
    } else {
      console.log('路由错误')
    }

    this.getTags()
    this.resize()
    this.setToolBar(this.screenWidth)

    this.getAllTokens()

    this.renderRelatedListContent()

    // 判断当前
    // 如果是草稿 并且有id请求list, 如果没有下面创建草稿之后会请求list
    if (type === 'draft' && typeof parseInt(id) === 'number' && !isNaN(parseInt(id))) { // 草稿
      this.pull.params = {
        pagesize: 5
      }
    } else if (type === 'edit') { // 编辑
      this.pull.params = {
        pagesize: 5
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.changed()) return next()
    if (window.confirm(this.$t('publish.modalTextText'))) {
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

  methods: {
    ...mapActions(['getSignatureOfArticle']),
    // watch 监听草稿更新
    updateDraftWatch() {
      if (!this.autoUpdateDfaft) return
      this.updateDraftFunc()
    },
    // 更新草稿方法
    updateDraftFunc: debounce(function () {
      const {
        currentUserInfo,
        title,
        markdownData: content,
        fissionFactor,
        cover
      } = this
      const isOriginal = Number(this.isOriginal)
      const { type, id } = this.$route.params

      if (type === 'draft' && id === 'create') {
        // console.log('创建草稿')
        this.autoCreateDraft({
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        })
      } else if (type === 'draft' && id !== 'create') {
        // console.log('更新草稿')
        // 草稿箱编辑 更新
        this.autoUpdateDraft({
          id: this.id,
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        })
      }
    }, 500),
    handleMoreAction(command) {
      this[command]()
    },
    transfer() {
      this.transferModal = true
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
    setTag(data) {
      this.articleData = data // 设置文章数据
      // 编辑的时候设置tag状态
      const { id } = this.$route.params
      if (id !== 'edit') this.setTagStatus()
    },
    // 通过ID拿数据
    async setArticleDataById(hash, id) {
      const articleData = await this.$API.getIfpsData(hash)
      // console.log('articleData', articleData, hash, id)
      // 获取文章信息
      const res = await this.$API.getMyPost(id).then(res => {
        if (res.code === 0) {
          this.fissionNum = res.data.fission_factor / 1000
          this.signature = res.data.sign
          this.cover = res.data.cover
          this.signId = res.data.id
          this.isOriginal = Boolean(res.data.is_original)

          // 持币阅读
          if (res.data.tokens && res.data.tokens.length !== 0) {
            this.readauThority = true
            this.readToken = precision(res.data.tokens[0].amount, 'cny', res.data.tokens[0].decimals)
            this.readSummary = res.data.short_content
            // this.readSelectOptions = res.data.tokens
            this.readSelectValue = res.data.tokens[0].id
          }

          this.setTag(res.data)
        } else {
          this.$message.success(res.message)
          this.$router.push({ path: '/article' })
        }
      }).catch(err => {
        console.error(err)
        this.$message.error(this.$t('error.getArticleInfoError'))
        this.$router.push({ path: '/article' })
      })

      // 设置文章内容
      this.title = articleData.data.title
      this.markdownData = articleData.data.content
    },
    // 得到草稿箱内容 by id
    async getDraft(id) {
      await this.$API.getDraft({ id }).then(res => {
        this.fissionNum = res.fission_factor ? res.fission_factor / 1000 : 2
        this.cover = res.cover
        this.title = res.title
        this.markdownData = res.content
        this.id = id
        this.isOriginal = Boolean(res.is_original)
        this.commentPayPoint = res.comment_pay_point

        this.setTag(res)
      }).catch(err => {
        console.log(err)
        this.$message.error('获取草稿内容失败')
      }).finally(() => {
        this.autoUpdateDfaft = true
      })
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
    success(hash, msg = this.$t('success.public')) {
      this.$message.success(msg)
      this.jumpToArticle(hash)
    },
    /**
     * 获取所有token
     */
    async getAllTokens() {
      const pagesize = 999
      await this.$API.allToken({ pagesize }).then(res => {
        if (res.code === 0) {
          this.readSelectOptions = res.data.list
        }
      }).catch(err => console.log(err))
    },
    /**
     * 文章持币阅读
     */
    async postMineTokens(id, type) {
      let tokenArr = []
      if (this.readauThority) { // 持币
        // 获取当前选择的币种
        const token = this.readSelectOptions.filter(list => list.id === this.readSelectValue)
        // 目前只用上传一种数据格式
        tokenArr = [
          {
            tokenId: token[0].id,
            amount: toPrecision(this.readToken, 'cny', token[0].decimals)
          }
        ]
      }

      const data = {
        signId: id,
        tokens: tokenArr
      }
      await this.$API.addMineTokens(data)
        .then(res => {
          if (res.code === 0) {
            if (type === 'publish') {
            // 删除草稿
              this.delDraft(this.id).then(() => {
                this.success(id, `${this.$t('publish.publishArticleSuccess', [this.$point.publish])}`)
              }).catch(() => { console.log('发布错误') })
            } else this.success(id)
          } else this.failed('设置持币阅读失败')
        })
        .catch(err => console.log(err))
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
      if (data.code !== 0) this.failed(this.$t('error.sendPostIpfsFail'))
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
      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      const { failed, success } = this
      try {
        const { author, hash } = article
        let signature = null
        if (!this.$publishMethods.invalidId(this.currentUserInfo.idProvider)) {
          // 单独处理 同下
          if (this.currentUserInfo.idProvider.toLocaleLowerCase() !== 'vnt') signature = await this.getSignatureOfArticle({ author, hash })
        }
        const response = await this.$API.publishArticle({ article, signature })
        if (response.code !== 0) throw new Error(response.message)

        // 关联文章  草稿发布时发布引用的文章
        const data = {
          signId: response.data
        }
        this.$API.draftsReferencesPublish(this.$route.params.id, data).then(res => {
          if (res.code === 0) {
            this.postMineTokens(response.data, 'publish')
          } else {
            this.$message.error(res.message)
            throw new Error(res.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      } catch (error) {
        console.error(error)
        failed(error)
        throw error
      }
    },
    // 自动创建草稿
    async autoCreateDraft(article) {
      this.saveDraft = '保存中...'
      // 设置文章标签 🏷️
      this.allowLeave = true
      article.tags = this.setArticleTag(this.tagCards)
      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      const response = await this.$API.createDraft(article).then(res => {
        if (res.code === 0) {
          this.saveDraft = '文章自动保存至'
          // console.log(this.$route)
          this.$route.params.id = res.data
          this.id = res.data
          // console.log(this.$route)
          const url = window.location.origin + '/publish/draft/' + res.data
          history.pushState({}, '', url)

          // 草稿创建成功, 允许list请求
          this.pull.params = {
            pagesize: 5
          }
        } else this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      }).catch(err => {
        console.log(err)
        this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      })
    },
    // 编辑文章
    async editArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      const { author, hash } = article
      let signature = null
      if (!this.$publishMethods.invalidId(this.currentUserInfo.idProvider)) {
        // 单独处理 同上
        if (this.currentUserInfo.idProvider.toLocaleLowerCase() !== 'vnt') signature = await this.getSignatureOfArticle({ author, hash })
      }
      const response = await this.$API.editArticle({ article, signature })
      if (response.code === 0) this.postMineTokens(response.data, 'edit')
      else this.failed(this.$t('error.failTry'))
    },
    // 删除草稿
    async delDraft(id) {
      if (!id) return this.failed(this.$t('error.deleteDraft'))
      await this.$API.delDraft({ id })
        .then(res => {
          if (res.code !== 0) this.failed(this.$t('error.deleteDraft'))
        }).catch(err => {
          console.log(err)
          this.failed(this.$t('error.deleteDraft'))
        })
    },
    // 更新草稿
    async autoUpdateDraft(article) {
      this.allowLeave = true

      this.saveDraft = '保存中...'
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      try {
        const res = await this.$API.updateDraft(article)
        if (res.code === 0) {
          this.saveDraft = '文章自动保存至'
        } else this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      } catch (error) {
        this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      }
    },
    // 发布||修改按钮
    sendThePost() {
      // 没有登录 点击发布按钮都提示登录  编辑获取内容的时候会被前面的func拦截并返回home page
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      // 标题或内容为空时
      if (!strTrim(this.title) || !strTrim(this.markdownData)) return this.failed(this.$t('warning.titleOrContent'))

      if (!this.cover) return this.failed(this.$t('warning.cover'))

      if (this.fissionFactor === '') this.fissionFactor = 2 // 用户不填写裂变系数则默认为2
      this.allowLeave = true
      const { type, id } = this.$route.params

      const {
        currentUserInfo,
        title,
        markdownData: content,
        fissionFactor,
        cover
      } = this
      const { name: author } = currentUserInfo
      const isOriginal = Number(this.isOriginal)

      // url draft edit
      // 草稿发送
      const draftPost = async () => {
        if (this.readauThority) {
          if (!(Number(this.readToken) > 0)) return this.$message.warning('持币数量设置不能小于0')
          else if (!this.readSelectValue) return this.$message.warning('请选择持币类型')
          else if (!this.readSummary) return this.$message.warning('请填写摘要')
        }
        // 发布文章
        const { hash } = await this.sendPost({ title, author, content })
        // console.log('sendPost result :', hash)
        this.publishArticle({
          author,
          title,
          hash,
          fissionFactor,
          cover,
          isOriginal,
          shortContent: this.readSummary
        })
      }
      // 编辑发送
      const editPost = async () => {
        if (this.readauThority) {
          if (!(Number(this.readToken) > 0)) return this.$message.warning('持币数量设置不能小于0')
          else if (!this.readSelectValue) return this.$message.warning('请选择持币类型')
          else if (!this.readSummary) return this.$message.warning('请填写摘要')
        }

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
          isOriginal,
          shortContent: this.readSummary
        })
      }

      if (type === 'draft') draftPost()
      else if (type === 'edit') editPost()
      else draftPost() // 错误的路由, 当发布文章处理
    },
    $imgAdd(pos, imgfile) {
      // 想要更换默认的 uploader， 请在 src/api/imagesUploader.js 修改 currentImagesUploader
      // 不要在页面组件写具体实现，谢谢合作 - Frank
      if (imgfile.type === 'image/gif') {
        defaultImagesUploader(imgfile).then(({ data }) => {
          let url
          if (!data.data) {
            url = data.message.replace('Image upload repeated limit, this image exists at: ', '')
          } else {
            url = data.data.url
          }
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
                let url
                if (!data.data) {
                  url = data.message.replace('Image upload repeated limit, this image exists at: ', '')
                } else {
                  url = data.data.url
                }
                console.log(url)
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
          // console.log(649, res)
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
        }).finally(() => {
          this.autoUpdateDfaftTags = true
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
    // 关闭原创声明框
    closeStatement(val) {
      // console.log(val)
      this.isOriginal = val
      this.statementVisible = false
    },
    // 原创改变 true 才显示原创声明
    originalChange(val) { if (val) this.statementVisible = true },
    closeDropdown() {
      this.transferButton = false
      this.readContent = false
    },
    /**
     * 渲染关联内容 判断是否显示展开或折叠
     * 如果传递参数 循环所有, 否则判断单个
     */
    renderRelatedListContent(i) {
      this.$nextTick(() => {
        if (i) {
          const ele = document.querySelectorAll('.related-list-content')[i]
          if (ele.clientHeight < 80) this.relatedList[i].showCollapse = false
          else this.relatedList[i].showCollapse = true
        } else {
          const relatedList = document.querySelectorAll('.related-list-content')
          relatedList.forEach((ele, i) => {
            if (ele.clientHeight < 80) this.relatedList[i].showCollapse = false
            else this.relatedList[i].showCollapse = true
          })
        }
      })
    },
    // 取消关联编辑
    remakeRelated(i) {
      this.relatedList[i].urlInput = this.relatedList[i].url
      this.relatedList[i].titleInput = this.relatedList[i].title
      this.relatedList[i].contentInput = this.relatedList[i].content
      this.relatedList[i].edit = false
    },
    // 确定管理编辑
    confirmRelated(i) {
      const { id, type } = this.$route.params
      if (!this.relatedList[i].urlInput || !this.relatedList[i].titleInput) return this.$message.warning('关联文章链接或标题不能为空!!!')
      const data = {
        url: this.relatedList[i].urlInput,
        title: this.relatedList[i].titleInput,
        summary: this.relatedList[i].contentInput
      }

      const resSuccess = res => {
        if (res.code === 0) {
          this.relatedList[i].url = this.relatedList[i].urlInput
          this.relatedList[i].title = this.relatedList[i].titleInput
          this.relatedList[i].content = this.relatedList[i].contentInput
          this.relatedList[i].edit = false
          this.renderRelatedListContent(i)
          this.$message.success(res.message)
        } else {
          this.$message.success(res.message)
        }
      }

      if (type === 'draft') {
        // 如果没有草稿id 不会有列表
        this.$API.draftsReferences(this.$route.params.id, data).then(res => {
          resSuccess(res)
        }).catch(err => {
          console.log('err', err)
        })
      } else if (type === 'edit') {
        // 如果没有草稿id 不会有列表
        this.$API.postsReferences(this.$route.params.id, data).then(res => {
          resSuccess(res)
        }).catch(err => {
          console.log('err', err)
        })
      } else {
        this.$message.warning('请返回主页重新进入操作!!!')
      }
    },
    // 删除关联
    removeRelated(i, number) {
      const { id, type } = this.$route.params
      const resSuccess = res => {
        // 提交数据等判断
        if (res.code === 0) {
          this.relatedList.splice(i, 1) // 客户端移除
          this.$message.success(res.message)
        } else {
          this.$message.success(res.message)
        }
      }
      if (type === 'draft') {
        // 如果没有草稿id 不会有列表
        this.$API.removeDraftsReferences(this.$route.params.id, number).then(res => {
          resSuccess(res)
        }).catch(err => {
          console.log('err', err)
        })
      } else if (type === 'edit') {
        // 如果没有草稿id 不会有列表
        this.$API.removePostsReferences(this.$route.params.id, number).then(res => {
          resSuccess(res)
        }).catch(err => {
          console.log('err', err)
        })
      } else {
        this.$message.warning('请返回主页重新进入操作!!!')
      }
    },
    editRelated(i, number) {
      const { id, type } = this.$route.params
      const resSuccess = res => {
        if (res.code === 0) {
          this.relatedList[i].urlInput = res.data.url
          this.relatedList[i].titleInput = res.data.title
          this.relatedList[i].contentInput = res.data.summary

          this.relatedList[i].edit = !this.relatedList[i].edit
        } else {
          this.$message.warning(res.message)
        }
      }
      if (type === 'draft') {
        // 如果没有草稿id 不会有列表
        this.$API.getDraftsReferences(this.$route.params.id, number).then(res => {
          resSuccess(res)
        }).catch(err => {
          console.log('err', err)
        })
      } else if (type === 'edit') {
        // 如果没有草稿id 不会有列表
        this.$API.getPostsReferences(this.$route.params.id, number).then(res => {
          resSuccess(res)
        }).catch(err => {
          console.log('err', err)
        })
      } else {
        this.$message.warning('请返回主页重新进入操作!!!')
      }
    },
    // 自动检测url 获取标题 内容等
    extractRefTitle(i) {
      if (i) {
        const data = {
          url: this.relatedList[i].urlInput
        }
        this.relatedList[i].loading = true
        this.$API.extractRefTitle(data)
          .then(res => {
            if (res.code === 0) {
              this.relatedList[i].titleInput = res.data.title
              this.relatedList[i].contentInput = res.data.summary
              this.$message.success('检测成功')
            } else {
              this.$message.warning(res.message)
            }
          }).catch(err => {
            console.log('获取信息失败', err)
          }).finally(() => {
            this.relatedList[i].loading = false
          })
      } else {
        const data = {
          url: this.relatedLink
        }
        this.relatedLoading = true
        this.$API.extractRefTitle(data)
          .then(res => {
            if (res.code === 0) {
              this.relatedTitle = res.data.title
              this.relatedContent = res.data.summary
              this.$message.success('检测成功')
            } else {
              this.$message.warning(res.message)
            }
          }).catch(err => {
            console.log('获取信息失败', err)
          }).finally(() => {
            this.relatedLoading = false
          })
      }
    },
    // 添加草稿资源
    addDraftsReferences() {
      const { id, type } = this.$route.params

      if (!this.relatedLink || !this.relatedTitle) return this.$message.warning('关联文章链接或标题不能为空!!!')
      const data = {
        url: this.relatedLink,
        title: this.relatedTitle,
        summary: this.relatedContent
      }

      const resSuccess = res => {
        if (res.code === 0) {
          this.pull.reload = Date.now() // 刷新list
          this.relatedLink = this.relatedTitle = this.relatedContent = '' // 清空内容
          this.$message.success(res.message)
        } else {
          this.$message.success(res.message)
        }
      }

      if (type === 'draft') { // 草稿
        // 判断是否为数字
        if (typeof parseInt(id) === 'number' && !isNaN(parseInt(id))) {
          this.relatedLoading = true
          this.$API.draftsReferences(id, data).then(res => {
            resSuccess(res)
          }).catch(err => {
            console.log('err', err)
          }).finally(() => {
            this.relatedLoading = false
          })
        } else { // 说明没有草稿id
          this.$message.warning('请先填写文章内容!!!')
        }
      } else if (type === 'edit') { // 编辑
        // 判断是否为数字
        if (typeof parseInt(id) === 'number' && !isNaN(parseInt(id))) {
          this.relatedLoading = true
          this.$API.postsReferences(id, data).then(res => {
            resSuccess(res)
          }).catch(err => {
            console.log('err', err)
          }).finally(() => {
            this.relatedLoading = false
          })
        } else { // 说明没有草稿id
          this.$message.warning('请先填写文章内容!!!')
        }
      } else { // 都不是
        this.$message.warning('请返回主页重新进入操作!!!')
      }
    },
    paginationData(res) {
      // console.log(res)
      this.total = res.data.count || 0
      this.relatedList.length = 0
      res.data.list.map(i => {
        this.relatedList.push({
          url: i.url,
          urlInput: i.url,
          title: i.title,
          titleInput: i.title,
          content: i.summary,
          contentInput: i.summary,
          number: i.number,
          collapse: false,
          showCollapse: true,
          edit: false,
          loading: false
        })
      })
      this.pull.list = res.data.list
      this.loading = false

      this.renderRelatedListContent()
    },
    togglePage(i) {
      this.loading = true
      this.pull.list = []
      this.currentPage = i
      this.$router.push({
        query: {
          page: i
        }
      })
    }
  }
}
</script>

<style scoped lang="less" src="../Publish.less"></style>
<style lang="less">
/* 全局覆盖组件样式 */
.v-note-wrapper .v-note-op {
  border: none !important;
}
.editor .content-input-wrapper {
  height: 100%;
  background-color: #f8f9fa !important;
  padding: 30px !important;
}

// 外层容器
.editor {
  margin-top: 59px;
  .v-show-content {
    padding: 30px !important;
  }
  .v-note-edit.divarea-wrapper {
    overflow-y: auto !important;
    border-right: 1px solid #ddd !important;
  }
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
  padding-top: 44px;
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
// // 覆盖裂变系数
// .fission {
//   .el-slider__bar {
//     background-color: @purpleDark;
//   }
//   .el-slider__button {
//     border-color: @purpleDark;
//   }
// }
</style>
