<template>
  <div class="sharehall">
    <g-header />
    <div class="sharehall-push">
      <div class="sharehall-push__content">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" @submit.native.prevent>
          <el-form-item label="" prop="content">
            <el-input
              ref="shareContent"
              v-model="ruleForm.content"
              size="mini"
              type="textarea"
              rows="6"
              placeholder="谈谈感想"
            />
          </el-form-item>
        </el-form>

        <el-form ref="urlForm" :model="urlForm" :rules="urlRules" @submit.native.prevent>
          <el-form-item label="" prop="url">
            <div class="input-line">
              <!-- 为了使用from的验证功能, 不能用css实现下划线聚焦了 用js解决 -->
              <el-input
                @focus="focusInput"
                @blur="blurInput"
                @change="changeInput"
                v-model="urlForm.url"
                size="mini"
                class="push-input"
                placeholder="输入链接，包含http(s)://"
              />
              <el-button @click="getUrlData('urlForm')" v-loading="urlLoading" type="primary" size="mini" class="g-button__black ">
                <svg-icon icon-class="enter" class="icon" />
              </el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="shareLinkList.length !== 0">
            <div class="share-push__content">
              <template v-for="(item, index) in shareLinkList">
                <shareOuterCard
                  :card="item"
                  v-if="item.ref_sign_id === 0"
                  :key="'shareInsideCard' + index"
                  :idx="index"
                  @removeShareLink="removeShareLink"
                  class="list-card"
                />
                <sharePCard
                  :card="item"
                  v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
                  :key="'shareInsideCard' + index"
                  :idx="index"
                  @removeShareLink="removeShareLink"
                  class="list-card"
                />
                <shareInsideCard
                  :card="item"
                  v-else-if="item.ref_sign_id && item.channel_id === 3"
                  :key="'shareOuterCard' + index"
                  :idx="index"
                  @removeShareLink="removeShareLink"
                  class="list-card"
                />
              </template>
            </div>
          </el-form-item>
          <div class="push-btn">
            <el-button @click="pushShare('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading" type="primary" class="g-button__black " size="mini">
              <svg-icon icon-class="edit" class="icon" />
              发布
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="sharehall-content">
      <div class="sharehall-main">
        <div class="sharehall-head">
          <h3 class="sharehall-title">
            分享大厅
          </h3>
          <div class="sort">
            <span @click="value = options[0].value" :class="value === options[0].value && 'active'">{{ options[0].label }}</span>
            &nbsp;/&nbsp;
            <span @click="value = options[1].value" :class="value === options[1].value && 'active'">{{ options[1].label }}</span>
          </div>
        </div>
        <shareCard
          v-for="(item, index) in pull.list"
          :key="index"
          :card="item"
          @refClick="refClick"
          @ref="ref"
          class="list-card"
        />
        <buttonLoadMore :params="pull.params" :api-url="pull.apiUrl" :autoRequestTime="pull.time" @buttonLoadMore="getListData" :type-index="0" />
      </div>
      <div class="sharehall-other">
        <div v-if="usersRecommendList.length !== 0" class="recommend-author">
          <div class="ra-head">
            <h3 class="sharehall-title">
              推荐作者
            </h3>
            <span @click="usersrecommend" class="ra-head-random">
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
          <div v-if="createShareLoading" class="share-full" />
          <img v-if="saveImg" :src="saveImg" alt="save">
          <shareImage
            ref="shareImage"
            v-else
            :content="shareCard.content"
            :avatarSrc="shareCard.avatarSrc"
            :username="shareCard.username"
            :reference="shareCard.reference"
            :url="shareCard.url"
            class="share-card__box"
          />
        </div>
        <el-button :disabled="saveLoading" v-loading="saveLoading" @click="downloadShareImage" type="primary" class="share-card__btn">
          保存并分享卡片
        </el-button>
      </div>
    </m-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import throttle from 'lodash/throttle'
