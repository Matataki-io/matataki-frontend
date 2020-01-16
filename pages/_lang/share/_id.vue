<template>
  <div @click.stop="hideClient" class="share">
    <g-header />
    <div v-loading="loading" class="container-loading">
      <main class="container">
        <shareHeader
          :id="content.uid"
          :avatar="userInfo.avatar"
          :username="userInfo.nickname || userInfo.username"
          :time="content.create_time"
          :read="content.read"
          :hash="content.hash"
        />
        <shareMain :content="shareContent" />
      </main>
      <shareFooter
        v-loading="footerLoading"
        :bookmarked="currentProfile.is_bookmarked"
        :isLiked="Number(currentProfile.is_liked)"
        :likes="content.likes"
        :dislikes="content.dislikes"
        @bookmarked="bookmarked"
        @share="shareDialogVisible = true"
        @like="like"
        class="footer"
      />
    </div>
    <reference :show="true" :offSlidebar="offSlidebar">
      <template slot="left">
        <div class="reference-header">
          <span class="reference-header__title">
            已引用<span>{{ refernceTotal }}</span>
          </span>

          <span class="reference-header__sort">
            正序
            <svg-icon icon-class="sort" />
          </span>
        </div>
      </template>
      <template slot="left-prompt">
        已引用<span>{{ refernceTotal }}</span>
      </template>

      <template slot="right">
        <div class="reference-header">
          <span class="reference-header__title">
            被引用<span>{{ berefernceTotal }}</span>
          </span>

          <span class="reference-header__sort">
            倒序
            <svg-icon icon-class="sort" />
          </span>
        </div>
      </template>
      <template slot="right-prompt">
        被引用<span>{{ berefernceTotal }}</span>
      </template>
      <quoteReference slot="ref" :nowTime="nowTime" @getArticle="getArticle" />
      <quoteBereference slot="beref" :nowTime="nowTime" @getArticle="getArticle" />
    </reference>
    <m-dialog v-model="shareDialogVisible" width="400px">
      <!-- 如果内容过多可以抽离 -->
      <div class="dialog-content">
        <div class="dialog-content__btn">
          <div @click="shareImageShow" class="btn-icon">
            <svg-icon icon-class="share_img" />
          </div>
          <p class="btn-text">
            生成图片
          </p>
        </div>
        <div class="dialog-content__btn">
          <div @click="copy(shareLink)" class="btn-icon">
            <svg-icon icon-class="copy3" />
          </div>
          <p class="btn-text">
            复制分享链接
          </p>
        </div>
      </div>
      <socialShare
        :title="shareContent"
        :link="link"
        :qq-title="title"
        class="social-share"
      />
      <wechat :link="link" style="margin: 60px 0 0 0;" />
    </m-dialog>

    <m-dialog v-model="shareDoneCard" width="400px">
      <!-- 如果内容过多可以抽离 -->
      <div>
        <img src="@/assets/img/done.png" alt="done" class="share-done">
        <h4 class="share-done__title">
          分享已发布
        </h4>
        <p class="share-done__desciption">
          保存分享卡片把思考与灵感传达给更多的人
        </p>
        <div
          ref="shareCard"
          v-loading="createShareLoading"
          class="share-card"
        >
          <img v-if="saveImg" :src="saveImg" alt="save">
        </div>
        <el-button :disabled="saveLoading" v-loading="saveLoading" @click="downloadShareImage" type="primary" class="share-card__btn">
          保存并分享卡片
        </el-button>
        <shareImage
          ref="shareImage"
          v-if="!saveImg"
          :content="shareCard.content"
          :avatarSrc="shareCard.avatarSrc"
          :username="shareCard.username"
          :reference="shareCard.reference"
          :url="shareCard.url"
          card-type="read"
          class="share-card__box"
        />
      </div>
    </m-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookie'

import shareHeader from '@/components/share_page/share_header'
import shareMain from '@/components/share_page/share_main'
import shareFooter from '@/components/share_page/share_footer'
// import quote from '@/components/share_page/quote'
import reference from '@/components/reference/index'
import socialShare from '@/components/modal/social_share'
import wechat from '@/components/scan/wechat.vue'
import quoteReference from '@/components/share_page/quote_reference'
import quoteBereference from '@/components/share_page/quote_bereference'
import shareImage from '@/components/share_image/index'

