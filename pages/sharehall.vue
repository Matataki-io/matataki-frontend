<template>
  <div class="sharehall">
    <g-header />
    <div class="sharehall-push">
      <div class="sharehall-push__content">
        <inputContent :total-text="totalText" />
        <el-form
          ref="urlForm"
          :model="urlForm"
          :rules="urlRules"
          @submit.native.prevent
        >
          <el-form-item label="" prop="url">
            <div class="input-line">
              <!-- 为了使用from的验证功能, 不能用css实现下划线聚焦了 用js解决 -->
              <el-input
                v-model="urlForm.url"
                size="mini"
                class="push-input"
                :placeholder="$t('enter-the-link-including-http')"
                @focus="focusInput"
                @blur="blurInput"
                @change="changeInput"
              />
              <el-button
                v-loading="urlLoading"
                type="primary"
                size="mini"
                class="g-button__black "
                @click="getUrlData('urlForm')"
              >
                <svg-icon icon-class="enter" class="icon" />
              </el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="shareLinkList.length !== 0">
            <div class="share-push__content">
              <template v-for="(item, index) in shareLinkList">
                <shareOuterCard
                  v-if="item.ref_sign_id === 0"
                  :key="'shareInsideCard' + index"
                  :card="item"
                  :idx="index"
                  class="list-card"
                  @removeShareLink="removeShareLink"
                />
                <sharePCard
                  v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
                  :key="'shareInsideCard' + index"
                  :card="item"
                  :idx="index"
                  class="list-card"
                  @removeShareLink="removeShareLink"
                />
                <shareInsideCard
                  v-else-if="item.ref_sign_id && item.channel_id === 3"
                  :key="'shareOuterCard' + index"
                  :card="item"
                  :idx="index"
                  class="list-card"
                  @removeShareLink="removeShareLink"
                />
              </template>
            </div>
          </el-form-item>
          <div class="push-btn">
            <uploadMedia
              v-model="mediaList"
              :visible-state.sync="uploadMediaVisible"
              @uploading="item => mediaUploading = item"
            />
            <el-button
              v-loading.fullscreen.lock="fullscreenLoading"
              type="primary"
              class="g-button__black "
              size="mini"
              @click="pushShare()"
            >
              <svg-icon icon-class="edit" class="icon" />
              {{ $t('publish.publish') }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="sharehall-content">
      <div class="sharehall-main">
        <div class="sharehall-head">
          <h3 class="sharehall-title">
            {{ $t('sharehall.hall') }}
          </h3>
          <div class="sort">
            <span :class="value === options[0].value && 'active'" @click="value = options[0].value">{{ options[0].label }}</span>
            &nbsp;/&nbsp;
            <span :class="value === options[1].value && 'active'" @click="value = options[1].value">{{ options[1].label }}</span>
          </div>
        </div>
        <shareCard
          v-for="(item, index) in pull.list"
          :key="index"
          :card="item"
          class="list-card"
          @refClick="refClick"
          @ref="ref"
        />
        <buttonLoadMore
          :params="pull.params"
          :api-url="pull.apiUrl"
          :auto-request-time="pull.time"
          :type-index="0"
          @buttonLoadMore="getListData"
        />
      </div>
      <div class="sharehall-other">
        <div v-if="usersRecommendList.length !== 0" class="recommend-author">
          <div class="ra-head">
            <h3 class="sharehall-title">
              {{ $t('home.recommendAuthor') }}
            </h3>
            <span class="ra-head-random" @click="usersrecommend">
              <div class="change">
                <svg-icon
                  :class="usersLoading && 'rotate'"
                  class="change-icon"
                  icon-class="change"
                />
              </div>
              <span>{{ $t('home.random') }}</span>
            </span>
          </div>
          <div class="ra-content">
            <r-a-list v-for="item in usersRecommendList" :key="item.id" :card="item" />
          </div>
        </div>
      </div>
    </div>

    <m-dialog v-model="shareDoneCard" width="400px">
      <!-- 如果内容过多可以抽离 -->
      <div class="dialog-content">
        <img src="@/assets/img/done.png" alt="done" class="share-done">
        <h4 class="share-done__title">
          {{ $t('share-published') }}
        </h4>
        <p class="share-done__desciption">
          {{ $t('sharehall.shareSlogan') }}
        </p>
        <div
          ref="shareCard"
          v-loading="createShareLoading"
          class="share-card"
        >
          <img v-if="saveImg" :src="saveImg" alt="save">
        </div>
        <el-button
          v-loading="saveLoading"
          :disabled="saveLoading"
          type="primary"
          class="share-card__btn"
          @click="downloadShareImage"
        >
          {{ $t('save-and-share-cards') }}
        </el-button>
        <shareImage
          v-if="!saveImg"
          ref="shareImage"
          :content="shareCard.content"
          :avatar-src="shareCard.avatarSrc"
          :username="shareCard.username"
          :reference="shareCard.reference"
          :url="shareCard.url"
          card-type="edit"
          class="share-card__box"
        />
      </div>
    </m-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import throttle from 'lodash/throttle'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import shareCard from '@/components/share_card/index.vue'
import { getCookie } from '@/utils/cookie'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import RAList from '@/components/recommend_author_list'
import shareImage from '@/components/share_image/index'
// import shareCardList from '@/components/sharehall/share_card_list.vue'
import inputContent from '@/components/sharehall/input_content.vue'
import uploadMedia from '@/components/dynamic/upload_media'
import { filterOutHtmlShare } from '@/utils/xss'

export default {
  components: {
    shareOuterCard,
    sharePCard,
    shareInsideCard,
    shareCard,
    buttonLoadMore,
    RAList,
    shareImage,
    uploadMedia,
    // shareCardList
    inputContent
  },
  async beforeRouteLeave(to, from, next) {
    if (this.shareLinkList.length === 0) {
      next()
    } else {
      try {
        await this.$confirm('您有分享未发布，是否发布了再离开？', '提示', {
          confirmButtonText: '去发布',
          cancelButtonText: '不要了',
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          customClass: 'message-box__mobile'
        })
        this.$refs.shareContent.focus()
        next(false)
      } catch (error) {
        if (process.browser) {
          window.sessionStorage.removeItem('shareLink')
          window.sessionStorage.removeItem('shareRef')
          window.sessionStorage.removeItem('articleRef')
        }
        await this.$utils.sleep(100)
        next()
      }
    }
  },
  data() {
    const httpTest = (rule, value, callback) => {
      if (new RegExp('[a-zA-z]+://[^\\s]*').test(this.urlForm.url)) {
        callback()
      } else {
        callback(new Error('请输入包含http(s)://的链接地址'))
      }
    }
    return {
      showSidebar: false,
      urlForm: {
        url: ''
      },
      rules: {
        content: [
          { required: true, message: '请填写感想', trigger: 'blur' }
        ]
      },
      urlRules: {
        url: [
          { required: true, message: '请填写链接地址', trigger: 'change' },
          { validator: httpTest, trigger: 'change' }
        ]
      },
      shareLinkList: [
        // {
        //   type: 'inside',
        //   type: 'outer',
        // }
      ],
      fullscreenLoading: false,
      urlLoading: false,
      options: [ // 排序
        {
          value: 'time',
          label: '最新'
        },
        {
          value: 'hot',
          label: '最热'
        }
      ],
      value: this.$route.query.type || 'time', // 排序
      pull: { // 分页
        params: {
          type: this.$route.query.type || 'time',
          pagesize: 20
        },
        time: 0,
        apiUrl: 'share',
        list: []
      },
      shareHeadActive: false, // 导航是否到顶部
      usersRecommendList: [], // 推荐作者
      usersLoading: false, // 推荐作者
      shareDoneCard: false,
      shareCard: {
        content: '',
        avatarSrc: '',
        username: '',
        reference: [],
        url: process.env.VUE_APP_URL
      },
      saveImg: '',
      createShareLoading: false,
      saveLoading: false, // 保存图片loading
      uploadMediaVisible: false,
      mediaList: [],
      mediaUploading: false,
      totalText: 1000, // 输入框最大限制
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined'])
  },
  watch: {
    shareLinkList: {
      deep: true,
      handler() {
        if (process.browser) {
          window.sessionStorage.setItem('shareLink', JSON.stringify(this.shareLinkList))
        }
      }
    },
    value(newVal) {
      if (newVal === 'hot') {
        this.pull.params.type = 'hot'
      } else if (newVal === 'time') {
        this.pull.params.type = 'time'
      } else {
        this.pull.params.type = 'hot'
      }
      this.$router.push({
        query: {
          type: newVal
        }
      })
      this.pull.time = Date.now()
      this.pull.list.length = 0
    },
    shareDoneCard(newVal) {
      if (!newVal) {
        this.shareCard = {
          content: '',
          avatarSrc: '',
          username: '',
          reference: [],
          url: process.env.VUE_APP_URL
        }
        this.saveImg = ''
      }
    }
  },

  created() {
    this.$nextTick(() => {
      this.initShareLink()
      this.initUrlInput()
    })
  },
  mounted() {
    this.usersrecommend()
    if (process.browser) {
      //
    }
  },
  methods: {
    initShareLink() {
      const shareLink = process.browser ? window.sessionStorage.getItem('shareLink') : '[]'
      const shareLinkParse = JSON.parse(shareLink)
      // console.log('shareLinkParse', shareLinkParse)
      this.shareLinkList = Array.isArray(shareLinkParse) ? shareLinkParse : []
      // console.log(shareLink, this.shareLinkList)
    },
    async initUrlInput() {
      const shareId = process.browser ? window.sessionStorage.getItem('shareRef') : ''
      const articleId = process.browser ? window.sessionStorage.getItem('articleRef') : ''
      if (shareId) {
        this.urlForm.url = `${process.env.VUE_APP_URL}/share/${shareId}`
        await this.getUrlData('urlForm')
      }
      if (articleId) {
        this.urlForm.url = `${process.env.VUE_APP_URL}/p/${articleId}`
        await this.getUrlData('urlForm')
      }
    },
    // 初始化所有表单内容
    resetForm() {
      this.urlForm.url = ''
      this.shareLinkList = []
      this.$refs.urlForm.resetFields()
      // 清空分享内容
      document.querySelector('.content-editable').innerHTML = ''
    },
    setpFunc(formName) {
      return new Promise(resolve => this.$refs[formName].validate(valid => resolve(valid)))
    },
    // 获取输入框内容的信息
    _getInputContent() {
      // 获取分享内容
      let editDom = document.querySelector('.content-editable')
      let editDomContent = editDom.innerHTML.toString()
      // console.log('editDom', editDom.innerHTML)

      // 从 dom 获取 user id
      let userIds = editDom.querySelectorAll('a.tribute-mention')
      const receivingIds = [...userIds].map(i => i.getAttribute('data-user'))
      // console.log('receivingIds', receivingIds)

      return {
        editDomContent: filterOutHtmlShare(editDomContent),
        receivingIds
      }
    },
    // 发布分享
    async pushShare() {
      // console.log('currentUserInfo', this.currentUserInfo)
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      const { editDomContent, receivingIds } = this._getInputContent()

      if (editDomContent.length <= 0) {
        this.$message({ message: '分享内容不能为空', type: 'warning' })
        return
      }
      if (editDomContent.length > this.totalText) {
        this.$message({ message: '分享内容不能超过最高限制', type: 'warning' })
        return
      }
      // if (this.shareLinkList.length <= 0) {
      //   this.$message({ message: '分享引用不能为空', type: 'warning' })
      //   return
      // }
      if (this.mediaUploading) {
        this.$message.warning('媒体正在上传中，请稍后再试')
        return
      }
      // 平台检测
      const idProvider = getCookie('idProvider')
      if (!idProvider) {
        this.$message({ message: '发生错误, 请您重新登录', type: 'error' })
        this.$store.commit('setLoginModal', true)
        return false
      }

      const { name: author = '' } = this.currentUserInfo

      this.fullscreenLoading = true
      const data = {
        author,
        content: editDomContent.trim(),
        short_content_share: (editDomContent.trim()).slice(0, 3000),
        platform: idProvider.toLocaleLowerCase(),
        refs: [],
        media: [],
        receivingIds
      }
      this.shareLinkList.map(i => {
        // 目前只有外展
        data.refs.push({
          url: i.url,
          title: i.title,
          summary: i.summary,
          cover: i.cover
        })
      })
      if (this.mediaList) {
        data.media = this.mediaList.map(item => {
          return {
            type: item.type,
            url: item.url
          }
        })
      }
      // return false

      try {
        const res = await this.$API.createShare(data)
        if (res.code === 0) {
          this.createShareCard(res.data, editDomContent.trim())
          this.pull.list.length = 0
          this.pull.time = Date.now()
          this.uploadMediaVisible = false
          this.resetForm()
          this.$message({ message: '发布成功', type: 'success' })
        } else {
          throw new Error(res)
        }
      } catch (e) {
        console.log(e.toString())
        this.$message({ message: '发布失败', type: 'error' })
      } finally {
        this.fullscreenLoading = false
      }
    },
    // 获取链接内容
    async getUrlData(formName) {
      if (await this.setpFunc(formName)) {
        if (!this.isLogined) return this.$store.commit('setLoginModal', true)
        if (this.urlLoading) return // 拦截重复请求
        const url = this.urlForm.url.trim()
        const urlIncludes = (url, arr) => {
          return arr.filter(i => i.url === url).length !== 0
        }
        if (urlIncludes(url, this.shareLinkList)) return this.$message({ message: '不能引用重复的内容', type: 'warning' })
        // 自动检测url 获取标题 内容等
        this.urlLoading = true
        this.$API.extractRefTitle({ url })
          .then(res => {
            if (res.code === 0) {
              this.$message({ message: '检测完成', type: 'success' })
              res.data.url = url
              this.shareLinkList.push(res.data)
              // 清空数据
              this.urlForm.url = ''
              this.$refs[formName].resetFields()
            } else {
              this.$message({ message: res.message, type: 'error' })
            }
          }).catch(err => {
            console.log('获取信息失败', err)
          }).finally(() => {
            this.urlLoading = false
          })
      }
    },
    removeShareLink(i) {
      this.shareLinkList.splice(i, 1)
    },
    // 输入框改变
    changeInput(val) {
      console.log('val', val)
      this.getUrlData('urlForm')
    },
    // url 输入框聚焦
    focusInput(e) {
      e.target.parentElement.parentElement.classList.add('active')
    },
    // url 输入框失焦
    blurInput(e) {
      e.target.parentElement.parentElement.classList.remove('active')
    },
    // 引用
    refClick(card) {
      this.urlForm.url = `${process.env.VUE_APP_URL}/share/${card.id}`
      this.getUrlData('urlForm')
    },
    ref(val) {
      this.urlForm.url = val
      this.getUrlData('urlForm')
    },
    getListData(res) {
      // console.log('res1', res)
      if (res.data.list && res.data.list.length !== 0) {
        // console.log('1111', res)
        this.pull.list = this.pull.list.concat(res.data.list)
      }
    },
    // 获取推荐作者
    usersrecommend: throttle(async function () {
      this.usersLoading = true
      const params = {
        amount: 3
      }
      await this.$API
        .usersRecommend(params)
        .then(res => {
          if (res.code === 0) {
            this.usersRecommendList = res.data
          } else {
            console.log(`获取推荐用户失败${res.code}, ${res.message}`)
          }
        })
        .catch(err => {
          console.log(`获取推荐用户失败${err}`)
        })
        .finally(() => {
          setTimeout(() => {
            this.usersLoading = false
          }, 300)
        })
    }, 800),
    // 创建卡片
    createShareCard(id, content) {
      this.shareCard.content = content
      this.shareCard.reference = this.shareLinkList.slice(0, 10)
      this.shareCard.url = `${process.env.VUE_APP_URL}/share/${id}`
      console.log(this.shareCard)
      this.$API.getUser(this.currentUserInfo.id).then(res => {
        if (res.code === 0) {
          this.shareCard.avatarSrc = res.data.avatar ? this.$API.getImg(res.data.avatar) : ''
          this.shareCard.username = res.data.nickname || res.data.username
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 清空图片
        this.saveImg = ''
        // 生成图片loading
        this.createShareLoading = true
        // 显示dialog
        this.shareDoneCard = true
        // setTimeout(() => {
        // try {
        // 设置分享卡片高度
        // const shareImage = this.$refs.shareImage.$el
        // const shareCard = this.$refs.shareCard
        // const height = shareImage.offsetHeight || shareImage.clientHeight
        // console.log('height', Math.ceil(height * 0.28))
        // const heightScale = Math.ceil(height * 0.28)
        // shareCard.style.height = `${heightScale}px`
        // } catch (error) {
        // console.log(error)
        // }
        // }, 1000)
        this.createShareImage()
      })
    },
    // 下载图片
    downloadShareImage() {
      this.saveLoading = true
      let linkTag = document.querySelector('#downloadImg')
      const { content } = this.shareCard
      const name = content.length >= 12 ? content.slice(0, 12) + '...' : content
      // 没有则创建
      if (!linkTag) {
        linkTag = document.createElement('a')
        linkTag.id = 'downloadImg'
      }
      linkTag.href = this.saveImg
      linkTag.download = `${name}.png`
      linkTag.click()
      this.saveLoading = false
    },
    // 创建分享的卡片
    createShareImage() {
      this.$nextTick(() => {
        setTimeout(() => {
          const dom = this.$refs.shareImage.$el
          // eslint-disable-next-line no-undef
          html2canvas(dom, {
            useCORS: true,
            allowTaint: true, //允许加载跨域的图片
            tainttest: true, //检测每张图片都已经加载完成
            scrollX: 0,
            scrollY: 0,
            width: dom.clientWidth,
            height: dom.clientHeight
          })
            .then(canvas => {
            // this.saveLocal(canvas)
              this.saveImg = canvas.toDataURL()
            })
            .catch(error => {
              console.log(error)
              this.$toast({})
            }).finally(() => {
            // 生成完毕 关闭loading
              this.createShareLoading = false
            })
        }, 1500)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.sharehall {
  // .minHeight();
}
.sharehall-push {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}
.sharehall-content {
  width: 1200px;
  margin: 20px auto 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.sharehall-push__content {
  background: #fff;
  margin: 20px 0 0;
  padding: 20px;
  border-radius:10px;
  box-sizing: border-box;
  .input-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border-bottom: 1px solid #dbdbdb;
    transition: all .1s;
    &.active {
      border-color: #542DE0;
    }
  }
}
.share-push__content {
  width: 726px;
  box-sizing: border-box;
}
.sharehall-content {
  display: flex;
}
.sharehall-main {
  width: calc(70% - 20px);
  margin: 0 20px 100px 0;
}
.sharehall-other {
  width: 30%;
}
.sharehall-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sharehall-title {
  font-size:20px;
  font-weight: bold;
  color:rgba(0,0,0,1);
  line-height:28px;
  padding: 0;
  margin: 0;
}
.list-card {
  margin-top: 20px;
  &:nth-child(1) {
    margin-top: 0;
  }
}
.sort {
  display: flex;
  align-items: center;
  span {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    &.active {
      font-weight: bold;
      color: @purpleDark;
    }
  }
}
.pull {
  padding: 0 20px;
}
.push-btn {
  display: flex;
  justify-content: space-between;
}
.recommend-author {
  position: sticky;
  top: 70px;
  .ra-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .change {
      width: 20px;
      height: 20px;
      //background: @purpleDark;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
      &-icon {
        width: 72%;
      }
    }
    .ra-head-random {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size:16px;
      font-weight:bold;
      color:@purpleDark;;
      cursor: pointer;
    }
  }
  .ra-content {
    background:rgba(255,255,255,1);
    border-radius: @br10;
    padding: 10px 20px;
    margin-top: 20px;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
.rotate {
  animation: rotate 0.8s ease-in-out infinite;
}
.share-done {
  display: block;
  margin: 0 auto;
  width: 124px;
}
.share-done__title {
  font-size:14px;
  font-weight:bold;
  color:rgba(0,0,0,1);
  line-height:20px;
  padding: 0;
  margin: 10px 0 0;
  text-align: center;
}
.share-done__desciption {
  font-size:14px;
  line-height:20px;
  padding: 0;
  margin: 0;
  text-align: center;
  color: #B2B2B2;
}
.share-card {
  width: 105px;
  height: 222px;
  margin: 10px auto 0;
  // background-color: red;
  overflow: hidden;
  border: 1px solid #f1f1f1;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  &__box {
    // opacity: 0;
    // transform: scale(0.28);
    // transform-origin: 0 0;
    position: fixed;
    left: 100%;
    top: 0;
  }
  &__btn {
    display: block;
    margin: 20px auto 0;
  }
}
</style>

<style lang="less">
.sharehall-push__content {
  .push-input input {
    border: none;
    flex: 1;
  }
}
</style>