import domtoimage from 'dom-to-image'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import shareCard from '@/components/share_card/index.vue'
import { getCookie } from '@/utils/cookie'
import buttonLoadMore from '@/components/button_load_more/index.vue'
import RAList from '@/components/recommend_author_list'
import shareImage from '@/components/share_image/index'
export default {
  components: {
    shareOuterCard,
    sharePCard,
    shareInsideCard,
    shareCard,
    buttonLoadMore,
    RAList,
    shareImage
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
      ruleForm: {
        content: ''
      },
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
      saveLoading: false // 保存图片loading
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
    }
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
        }
        await this.$utils.sleep(100)
        next()
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
  },
  methods: {
    initShareLink() {
      const shareLink = process.browser ? window.sessionStorage.getItem('shareLink') : '[]'
      const shareLinkParse = JSON.parse(shareLink)
      // console.log('shareLinkParse', shareLinkParse)
      this.shareLinkList = Array.isArray(shareLinkParse) ? shareLinkParse : []

      // console.log(shareLink, this.shareLinkList)
    },
    initUrlInput() {
      const id = process.browser ? window.sessionStorage.getItem('shareRef') : ''
      if (id) {
        this.urlForm.url = `${process.env.VUE_APP_URL}/share/${id}`
        this.getUrlData('urlForm')
      }
    },
    // 初始化所有表单内容
    resetForm() {
      this.ruleForm.content = ''
      this.urlForm.url = ''
      this.shareLinkList = []
      this.$refs.ruleForm.resetFields()
      this.$refs.urlForm.resetFields()
    },
    setpFunc(formName) {
      return new Promise(resolve => this.$refs[formName].validate(valid => resolve(valid)))
    },
    // 发布分享
    async pushShare(formName) {
      if (await this.setpFunc(formName)) {
        // console.log('currentUserInfo', this.currentUserInfo)
        if (!this.isLogined) return this.$store.commit('setLoginModal', true)
        if (this.shareLinkList.length <= 0) return this.$message({ message: '分享引用不能为空', type: 'warning' })
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
          content: this.ruleForm.content.trim(),
          platform: idProvider.toLocaleLowerCase(),
          refs: []
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
        // return false
        this.$API.createShare(data)
          .then(res => {
            if (res.code === 0) {
              this.createShareCard(res.data)
              this.resetForm()
              this.pull.list.length = 0
              this.pull.time = Date.now()
              this.$message({ message: '发布成功', type: 'success' })
            } else {
              this.$message({ message: '发布失败', type: 'error' })
            }
          }).catch(err => {
            console.log(err)
            this.$message({ message: '发布失败', type: 'error' })
          }).finally(() => {
            this.fullscreenLoading = false
          })
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
    createShareCard(id) {
      const setShareCard = id => {
        this.shareCard.content = this.ruleForm.content
        this.shareCard.reference = this.shareLinkList.slice(0, 10)
        this.shareCard.url = `${process.env.VUE_APP_URL}/share/${id}`
      }
      setShareCard(id)
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
        this.createShareImage(this.ruleForm.content)
      })
    },
    // 下载图片
    downloadShareImage() {
      this.saveLoading = true
      const linkTag = document.querySelector('#downloadImg')
      if (linkTag) {
        linkTag.click()
      } else {
        const link = document.createElement('a')
        const { content } = this.shareCard
        const name = content.length >= 12 ? content.slice(0, 12) + '...' : content
        link.id = 'downloadImg'
        link.download = `${name}.png`
        link.href = this.saveImg
        link.click()
      }
      this.saveLoading = false
    },
    // 创建分享的卡片
    createShareImage() {
      this.$nextTick(() => {
        setTimeout(() => {
          const dom = this.$refs.shareImage.$el
          domtoimage.toPng(dom, { quality: 1, width: dom.clientWidth, height: dom.clientHeight })
            .then(dataUrl => {
              this.saveImg = dataUrl
            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error)
            }).finally(() => {
              // 生成完毕 关闭loading
              this.createShareLoading = false
            })
        }, 1000)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sharehall {
  .minHeight();
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
  width: 766px;
  flex: 0 0 766px;
  margin: 0 20px 100px 0;
}
.sharehall-other {
  flex: 1;
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
  justify-content: flex-end;
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
  .share-full {
    position: absolute;
    background-color: #fff;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  &__box {
    // opacity: 0;
    // transform: scale(0.28);
    transform-origin: 0 0;
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