export default {
  components: {
    shareHeader,
    shareMain,
    shareFooter,
    reference,
    socialShare,
    wechat,
    quoteReference,
    quoteBereference,
    shareImage

  },
  data() {
    return {
      offSlidebar: 0, // time components watch off slidebar
      loading: false,
      footerLoading: false, // footer loading
      shareContent: '', // 分享内容
      content: Object.create(null), // 文章信息
      userInfo: Object.create(null), // 用户信息
      currentProfile: Object.create(null), // 当前相关信息
      shareDialogVisible: false, // 分享 dialog
      // showQuote: false, // refernces
      nowTime: 0, // refernces
      refernceTotal: 0, // refernces slidebar
      berefernceTotal: 0, // refernces slidebar
      shareDoneCard: false, // share card
      shareCard: { // share card data
        content: '',
        avatarSrc: '',
        username: '',
        reference: [],
        url: process.env.VUE_APP_URL
      },
      saveImg: '', // share img src
      createShareLoading: false,
      saveLoading: false // 保存图片loading
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    link() {
      if (process.browser) return `${process.env.VUE_APP_URL}/share/${this.$route.params.id}`
      else return process.env.VUE_APP_URL
    },
    title() {
      return `来自Matataki「${this.userInfo.nickname || this.userInfo.username}」用户的分享`
    },
    shareLink() {
      return `${this.title} - ${this.link}` || process.env.VUE_APP_URL
    }
  },
  watch: {
    nowTime() {
      this.getReferenceCount('postsReferences', {}, 'refernce')
      this.getReferenceCount('postsPosts', {}, 'berefernce')
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
    // 无id
    const { id = '' } = this.$route.params
    this.init(id)
    this.getReferenceCount('postsReferences', {}, 'refernce')
    this.getReferenceCount('postsPosts', {}, 'berefernce')
  },
  methods: {
    init(id) {
      if (!id) return this.$router.go(-1)
      this.getDetail(id)
      this.getCurrentProfile(id)
      this.reading(id)
    },
    // 客户端打开文章后提交，表示开始阅读
    async reading(id) {
      if (!getCookie('ACCESS_TOKEN')) return
      await this.$API.reading(id)
        .then(res => console.log(`reading ${res.message}`))
        .catch(err => console.log(`reading err ${err}`))
    },
    // 获取详情内容
    getDetail(id) {
      this.loading = true
      this.$API.shareDetail(id)
        .then(res => {
          if (res.code === 0) {
            this.content = res.data
            // 如果不是分享返回上一页
            if (res.data.channel_id !== 3) return this.$router.go(-1)
            else {
              this.authorInfo(res.data.uid)
              this.getIpfsData(res.data.hash)
              this.read(res.data.hash)

              // share
              this.setShareContentAndUrl(res.data.short_content, res.data.id)
            }
          } else {
            console.log(res.message)
            this.$message({ type: 'error', message: '获取内容失败, 请刷新后重试' })
            this.loading = false
          }
        }).catch(err => {
          console.log(err)
          this.$message({ type: 'error', message: '获取内容失败, 请刷新后重试' })
          this.loading = false
        })
    },
    // 得到作者信息
    authorInfo(id) {
      this.$API.getUser(id)
        .then(res => {
          if (res.code === 0) {
            this.userInfo = res.data

            // share
            this.setShareUser(res.data.avatar, res.data.nickname || res.data.username)
          } else {
            console.log(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 得到ipfs内容
    async getIpfsData(hash) {
      if (!hash) return console.log('no hash')
      await this.$API
        .getIpfsData(hash)
        .then(res => {
          if (res.code === 0) {
            this.shareContent = res.data.content
          } else {
            this.$message({ type: 'error', message: res.message })
            console.log(res.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({ type: 'error', message: '获取文章内容失败' })
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 增加文章阅读量
    async read(hash) {
      await this.$API.read(hash).catch(err => console.log('add read amount error', err))
    },
    // 获取当前文章相关信息
    async getCurrentProfile(id) {
      if (!getCookie('ACCESS_TOKEN')) return
      await this.$API.currentProfile({ id })
        .then(res => {
          if (res.code === 0) this.currentProfile = res.data
          else console.log(res.message)
        }).catch(err => {
          console.log(err)
        })
    },
    // 收藏
    async bookmarked(bookmarked) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      this.footerLoading = true
      // 状态码不为200 !!! 所以取消了res.code === 0
      if (bookmarked) {
        this.$confirm('是否取消收藏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box__mobile'
        }).then(async () => {
          await this.$API.unbookmark(this.currentProfile.id)
            .then(res => {
              this.$message({ type: 'success', message: '取消成功' })
              this.currentProfile.is_bookmarked = 0
            })
            .catch(err => console.log(err))
            .finally(() => {
              this.footerLoading = false
            })
        }).catch(() => {
          this.footerLoading = false
        })
      } else {
        await this.$API.bookmark(this.currentProfile.id)
          .then(res => {
            this.$message({ type: 'success', message: '收藏成功' })
            this.currentProfile.is_bookmarked = 1
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.footerLoading = false
          })
      }
    },
    // 推荐 不推荐
    async like(isLiked) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      if (this.currentProfile.is_liked !== 0) return this.$message({ type: 'warning', message: '您已经操作过了哦' }) // 减少不必要的请求
      this.footerLoading = true
      if (Number(isLiked) === 1) { // 不推荐
        await this.$API.dislike(this.content.id, { time: 0 })
          .then(res => {
            if (res.code === 0) {
              this.content.dislikes++
              this.currentProfile.is_liked = 1
              this.$message({ type: 'success', message: res.message })
            } else this.$message({ type: 'error', message: res.message })
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.footerLoading = false
          })
      } else if (Number(isLiked === 2)) { // 推荐
        await this.$API.like(this.content.id, { time: 0 })
          .then(res => {
            if (res.code === 0) {
              this.content.likes++
              this.currentProfile.is_liked = 2
              this.$message({ type: 'success', message: res.message })
            } else this.$message({ type: 'error', message: res.message })
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.footerLoading = false
          })
      }
    },
    hideClient() {
      this.offSlidebar = Date.now()
    },
    getArticle(id, popEvent) {
      // console.log(id, popEvent)
      this.$route.params.id = id
      const { origin } = window.location
      const url = `${origin}/share/${id}`
      history.replaceState({}, '', url)
      // // 切换 url不刷新
      // if (!popEvent) {
      //   const url = `${window.location.origin}/share/${id}`
      //   history.pushState({}, '', url)
      // }

      // refernce
      this.nowTime = Date.now()

      this.init(id)
    },
    copy(val) {
      this.$copyText(val).then(
        () => this.$message.success(this.$t('success.copy')),
        () => this.$message.error(this.$t('error.copy'))
      )
    },
    // 获取引用数量
    async getReferenceCount(url, params, type) {
      try {
        const res = await this.$API.getBackendData({ url, params, urlReplace: this.$route.params.id }, false)
        if (res.code === 0) {
          if (type === 'refernce') {
            this.refernceTotal = res.data.count

            // share
            this.setShareRef(res.data.list)
          } else if (type === 'berefernce') this.berefernceTotal = res.data.count
          else this.refernceTotal = res.data.count
        } else console.log(res.message)
      } catch (error) { console.log(error) }
    },
    // 显示分享框
    shareImageShow() {
      this.shareDialogVisible = false
      this.shareDoneCard = true
      // 清空图片
      this.saveImg = ''
      // 生成图片loading
      this.createShareLoading = true
      // 显示dialog
      this.shareDoneCard = true
      this.createShareImage()
    },
    // 设置内容和url
    setShareContentAndUrl(content, id) {
      this.shareCard.content = content
      this.shareCard.url = `${process.env.VUE_APP_URL}/share/${id}`
    },
    // 设置用户信息
    setShareUser(avatar, username) {
      this.shareCard.avatarSrc = avatar ? this.$API.getImg(avatar) : ''
      this.shareCard.username = username
    },
    // 设置引用
    setShareRef(ref) {
      this.shareCard.reference = ref.slice(0, 10)
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
    }
  }
}
</script>

<style lang="less" scoped>
.share {
  .minHeight();
}
@width: 600px;
.container-loading {
  width: @width;
  margin: 20px auto 0;
  padding: 0 0 100px 0;
}
.container {
  background-color: #fff;
  border-radius:10px;
  padding: 0 0 20px 0;
  margin: 0;
}
.footer {
  width: @width;
  padding: 10px 0;
  margin: 30px auto 0;
}

.dialog-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .btn-icon {
    width: 60px;
    height: 60px;
    // background: #f9f9f9;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    cursor: pointer;
  }
  .btn-text {
    font-size: 12px;
    color: #333;
    text-align: center;
    margin: 4px 0 0 0;
  }
}

.social-share {
  margin-top: 10px;
}

.reference-header {
  margin-top: 20px;
  &__title {
    font-size:24px;
    font-weight:bold;
    color:rgba(0,0,0,1);
    line-height:33px;
    span {
      color: @purpleDark;
      margin-left: 6px;
    }
  }

  &__sort {
    margin-left: 20px;
    color: @purpleDark;
    font-size:16px;
    line-height:22px;
  }
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
